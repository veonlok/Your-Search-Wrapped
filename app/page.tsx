'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import SearchAnalytics from '@/components/SearchAnalytics';
import type { SearchData } from '@/lib/types';

export default function Home() {
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDataAnalyzed = (data: SearchData) => {
    setSearchData(data);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setSearchData(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Your Search Wrapped
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover insights about your Google search patterns. Upload your browser history and see what you've been searching for.
          </p>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              🔒 <strong>Privacy First:</strong> All analysis happens locally in your browser. Your data never leaves your device.
            </p>
          </div>
        </header>

        {!searchData ? (
          <FileUpload onDataAnalyzed={handleDataAnalyzed} setIsAnalyzing={setIsAnalyzing} isAnalyzing={isAnalyzing} />
        ) : (
          <>
            <button
              onClick={handleReset}
              className="mb-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              ← Upload New File
            </button>
            <SearchAnalytics data={searchData} />
          </>
        )}
      </main>
    </div>
  );
}
