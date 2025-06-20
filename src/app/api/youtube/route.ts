import { NextResponse } from "next/server";

function parseDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "0:00";

  // Extract hours, minutes, and seconds
  const hours = parseInt(match[1]?.slice(0, -1) || "0");
  const minutes = parseInt(match[2]?.slice(0, -1) || "0");
  const seconds = parseInt(match[3]?.slice(0, -1) || "0");

  // Format into a readable string
  const h = hours > 0 ? `${hours}:` : "";
  const m = hours > 0 && minutes < 10 ? `0${minutes}` : `${minutes}`;
  const s = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${h}${m}:${s}`;
}

export async function POST() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key is not configured." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=UU9ecwl3FTG66jIKA9JRDtmg&maxResults=50&key=${apiKey}`
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.error.message || "Something went wrong" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const videoItems = data.items;

    if (!videoItems || videoItems.length === 0) {
      return NextResponse.json([]);
    }

    const videoIds = videoItems
      .map((item: any) => item.snippet?.resourceId?.videoId)
      .filter(Boolean) // Filter out any null/undefined IDs
      .join(",");

    if (!videoIds) {
      return NextResponse.json(videoItems); // Return items without details if IDs are missing
    }

    const videoDetailsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${apiKey}`
    );

    let videoDetailsMap = new Map();
    if (videoDetailsRes.ok) {
      const videoDetailsData = await videoDetailsRes.json();
      videoDetailsMap = new Map(
        videoDetailsData.items.map((item: any) => [item.id, item])
      );
    } else {
      console.error("Could not fetch video details.");
    }

    const combinedData = videoItems.map((item: any) => {
      const videoId = item.snippet.resourceId.videoId;
      const details = videoDetailsMap.get(videoId);
      return {
        ...item,
        duration: details ? parseDuration(details.contentDetails.duration) : null,
        statistics: details ? details.statistics : null,
      };
    });

    return NextResponse.json(combinedData);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}