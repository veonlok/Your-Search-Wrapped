from typing import List
from fastapi import APIRouter, HTTPException, UploadFile, File
from datetime import datetime
import json
from zipfile import ZipFile, BadZipFile
import io
from collections import Counter, defaultdict

from schemas.search import WrappedResponse, KeywordFrequency, MonthFrequency

router = APIRouter()

import pandas as pd
import numpy as np
import re
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from a2t.base import EntailmentClassifier
from a2t.tasks import TopicClassificationTask, TopicClassificationFeatures

nltk.download("stopwords", quiet=True)
nltk.download("wordnet", quiet=True)

# Initialize topic classification model (singleton pattern)
_topic_classifier = None
_topic_task = None

def get_topic_classifier():
    global _topic_classifier, _topic_task
    if _topic_classifier is None:
        labels = [
            "Technology",
            "Data Analysis",
            "Natural Language Processing",
            "Education",
            "Personal Development",
            "Literature and Books",
            "Finance and Economics",
            "Programming",
            "Philosophy",
            "General Knowledge"
        ]
        _topic_task = TopicClassificationTask(
            name="Prompt Topic Classification",
            labels=labels,
            hypothesis_template="This prompt is about {label}."
        )
        _topic_classifier = EntailmentClassifier(
            'roberta-large-mnli',
            use_cuda=False,
            half=False
        )
    return _topic_classifier, _topic_task

def process_text(df, field):
    df[field] = df[field].str.lower()

    for i in range(len(df)):
        post_temp = df._get_value(i, field)
        pattern = re.compile(r'https?://[a-zA-Z0-9./-]*/[a-zA-Z0-9?=_.]*[_0-9.a-zA-Z/-]*')    #to match url links present in the post
        post_temp= re.sub(pattern, ' ', post_temp)                                            #to replace that url link with space
        df._set_value(i, field,post_temp)
    
    for i in range(len(df)):
        post_temp=df._get_value(i, field)
        pattern = re.compile(r'[0-9]')                                    #to match numbers from 0 to 9
        post_temp= re.sub(pattern, ' ', post_temp)                        #to replace them with space
        pattern = re.compile('\W+')                                       #to match alphanumeric characters
        post_temp= re.sub(pattern, ' ', post_temp)                        #to replace them with space
        pattern = re.compile(r'[_+]')
        post_temp= re.sub(pattern, ' ', post_temp)
        df._set_value(i, field,post_temp)
    
    for i in range(len(df)):
        post_temp=df._get_value(i, field)
        pattern = re.compile('\s+')                                     #to match multiple whitespaces
        post_temp= re.sub(pattern, ' ', post_temp)                      #to replace them with single whitespace
        df._set_value(i, field, post_temp)

    remove_words = stopwords.words("english")
    for i in range(df.shape[0]):
        post_temp=df._get_value(i, field)
        post_temp=" ".join([w for w in post_temp.split(' ') if w not in remove_words])    #to remove stopwords
        df._set_value(i, field, post_temp)
    
    lemmatizer = WordNetLemmatizer()
    for i in range(df.shape[0]):
        post_temp=df._get_value(i, field)
        post_temp=" ".join([lemmatizer.lemmatize(w) for w in post_temp.split(' ')])   #to implement lemmetization i.e. to group together different forms of a word
        df._set_value(i, field, post_temp)
    
    return df

