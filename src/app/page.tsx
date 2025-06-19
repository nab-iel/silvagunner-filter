"use client";

import { useState } from "react";

export default function Home() {
  const [videoData, setVideoData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideoData = async () => {
    setLoading(true);
    setError(null);
    setVideoData(null);

    try {
      const res = await fetch("/api/youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setVideoData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-white dark:bg-black">
      {/* Sidebar */}
      <div className="w-96 bg-gray-50 dark:bg-gray-900/50 p-6 flex flex-col gap-6 border-r border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold">YouTube API Tester</h1>
        <div className="flex flex-col gap-4">
          <button
            onClick={fetchVideoData}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-500 transition-colors"
          >
            {loading ? "Loading..." : "Fetch Video Data"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {error && (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {videoData && (
          <div>
            <h2 className="text-2xl font-bold mb-4">API Response</h2>
            <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md text-left text-sm border border-gray-200 dark:border-gray-700">
              {JSON.stringify(videoData, null, 2)}
            </pre>
          </div>
        )}

        {!videoData && !error && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              Enter a Video ID to fetch data.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}