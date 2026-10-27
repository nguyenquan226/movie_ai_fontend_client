export interface EpisodeDetail {
  id: string;
  title: string;
  episodeNumber: number;
  duration: number;
  videoUrl: string;
  thumbUrl: string;
}

export interface EpisodeStream extends EpisodeDetail {
  part: {
    id: string;
    title: string;
    partNumber: number;
  }
}