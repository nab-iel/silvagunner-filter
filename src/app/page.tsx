"use client";

import { useState, useEffect } from "react";
import { Video } from "app/interface";
import VideoCard from "./components/videocard";

// Helper to convert "HH:MM:SS" or "MM:SS" to seconds for filtering
const durationToSeconds = (durationStr: string | null): number => {
  if (!durationStr) return 0;
  const parts = durationStr.split(":").map(Number);
  let seconds = 0;
  if (parts.length === 3) {
    // HH:MM:SS
    seconds += parts[0] * 3600;
    seconds += parts[1] * 60;
    seconds += parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    seconds += parts[0] * 60;
    seconds += parts[1];
  } else if (parts.length === 1) {
    // SS
    seconds += parts[0];
  }
  return seconds;
};

export default function Home() {
  const [videoData, setVideoData] = useState<Video[]>([]);
  const [processedVideoData, setProcessedVideoData] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [minDuration, setMinDuration] = useState("");
  const [maxDuration, setMaxDuration] = useState("");
  const [minViews, setMinViews] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popularity">(
    "newest"
  );

  const fetchVideoData = async () => {
    setLoading(true);
    setError(null);
    setVideoData([]);

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

  useEffect(() => {
    let processedData = [...videoData];

    // 1. Apply Filters
    const minSec = minDuration ? parseInt(minDuration) : null;
    const maxSec = maxDuration ? parseInt(maxDuration) : null;
    const minViewCount = minViews ? parseInt(minViews) : null;

    if (minSec !== null || maxSec !== null) {
      processedData = processedData.filter((video) => {
        const videoSec = durationToSeconds(video.duration);
        const passesMin = minSec !== null ? videoSec >= minSec : true;
        const passesMax = maxSec !== null ? videoSec <= maxSec : true;
        return passesMin && passesMax;
      });
    }

    if (minViewCount !== null) {
      processedData = processedData.filter((video) => {
        const viewCount = video.statistics
          ? parseInt(video.statistics.viewCount)
          : 0;
        return viewCount >= minViewCount;
      });
    }

    // 2. Apply Sorting
    if (sortBy === "newest") {
      processedData.sort(
        (a, b) =>
          new Date(b.snippet.publishedAt).getTime() -
          new Date(a.snippet.publishedAt).getTime()
      );
    } else if (sortBy === "oldest") {
      processedData.sort(
        (a, b) =>
          new Date(a.snippet.publishedAt).getTime() -
          new Date(b.snippet.publishedAt).getTime()
      );
    } else if (sortBy === "popularity") {
      processedData.sort((a, b) => {
        const viewsA = a.statistics ? parseInt(a.statistics.viewCount) : 0;
        const viewsB = b.statistics ? parseInt(b.statistics.viewCount) : 0;
        return viewsB - viewsA;
      });
    }

    setProcessedVideoData(processedData);
  }, [videoData, minDuration, maxDuration, minViews, sortBy]);

  return (
    <main className="flex min-h-screen bg-white dark:bg-black">
      {/* Sidebar */}
      <div className="w-96 bg-gray-50 dark:bg-gray-900/50 p-6 flex flex-col gap-6 border-r border-gray-200 dark:border-gray-800 flex-shrink-0">
        <h1 className="text-2xl font-bold">YouTube API Tester</h1>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click the button to fetch the latest videos from the SiIvaGunner
            channel.
          </p>
          <button
            onClick={fetchVideoData}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-500 transition-colors"
          >
            {loading ? "Loading..." : "Fetch Video Data"}
          </button>
        </div>

        {/* Filter & Sort Section */}
        <div className="flex flex-col gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Filters & Sorting</h2>
          <div>
            <label className="block text-sm font-medium mb-1">
              Duration (seconds)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minDuration}
                onChange={(e) => setMinDuration(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxDuration}
                onChange={(e) => setMaxDuration(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="minViews"
              className="block text-sm font-medium mb-1"
            >
              Minimum View Count
            </label>
            <input
              type="number"
              id="minViews"
              placeholder="e.g., 10000"
              value={minViews}
              onChange={(e) => setMinViews(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />
          </div>
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "newest" | "oldest" | "popularity")
              }
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {error && (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading videos...</p>
          </div>
        )}

        {!loading &&
          !error &&
          videoData.length > 0 &&
          processedVideoData.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
              {processedVideoData.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}

        {!loading &&
          !error &&
          videoData.length > 0 &&
          processedVideoData.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">
                No videos match your current filters.
              </p>
            </div>
          )}

        {!loading && !error && videoData.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              Click "Fetch Video Data" to see the results.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}