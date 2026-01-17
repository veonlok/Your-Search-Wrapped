import type { SearchEntry, SearchData, CategoryCount, TimeDistribution, DayDistribution } from './types';

const GOOGLE_SEARCH_PATTERNS = [
  /google\.com\/search/,
  /google\.[a-z.]+\/search/,
  /www\.google\.[a-z.]+\/search/,
];

const CATEGORIES = {
  'Technology': ['software', 'programming', 'code', 'tech', 'computer', 'app', 'javascript', 'python', 'react', 'api', 'github', 'development', 'developer', 'html', 'css', 'database', 'server', 'cloud', 'ai', 'machine learning', 'algorithm'],
  'News & Current Events': ['news', 'breaking', 'today', 'current', 'latest', 'politics', 'election', 'government', 'world', 'country'],
  'Shopping': ['buy', 'purchase', 'price', 'shop', 'store', 'sale', 'deal', 'amazon', 'order', 'product'],
  'Entertainment': ['movie', 'music', 'game', 'video', 'netflix', 'youtube', 'watch', 'play', 'song', 'album', 'streaming', 'tv show', 'series'],
  'Health & Fitness': ['health', 'medical', 'doctor', 'symptom', 'fitness', 'exercise', 'workout', 'nutrition', 'diet', 'wellness'],
  'Education': ['learn', 'tutorial', 'course', 'how to', 'guide', 'education', 'study', 'university', 'college', 'school'],
  'Travel': ['travel', 'flight', 'hotel', 'vacation', 'trip', 'destination', 'booking', 'tourism'],
  'Food & Cooking': ['recipe', 'food', 'restaurant', 'cooking', 'meal', 'cuisine', 'dish'],
  'Sports': ['sports', 'football', 'basketball', 'soccer', 'baseball', 'game', 'team', 'player', 'match'],
  'Weather': ['weather', 'forecast', 'temperature', 'rain', 'snow', 'climate'],
};

function extractQueryFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // Extract 'q' parameter from Google search URLs
    const query = urlObj.searchParams.get('q');
    return query ? decodeURIComponent(query) : null;
  } catch {
    return null;
  }
}

function isGoogleSearch(url: string): boolean {
  return GOOGLE_SEARCH_PATTERNS.some(pattern => pattern.test(url));
}

function categorizeQuery(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      return category;
    }
  }
  
  return 'Other';
}

export function parseHistoryFile(content: string): SearchEntry[] {
  const searches: SearchEntry[] = [];
  
  try {
    // Try parsing as JSON (Chrome/Edge format)
    const data = JSON.parse(content);
    
    if (data.Browser_History) {
      // Chrome Takeout format
      for (const entry of data.Browser_History) {
        if (entry.url && isGoogleSearch(entry.url)) {
          const query = extractQueryFromUrl(entry.url);
          if (query) {
            searches.push({
              query,
              url: entry.url,
              timestamp: new Date(entry.time_usec ? parseInt(entry.time_usec) / 1000 : entry.timestamp || Date.now()),
              title: entry.title,
            });
          }
        }
      }
    } else if (Array.isArray(data)) {
      // Generic JSON array format
      for (const entry of data) {
        if (entry.url && isGoogleSearch(entry.url)) {
          const query = extractQueryFromUrl(entry.url);
          if (query) {
            searches.push({
              query,
              url: entry.url,
              timestamp: new Date(entry.lastVisitTime || entry.timestamp || entry.time || Date.now()),
              title: entry.title,
            });
          }
        }
      }
    }
  } catch (e) {
    // If JSON parsing fails, try parsing as plain text or CSV
    const lines = content.split('\n');
    
    for (const line of lines) {
      // Try to extract URLs from the line
      const urlMatch = line.match(/https?:\/\/[^\s,]+/);
      if (urlMatch) {
        const url = urlMatch[0];
        if (isGoogleSearch(url)) {
          const query = extractQueryFromUrl(url);
          if (query) {
            searches.push({
              query,
              url,
              timestamp: new Date(),
              title: line.split(',')[0] || '',
            });
          }
        }
      }
    }
  }
  
  return searches;
}

export function analyzeSearches(searches: SearchEntry[]): SearchData {
  if (searches.length === 0) {
    throw new Error('No Google searches found in the history file');
  }

  // Count queries
  const queryCount = new Map<string, number>();
  searches.forEach(search => {
    queryCount.set(search.query, (queryCount.get(search.query) || 0) + 1);
  });

  // Get top searches
  const topSearches = Array.from(queryCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([query, count]) => ({ query, count }));

  // Categorize searches
  const categoryCount = new Map<string, number>();
  searches.forEach(search => {
    const category = categorizeQuery(search.query);
    categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
  });

  const categories: CategoryCount[] = Array.from(categoryCount.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: (count / searches.length) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  // Time distribution
  const hourCount = new Map<number, number>();
  searches.forEach(search => {
    const hour = search.timestamp.getHours();
    hourCount.set(hour, (hourCount.get(hour) || 0) + 1);
  });

  const timeDistribution: TimeDistribution[] = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: hourCount.get(hour) || 0,
  }));

  // Day distribution
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayCount = new Map<number, number>();
  searches.forEach(search => {
    const day = search.timestamp.getDay();
    dayCount.set(day, (dayCount.get(day) || 0) + 1);
  });

  const dayDistribution: DayDistribution[] = dayNames.map((day, index) => ({
    day,
    count: dayCount.get(index) || 0,
  }));

  // Date range
  const timestamps = searches.map(s => s.timestamp.getTime()).sort((a, b) => a - b);
  const dateRange = {
    start: new Date(timestamps[0]),
    end: new Date(timestamps[timestamps.length - 1]),
  };

  return {
    totalSearches: searches.length,
    uniqueQueries: queryCount.size,
    dateRange,
    topSearches,
    categories,
    timeDistribution,
    dayDistribution,
    searches,
  };
}
