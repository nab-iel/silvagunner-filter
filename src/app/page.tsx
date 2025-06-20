"use client";

import { useState } from "react";
import { Video } from "app/interface";
import VideoCard from "./components/videocard";

export default function Home() {
  const [videoData, setVideoData] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

        {!loading && !error && videoData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
            {videoData.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
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