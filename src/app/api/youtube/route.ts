import { NextResponse } from "next/server";

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
    if (data.items.length === 0) {
      return NextResponse.json({ error: "Video not found." }, { status: 404 });
    }

    return NextResponse.json(data.items);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}