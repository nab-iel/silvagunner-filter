"use client";

import { useState, useEffect } from "react";
import { Video } from "app/interface";
import { VideoCard } from "./components/VideoCard";
import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/Input";
import { Select } from "./components/ui/Select";
import {
  MessageContainer,
  VideoGrid,
  Section,
} from "./components/ui/Layout";

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [minDuration, setMinDuration] = useState("");
  const [maxDuration, setMaxDuration] = useState("");
  const [minViews, setMinViews] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popularity">(
    "newest"
  );

  const fetchVideoData = async (token: string | null = null) => {
    const isInitialLoad = token === null;
    if (isInitialLoad) {
      setLoading(true);
      setVideoData([]);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const res = await fetch("/api/youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageToken: token }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setVideoData((prev) => [...prev, ...data.videos]);
      setNextPageToken(data.nextPageToken);
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
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
      <aside className="w-96 bg-gray-50 dark:bg-gray-900/50 p-6 flex flex-col gap-6 border-r border-gray-200 dark:border-gray-800 flex-shrink-0">
        <h1 className="text-2xl font-bold">SiIvaGunner Filter</h1>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click the button to fetch the latest videos from the SiIvaGunner
            channel.
          </p>
          <Button
            size="full"
            onClick={() => fetchVideoData()}
            disabled={loading}
          >
            {loading ? "Loading..." : "Fetch Video Data"}
          </Button>
        </div>

        <Section>
          <h2 className="text-lg font-semibold">Filters & Sorting</h2>
          <div>
            <label className="block text-sm font-medium mb-1">
              Duration (seconds)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minDuration}
                onChange={(e) => setMinDuration(e.target.value)}
              />
              <span className="text-gray-500">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxDuration}
                onChange={(e) => setMaxDuration(e.target.value)}
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
            <Input
              type="number"
              id="minViews"
              placeholder="e.g., 10000"
              value={minViews}
              onChange={(e) => setMinViews(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium mb-1">
              Sort By
            </label>
            <Select
              id="sortBy"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "newest" | "oldest" | "popularity")
              }
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popularity">Most Popular</option>
            </Select>
          </div>
        </Section>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {error && <MessageContainer>{error}</MessageContainer>}
        {loading && <MessageContainer>Loading videos...</MessageContainer>}

        {!loading && !error && videoData.length === 0 && (
          <MessageContainer>
            Click "Fetch Video Data" to see the results.
          </MessageContainer>
        )}

        {!loading && !error && videoData.length > 0 && (
          <>
            {processedVideoData.length > 0 ? (
              <VideoGrid>
                {processedVideoData.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </VideoGrid>
            ) : (
              <MessageContainer>
                No videos match your current filters.
              </MessageContainer>
            )}

            {nextPageToken && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => fetchVideoData(nextPageToken)}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}