'use client';

import { useCallback, useState } from 'react';
import { parseHistoryFile, analyzeSearches } from '@/lib/parser';
import type { SearchData } from '@/lib/types';

interface FileUploadProps {
  onDataAnalyzed: (data: SearchData) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  isAnalyzing: boolean;
}

export default function FileUpload({ onDataAnalyzed, setIsAnalyzing, isAnalyzing }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setIsAnalyzing(true);

    try {
      const text = await file.text();
      const searches = parseHistoryFile(text);
      const data = analyzeSearches(searches);
      onDataAnalyzed(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse history file');
      setIsAnalyzing(false);
    }
  }, [onDataAnalyzed, setIsAnalyzing]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
          dragActive
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          accept=".json,.txt,.csv,.html"
          onChange={handleChange}
          className="hidden"
          disabled={isAnalyzing}
        />
        
        <label
          htmlFor="file-upload"
          className="cursor-pointer"
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            
            <div>
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                {isAnalyzing ? 'Analyzing your searches...' : 'Drop your browser history here'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                or click to select a file
              </p>
            </div>

            {!isAnalyzing && (
              <div className="pt-4">
                <button
                  type="button"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Select File
                </button>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            )}
          </div>
        </label>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400 font-medium">Error: {error}</p>
        </div>
      )}

      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">How to export your browser history:</h3>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
          <div>
            <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Chrome / Edge:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li>Go to <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">chrome://history</code></li>
              <li>Click the three dots menu → Export history</li>
              <li>Or use Google Takeout to export Chrome data</li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Firefox:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li>Open Library → History → Show All History</li>
              <li>Import and Backup → Export</li>
              <li>Note: May need browser extension for JSON export</li>
            </ol>
          </div>

          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Supported formats: JSON, CSV, TXT, HTML
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
