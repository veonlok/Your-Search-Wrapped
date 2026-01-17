'use client';

import type { SearchData } from '@/lib/types';

interface SearchAnalyticsProps {
  data: SearchData;
}

export default function SearchAnalytics({ data }: SearchAnalyticsProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const maxTimeCount = Math.max(...data.timeDistribution.map(d => d.count));
  const maxDayCount = Math.max(...data.dayDistribution.map(d => d.count));

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Searches"
          value={data.totalSearches.toLocaleString()}
          icon="🔍"
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Unique Queries"
          value={data.uniqueQueries.toLocaleString()}
          icon="✨"
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Date Range"
          value={`${formatDate(data.dateRange.start)} - ${formatDate(data.dateRange.end)}`}
          icon="📅"
          color="from-pink-500 to-pink-600"
          small
        />
        <StatCard
          title="Avg per Day"
          value={Math.round(
            data.totalSearches /
              Math.max(
                1,
                Math.ceil(
                  (data.dateRange.end.getTime() - data.dateRange.start.getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              )
          ).toLocaleString()}
          icon="📊"
          color="from-green-500 to-green-600"
        />
      </div>

      {/* Top Searches */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span>🔥</span> Your Top Searches
        </h2>
        <div className="space-y-3">
          {data.topSearches.slice(0, 10).map((search, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <span className="text-2xl font-bold text-gray-400 dark:text-gray-500 w-8">
                  {index + 1}
                </span>
                <span className="text-gray-800 dark:text-gray-200 truncate font-medium">
                  {search.query}
                </span>
              </div>
              <span className="text-purple-600 dark:text-purple-400 font-semibold ml-4">
                {search.count}x
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span>🏷️</span> Search Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.categories.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {category.category}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {category.count} ({category.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span>⏰</span> Search Activity by Hour
        </h2>
        <div className="flex items-end justify-between gap-1 h-64">
          {data.timeDistribution.map((item) => (
            <div key={item.hour} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-48">
                <div
                  className="w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-t-lg hover:from-purple-600 hover:to-purple-400 transition-all cursor-pointer group relative"
                  style={{
                    height: maxTimeCount > 0 ? `${(item.count / maxTimeCount) * 100}%` : '0%',
                    minHeight: item.count > 0 ? '4px' : '0px',
                  }}
                  title={`${item.hour}:00 - ${item.count} searches`}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.count} searches
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {item.hour}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Day Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span>📅</span> Search Activity by Day
        </h2>
        <div className="space-y-4">
          {data.dayDistribution.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 dark:text-gray-300 w-32">
                  {item.day}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.count} searches
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: maxDayCount > 0 ? `${(item.count / maxDayCount) * 100}%` : '0%',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span>📝</span> Recent Searches
        </h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {data.searches
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 50)
            .map((search, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm"
              >
                <span className="text-gray-800 dark:text-gray-200 truncate flex-1">
                  {search.query}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-xs ml-4 whitespace-nowrap">
                  {new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  }).format(search.timestamp)}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  small?: boolean;
}

function StatCard({ title, value, icon, color, small }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl shadow-lg p-6 text-white`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm opacity-90 mb-2">{title}</p>
          <p className={`font-bold ${small ? 'text-sm' : 'text-3xl'}`}>{value}</p>
        </div>
        <span className="text-4xl opacity-80">{icon}</span>
      </div>
    </div>
  );
}
