export interface Video {
  id: string;
  snippet: {
    title: string;
    publishedAt: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
    resourceId: {
      videoId: string;
    };
  };
  duration: string | null;
  statistics: {
    viewCount: string;
  } | null;
}