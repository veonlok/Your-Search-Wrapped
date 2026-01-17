export interface SearchEntry {
  query: string;
  url: string;
  timestamp: Date;
  title?: string;
}

export interface CategoryCount {
  category: string;
  count: number;
  percentage: number;
}

export interface TimeDistribution {
  hour: number;
  count: number;
}

export interface DayDistribution {
  day: string;
  count: number;
}

export interface SearchData {
  totalSearches: number;
  uniqueQueries: number;
  dateRange: {
    start: Date;
    end: Date;
  };
  topSearches: Array<{ query: string; count: number }>;
  categories: CategoryCount[];
  timeDistribution: TimeDistribution[];
  dayDistribution: DayDistribution[];
  searches: SearchEntry[];
}
