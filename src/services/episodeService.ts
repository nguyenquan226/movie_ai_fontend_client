import publicAxios from "@/lib/publicAxios";

import { IBackendRes } from "@/types/backend.type";
import { EpisodeDetail } from "@/types/episode.type";

const baseURL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

const episodeServices = {
  getEpisodeBySlug: (slug: string, episode: string, part: string): Promise<IBackendRes<EpisodeDetail>> => {
    return publicAxios.get(`${baseURL}/films/play/${slug}?part=${part}&episode=${episode}`)
  },

  getEpisodeById: (episodeId: string): Promise<IBackendRes<EpisodeDetail>> => {
    return publicAxios.get(`${baseURL}/episodes/${episodeId}`);
  },
};

export default episodeServices;
