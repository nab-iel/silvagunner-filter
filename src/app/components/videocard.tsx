"use client";

import { Video } from "app/interface";

function formatViewCount(count: string): string {
  const num = parseInt(count);
  if (isNaN(num)) return "";
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M views`;
  }
  if (num >= 1_000) {
    return `${Math.floor(num / 1_000)}K views`;
  }
  return `${num} views`;
}

export default function VideoCard({ video }: { video: Video }) {
  const publishedDate = new Date(video.snippet.publishedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  return (
    <div className="flex flex-col gap-2">
      <a
        href={`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative"
      >
        <img
          src={video.snippet.thumbnails.medium.url}
          alt={video.snippet.title}
          className="w-full rounded-lg aspect-video object-cover"
        />
        {video.duration && (
          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
            {video.duration}
          </span>
        )}
      </a>
      <div className="flex flex-col">
        <h3
          className="font-semibold text-sm leading-snug"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {video.snippet.title}
        </h3>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
          {video.statistics && (
            <span>{formatViewCount(video.statistics.viewCount)}</span>
          )}
          {video.statistics && <span>•</span>}
          <span>{publishedDate}</span>
        </div>
      </div>
    </div>
  );
}