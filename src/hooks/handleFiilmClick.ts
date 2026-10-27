"use client";

import { partServices } from "@/services/partService";
import { useFilmRouter } from "@/hooks/filmRouter";
import { useFilmStore } from "@/stores/filmStore";
type FilmNavigationData = {
  filmId: string;
  title: string;
  slug: string;
  type?: { keyMap?: string } | null;
};

export function useFilmClick() {
  const { goFilmDetail, goPlayerFilm } = useFilmRouter();
  const setIsLoading = (isLoading: boolean) =>
    useFilmStore.setState({ isLoading });

  const handleFilmClick = async (film: FilmNavigationData) => {
    if (!film?.filmId) {
      console.warn("Lost filmId:", film);
      return;
    }

    setIsLoading(true);

    try {
      const res = await partServices.getPartsByFilmId(film.filmId);
      const partData = res?.data?.partData;

      if (!partData || partData.length === 0) {
        console.warn("Not found Part for Film:", film.title);
        goFilmDetail(film.slug);
        return;
      }

      const firstPart = partData[0];
      if (firstPart?.episodes?.length > 0) {
        const firstEp = firstPart.episodes[0];
        console.log(
          ` Open ${film.title} - Part ${firstPart.partNumber} - Episode ${firstEp.episodeNumber}`
        );

        goPlayerFilm(
          film.slug,
          firstPart.partNumber.toString(),
          firstEp.episodeNumber.toString()
        );
        return;
      }

      if (film.type?.keyMap === "FT_SINGLE") {
        console.log(` Open single film ${film.title}`);
        goPlayerFilm(film.slug, "1", "1");
        return;
      }
      goFilmDetail(film.slug);
    } catch (err: unknown) {
      console.error("Error in handleFilmClick:", err instanceof Error ? err.message : err);
      goFilmDetail(film.slug);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleFilmClick };
}
