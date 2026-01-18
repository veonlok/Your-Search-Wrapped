from typing import List, Tuple
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
    top_searches: List[str] = Field(..., max_length=5)
    top_keywords: List[KeywordFrequency] = Field(..., max_length=8)
    unique_keywords: int
    searches_by_month: List[MonthFrequency]
    searches_by_hour: List[int] = Field(..., min_length=24, max_length=24)
    mbti: str