@router.post("/search-history", response_model=WrappedResponse)
async def analyze_chatgpt_history(file: UploadFile = File(...)):
    """
    Upload a ZIP file of ChatGPT data export.
    Parses conversations.json from openai folder and returns comprehensive analytics.
    """
    if not file.filename.endswith('.zip'):
        raise HTTPException(status_code=400, detail="File must be a ZIP archive")
    
    try:
        # Read ZIP file
        zip_content = await file.read()
        zip_file = ZipFile(io.BytesIO(zip_content))
        
        # Find conversations.json (either in openai folder or root)
        conversations_data = None
        for filename in zip_file.namelist():
            if filename.endswith('conversations.json'):
                with zip_file.open(filename) as f:
                    conversations_data = json.load(f)
                break
        
        if not conversations_data:
            raise HTTPException(status_code=400, detail="No conversations.json found in ZIP")
        
        # Extract user prompts using the mapping structure
        saver = []
        
        for conv in conversations_data:
            # Handle both array and object structures
            if isinstance(conv, list):
                # If conversations_data is already an array of messages
                for item in conv:
                    if isinstance(item, dict) and item.get("role") == "user":
                        text = item.get("content", item.get("text", ""))
                        timestamp = item.get("create_time", item.get("timestamp", 0))
                        if text and isinstance(text, str) and text.strip() and timestamp:
                            saver.append((text, float(timestamp)))
                continue
            
            if not isinstance(conv, dict):
                continue
                
            mapping = conv.get("mapping", {})
            
            for key, value in mapping.items():
                if not isinstance(value, dict):
                    continue
                
                message = value.get("message")
                if not isinstance(message, dict):
                    continue
                
                # Only process user messages
                if message.get("author", {}).get("role") != "user":
                    continue
                
                content = message.get("content")
                if not isinstance(content, dict):
                    continue
                
                create_time = message.get("create_time", 0)
                if not create_time:
                    continue
                
                timestamp = float(create_time)
                
                parts = content.get("parts")
                if isinstance(parts, list):
                    for p in parts:
                        if isinstance(p, str) and p.strip():
                            saver.append((p, timestamp))
        
        if not saver:
            raise HTTPException(status_code=400, detail="No user prompts found in conversations")
        
        df = pd.DataFrame(saver, columns=["prompt", "timestamp"])
        
        # Convert Unix to Datetime (SGT) - same as data_cleaning.py
        df['datetime'] = pd.to_datetime(df['timestamp'], unit='s')
        df['datetime'] = df['datetime'].dt.tz_localize('UTC').dt.tz_convert('Asia/Singapore')
        
        # Extract features for filtering - same as data_cleaning.py
        df['Year'] = df['datetime'].dt.year
        df['Hour'] = df['datetime'].dt.hour
        
        df = process_text(df, "prompt")
        
        # Set the year to analyze (last complete year) - same as data_cleaning.py
        target_year = 2025
        df_yearly = df[df['Year'] == target_year].copy()
        total_searches = len(df_yearly)
        
        all_words = []
        for prompt in df_yearly["prompt"]:
            if isinstance(prompt, str):
                all_words.extend(prompt.split())
        
        # Classify topics using a2t on the same target year prompts
        classifier, task = get_topic_classifier()
        original_prompts = [text for text, ts in saver if isinstance(ts, (int, float)) and pd.to_datetime(ts, unit='s').year == target_year]
        
        # Get top topic via classification
        if original_prompts:
            # Sample up to 100 recent prompts for topic classification
            sample_prompts = original_prompts[:min(100, len(original_prompts))]
            truncated_samples = [p[:500] for p in sample_prompts]  # Truncate long prompts
            
            topic_features = [TopicClassificationFeatures(context=text, label=None) for text in truncated_samples]
            results = classifier(
                task=task,
                features=topic_features,
                return_labels=True,
                return_confidences=True
            )
            # Handle different return formats from classifier
            if isinstance(results, tuple):
                if len(results) == 2:
                    topics, confidences = results
                else:
                    topics = results[0]
            else:
                topics = results
            
            # Extract just the labels if topics are tuples
            if topics and isinstance(topics[0], tuple):
                topics = [t[0] if isinstance(t, tuple) else t for t in topics]
            
            # Get most common topic
            topic_counter = Counter(topics)
            top_topic_tuple = topic_counter.most_common(1)[0] if topic_counter else None
            top_topic = top_topic_tuple[0] if top_topic_tuple else "General Knowledge"
        else:
            top_topic = "General Knowledge"
        
        # Top 5 searches (original prompts before processing)
        original_counter = Counter(original_prompts)
        top_searches = [prompt for prompt, _ in original_counter.most_common(5)]
        
        # Top 8 keywords from processed text
        keyword_counter = Counter(all_words)
        top_keywords = [
            KeywordFrequency(keyword=kw, frequency=count)
            for kw, count in keyword_counter.most_common(8)
        ]
        
        # Unique keywords
        unique_keywords = len(set(all_words))
        
        # Monthly distribution (target year) - same as data_cleaning.py
        # Group by Month and count searches using month numbers (1-12)
        monthly_counts = df_yearly.groupby(df_yearly['datetime'].dt.month).size().to_dict()
        searches_by_month = [
            MonthFrequency(month_number=m, frequency=monthly_counts.get(m, 0))
            for m in range(1, 13)
        ]
        
        # Hourly distribution (target year)
        hourly_counts = df_yearly.groupby(df_yearly['Hour']).size().reindex(range(24), fill_value=0).tolist()
        
        # MBTI inference based on processed keywords
        mbti = infer_mbti(keyword_counter)
        
        return WrappedResponse(
            total_searches_past_year=total_searches,
            top_topic=top_topic[:100] if len(top_topic) > 100 else top_topic,  # Truncate if too long
            top_searches=top_searches,
            top_keywords=top_keywords,
            unique_keywords=unique_keywords,
            searches_by_month=searches_by_month,
            searches_by_hour=hourly_counts,
            mbti=mbti
        )
        
    except BadZipFile:
        raise HTTPException(status_code=400, detail="Invalid ZIP file")
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON in conversations.json")
    except ValueError as e:
        import traceback
        raise HTTPException(status_code=500, detail=f"ValueError: {str(e)}\n{traceback.format_exc()}")
    except Exception as e:
        import traceback
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}\n{traceback.format_exc()}")


