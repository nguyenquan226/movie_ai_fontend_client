"use client";
import { filmPath, playPath } from "@/constants/path";
import { useRouter } from "next/navigation";

export const useFilmRouter = () => {
  const router = useRouter();

  return {
    goActorDetail: (actorSlug: number | string) =>
      router.push(filmPath.ACTOR_DETAIL(actorSlug)),

    goDirectorDetail: (directorSlug: number | string) =>
      router.push(filmPath.DIRECTOR_DETAIL(directorSlug)),
    goProducerDetail: (producerSlug: number | string) => router.push(filmPath.PRODUCER_DETAIL(producerSlug)),

    goWatchNow: (episodeId: string) =>
      router.push(playPath.WATCHNOW(episodeId)),

    // goFilmDetail: (filmSlug: string) =>
    //   router.push(filmPath.FILM_DETAIL(filmSlug)),

    goFilmDetail: (filmSlug: string) =>
      router.push(filmPath.FILM_DETAIL(filmSlug)),

    goPlayerFilm: (filmSlug: string, part: string, episode: string) =>
      router.push(filmPath.PLAYER_DETAIL(filmSlug, part, episode)),
  };
};
