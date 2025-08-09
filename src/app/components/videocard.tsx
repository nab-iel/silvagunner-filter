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

export function VideoCard({ video }: { video: Video }) {
  const publishedDate = new Date(video.snippet.publishedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  return (
    <div className="group relative flex flex-col gap-3 p-3 rounded-xl bg-white/70 dark:bg-gray-900/60 backdrop-blur border border-gray-200/60 dark:border-gray-700/50 shadow-card hover:shadow-cardHover transition-all duration-500 ease-out-expo hover:-translate-y-1">
      <a
        href={`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative rounded-lg overflow-hidden"
      >
        <img
          src={video.snippet.thumbnails.medium.url}
          alt={video.snippet.title}
          className="w-full rounded-lg aspect-video object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]"
        />
        {video.duration && (
          <span className="absolute bottom-2 right-2 z-10 bg-black/70 backdrop-blur px-2 py-0.5 rounded-md text-[11px] font-medium tracking-wide text-white shadow">
            {video.duration}
          </span>
        )}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </a>
      <div className="flex flex-col flex-1">
        <h3 className="font-semibold text-sm leading-snug text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {video.snippet.title}
        </h3>
        <div className="text-[11px] uppercase tracking-wide font-medium text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
          {video.statistics && (
            <span>{formatViewCount(video.statistics.viewCount)}</span>
          )}
          {video.statistics && <span className="opacity-50">•</span>}
          <span>{publishedDate}</span>
        </div>
      </div>
    </div>
  );
}