def infer_mbti(keyword_counter: Counter) -> str:
    """
    Infer MBTI type based on keyword patterns.
    Simple heuristic based on common word patterns.
    """
    total = sum(keyword_counter.values())
    if total == 0:
        return "INTP"  # Default
    
    # E vs I: social/people words vs technical/analysis words
    e_words = {'people', 'social', 'team', 'communicate', 'party', 'friends', 'share'}
    i_words = {'analyze', 'think', 'code', 'algorithm', 'study', 'research', 'alone'}
    
    e_score = sum(keyword_counter[w] for w in e_words)
    i_score = sum(keyword_counter[w] for w in i_words)
    ei = 'E' if e_score > i_score else 'I'
    
    # N vs S: abstract/future vs concrete/present
    n_words = {'future', 'innovation', 'theory', 'concept', 'imagine', 'possibility', 'idea'}
    s_words = {'practical', 'detail', 'fact', 'current', 'real', 'specific', 'actual'}
    
    n_score = sum(keyword_counter[w] for w in n_words)
    s_score = sum(keyword_counter[w] for w in s_words)
    ns = 'N' if n_score > s_score else 'S'
    
    # T vs F: logic/analysis vs emotion/values
    t_words = {'logic', 'analyze', 'reason', 'objective', 'efficient', 'system', 'solve'}
    f_words = {'feel', 'value', 'empathy', 'harmony', 'personal', 'care', 'emotion'}
    
    t_score = sum(keyword_counter[w] for w in t_words)
    f_score = sum(keyword_counter[w] for w in f_words)
    tf = 'T' if t_score > f_score else 'F'
    
    # J vs P: structured/planned vs flexible/spontaneous
    j_words = {'plan', 'schedule', 'organize', 'structure', 'deadline', 'complete', 'finish'}
    p_words = {'explore', 'flexible', 'spontaneous', 'adapt', 'open', 'option', 'discover'}
    
    j_score = sum(keyword_counter[w] for w in j_words)
    p_score = sum(keyword_counter[w] for w in p_words)
    jp = 'J' if j_score > p_score else 'P'
    
    return f"{ei}{ns}{tf}{jp}"
