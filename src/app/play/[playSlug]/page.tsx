"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

import { PartDetail } from "@/types/part.type";
import { EpisodeDetail } from "@/types/episode.type";

import Player from "@/components/Player/Player";
import TabsSection from "@/components/film/detail/Tabs";
import CommentRatingTabs from "@/components/custom/CommentRatingTabs";
import FilmInfo from "@/components/film/player/film-info";
import SuggestList from "@/components/film/player/suggest-list";

import { useFilmStore } from "@/stores/filmStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useAuthStore } from "@/stores/authStore";
import VIPContent from "@/components/custom/VipContent";
import filmServices from "@/services/filmService";
import { IFilmSuggestRes } from "@/types/film.type";

export default function PlayPage() {
  const { playSlug }: { playSlug: string } = useParams();
  const searchParams = useSearchParams();

  const ep = searchParams.get("ep");
  const p = searchParams.get("p");

  const { loading, filmData, partData, getDetailFilm, getPartData } = useFilmStore();
  const { handleInfoPlayer, resetInfoPlayer } = usePlayerStore();
  const { authUser } = useAuthStore();

  const [episodeDetail, setEpisodeDetail] = useState<EpisodeDetail | null>(null);
  const [partDetail, setPartDetail] = useState<PartDetail | null>(null);
  const [suggestList, setSuggestList] = useState<IFilmSuggestRes[]>([]);

  useEffect(() => {
    if (!playSlug) return;
    getDetailFilm(playSlug);
    handleGetFilmSuggest();
  }, [playSlug, getDetailFilm]);

  useEffect(() => {
    if (filmData?.film.filmId) {
      getPartData(filmData?.film.filmId)
    }
  }, [filmData?.film.filmId, getPartData])

  useEffect(() => {
    if (!partData || !p || !ep) return;

    resetInfoPlayer();

    const foundPart = partData.find((part: PartDetail) => part.partNumber === +p);

    if (foundPart) {
      setPartDetail(foundPart);

      const foundEpisode = foundPart.episodes.find(
        (episode) => episode.episodeNumber === +ep
      );

      if (foundEpisode) {
        setEpisodeDetail(foundEpisode);
      }

      handleInfoPlayer(p, ep);
    }
  }, [partData, ep, p]);

  const handleGetFilmSuggest = async () => {
    try {
      const res = await filmServices.getFilmSuggest();
      if (res.EC === 0 && res.data) {
        setSuggestList(res.data.result);
      } else {
        console.log(res.EM);
      }
    } catch (error) {
      console.log("Error when get data film suggest: ", error);
    }
  }

  if (loading || !filmData || !partData)
    return (
      <div className="flex justify-center items-center h-screen text-muted-foreground">
        Đang tải tập phim...
      </div>
    );

  if (!episodeDetail || !partDetail) {
    return (
      <div className="flex justify-center items-center h-screen text-muted-foreground">
        Không tìm thấy tập phim
      </div>
    );
  }

  if (filmData.film.isVip && !authUser.isVip && ep && +ep > 3) {
    return (
      <VIPContent />
    )
  }

  console.log("Check data suggest: ", suggestList);

  return (
    <div className="w-full bg-zinc-950 text-foreground md:pt-[72px] pt-[80px]">
      <div className="px-[20px] lg:pt-4 pt-6">
        <Player
          filmId={filmData.film.filmId}
          episodeId={episodeDetail.id}
          currentPart={p!}
          currentEpisode={ep!}
          episodeDetail={episodeDetail}
          partDetail={partDetail}
          key={searchParams.toString()}
        />
        <div className="py-10">
          <div className="grid grid-cols-1 xl:grid-cols-10 md:grid-cols-12 gap-4">
            <div className="xl:col-span-7 lg:col-span-9 md:col-span-8">
              <FilmInfo />
              <TabsSection />
              <CommentRatingTabs />
            </div>
            <div className="xl:col-span-3 lg:col-span-3 md:col-span-4 md:border-l border-primary md:px-4 px-0">
              <SuggestList suggestList={suggestList} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
