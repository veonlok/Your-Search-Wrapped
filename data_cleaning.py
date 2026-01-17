import pandas as pd
import json
import seaborn as sns
import matplotlib.pyplot as plt
import calendar
from wordcloud import WordCloud, STOPWORDS
import collections

conversation = pd.read_json("conversations.json")
saver = []

df_map_col = conversation["mapping"]
length = len(df_map_col)

for i in range(length):
    data = df_map_col[i]

    for key, value in data.items():
        if not isinstance(value, dict):
            continue

        message = value.get("message")
        if not isinstance(message, dict):
            continue

        if message["author"]["role"] != "user":
            continue

        content = message.get("content")
        if not isinstance(content, dict):
            continue

        timestamp = message["create_time"]

        parts = content.get("parts")
        if isinstance(parts, list):
            for p in parts:
                if isinstance(p, str) and p.strip():
                    saver.append((p, timestamp))

print(len(saver))
df = pd.DataFrame(saver, columns=["Prompt", "Timestamp"])

# Monthly Data #

# 1. Add a Year column to make filtering easy
df['Year'] = df['Datetime'].dt.year

# 2. Set the year you want to analyze (e.g., 2025)
# You can check available years using: print(df['Year'].unique())
target_year = 2025 
df_yearly = df[df['Year'] == target_year].copy()

# 3. Group by Month and count searches
# We use month numbers (1-12) to ensure they stay in chronological order
monthly_counts = df_yearly.groupby(df_yearly['Datetime'].dt.month).size().reset_index(name='Search Count')

# 4. Map month numbers to Names (Jan, Feb, etc.) for the plot
monthly_counts['Month_Name'] = monthly_counts['Datetime'].apply(lambda x: calendar.month_name[x])

monthly_counts

# Heatmap #
earlyBird_Nightowl = None
# 1. Convert Unix to Datetime (SGT)
# We assume 'df' is your existing dataframe with a column called 'Timestamp'
df['Datetime'] = pd.to_datetime(df['Timestamp'], unit='s')

# Localize to UTC and then convert to Singapore Time
df['Datetime'] = df['Datetime'].dt.tz_localize('UTC').dt.tz_convert('Asia/Singapore')

# 2. Extract features for the dashboard
df['Hour'] = df['Datetime'].dt.hour
df['Month'] = df['Datetime'].dt.strftime('%b %Y')  # Format as 'Jan 2026'
df['DayOfWeek'] = df['Datetime'].dt.day_name()

# Create a pivot table for the heatmap
heatmap_data = df.pivot_table(index='DayOfWeek', columns='Hour', values='Timestamp', aggfunc='count').fillna(0)

# Sort days of the week correctly
days_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
heatmap_data = heatmap_data.reindex(days_order)
print(heatmap_data)
heatmap_data.to_csv("heatmap.csv", index=False)

# Day Search: 6 AM (inclusive) to 5 PM (inclusive) -> Hours 6 through 17
day_mask = (df['Hour'] >= 6) & (df['Hour'] <= 17)
total_day_searches = df[day_mask].shape[0]

# Night Search: 6 PM (inclusive) to 5 AM (inclusive) -> Hours 18-23 and 0-5
# We can use the inverse of the day mask (~) to get the rest of the 24 hours
total_night_searches = df[~day_mask].shape[0]

print(f"Total searches (6am - 5pm): {total_day_searches}")
print(f"Total searches (6pm - 5am): {total_night_searches}")
if total_day_searches > total_night_searches:
    earlyBird_Nightowl = "Early Bird"
else:
    earlyBird_Nightowl = "Night Owl"

print(earlyBird_Nightowl)

# top_word # 
# 1. Prepare your data (Assuming 'saver' is your list of tuples)
# Extract just the text from (text, timestamp)
all_prompts = " ".join([entry[0] for entry in saver])

# 2. Set up Stopwords
# You can add custom words you want to ignore (like 'tell', 'show', 'give')
custom_stopwords = set(STOPWORDS)
custom_stopwords.update(["code", "script", "function", "write", "print", "help", "explain", 
    "error", "fix", "output", "using", "use", "create", "make", 
    "java", "python", "pandas", "dataframe", "list", "dictionary", 
    "string", "variable", "import", "return", "class", "method",
    "give", "show", "tell", "find", "example", "will", "s"]) # Optional: add more

# 3. Create the Word Cloud
wordcloud = WordCloud(
    width=800, 
    height=400,
    background_color='white',
    stopwords=custom_stopwords,
    max_words=100,
    colormap='viridis' # Good for high-contrast visibility
).generate(all_prompts)

# 4. Display the Top 5 Words in the console
# Use collections to get an exact count
words = [w for w in all_prompts.lower().split() if w not in custom_stopwords and w.isalpha()]
top_15 = collections.Counter(words).most_common(15)

word_counts_list = collections.Counter(words).most_common()

# 2. Convert to a DataFrame
df_top_words = pd.DataFrame(word_counts_list, columns=["Word", "Count"])

df_top_words = df_top_words[1:21]
df_top_words