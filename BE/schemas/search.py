from typing import List, Dict
from pydantic import BaseModel, Field


class KeywordFrequency(BaseModel):
    keyword: str
    frequency: int


class MonthFrequency(BaseModel):
    month_number: int = Field(..., ge=1, le=12)
    frequency: int


class WrappedResponse(BaseModel):
    total_searches_past_year: int
    top_topic: str
    top_topic_percentage: int  # Percentage of prompts classified as top topic
    top_searches: List[str] = Field(..., max_length=5)
    top_keywords: List[KeywordFrequency] = Field(..., max_length=8)
    unique_keywords: int
    searches_by_month: List[MonthFrequency]
    searches_by_hour: List[int] = Field(..., min_length=24, max_length=24)
    heatmap_data: Dict[str, List[int]]  # Day of week -> 24 hourly counts
    early_bird_night_owl: str  # "Early Bird" or "Night Owl"
    mbti: str
