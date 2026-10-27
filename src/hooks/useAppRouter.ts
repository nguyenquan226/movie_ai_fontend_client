"use client";
import { userPath } from "@/constants/path";
import { useRouter } from "next/navigation";

export const useAppRouter = () => {
  const router = useRouter();

  return {
    // ==== Basic routes ====
    goHome: () => router.push(userPath.HOME),

    // ==== User routes ====
    goContinueWatching: () => router.push(userPath.CONTINUE_WATCHING),
    goFavorite: () => router.push(userPath.FAVORITE),
    goNotification: () => router.push(userPath.NOTIFICATION),
    goPlaylist: () => router.push(userPath.PLAYLIST),
    goProfile: () => router.push(userPath.PROFILE),
    goUpgradeVip: () => router.push(userPath.UPGRADE_VIP),

    // ==== Utility ====
    goBack: () => router.back(),
    replaceToHome: () => router.replace(userPath.HOME),
    reload: () => router.refresh(),
    replaceToUpgradeVip: () => router.replace(userPath.UPGRADE_VIP),

    // ==== Header routes ====
    goSingleFilms: () => router.push("/single"),
    goSeriesFilms: () => router.push("/series"),
    goGenre: (genreSlug: string) => router.push(`/genre/${genreSlug}`),
    goCountry: (countrySlug: string) => router.push(`/country/${countrySlug}`),
    goLatestUpdate: () => router.push("/search?sort=Latest Update"),
    goMostViewed: () => router.push("/search?sort=Views"),

    goCoWatching: () => router.push("/co-watching"),
    goFilmVip: () => router.push("/film-vip"),
  };
};
