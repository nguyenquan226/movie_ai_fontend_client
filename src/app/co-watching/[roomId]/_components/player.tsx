"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Eye, Tv } from "lucide-react";
import Artplayer from "artplayer";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import StreamInfo from "./streamInfo";
import { CopyButton } from "./copy-button";
import DetailNav from "./detailFilm";

import { roomRes } from "@/types/co_watching.type";
import { FilmDataStream } from "@/types/film.type";
import { useFilmStore } from "@/stores/filmStore";
import PlayListNav from "./playListNav";
import { useCoWatchingStore } from "@/stores/co-watchingStore";
import { EndLiveButton } from "./endLiveButton";
import roomServices from "@/services/co-watching/roomService";
import { toast } from "sonner";
import { vi } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/stores/authStore";

const ArtPlayerClient = dynamic(
  () => import("./ArtPlayerClient"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[700px] bg-background flex items-center justify-center text-foreground text-3xl">
        <div className="flex">
          <div className="relative">
            <div
              className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg
       opacity-80 animate-pulse"
              aria-hidden="true"
            />
            <div className="relative bg-background rounded-full p-6">
              <Tv className="size-12 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    ),
  }
);

interface PlayerProps {
  dataRoom: {
    room: roomRes,
    filmData: FilmDataStream;
  };

  handlePlay: () => void;
  handlePause: () => void;
  handleSeek: (time: number) => void;
  handleArtReady: (art: Artplayer) => void;
  handleManualSync: () => void;
  handleSyncEpisode: (part: number, episode: number) => void;
  handleEndLive: () => void;
  leaveRoom: () => void;
  handleBackHome: () => void;
}

const Player = ({
  dataRoom,
  handlePlay,
  handlePause,
  handleSeek,
  handleArtReady,
  handleManualSync,
  handleSyncEpisode,
  handleEndLive,
  leaveRoom,
  handleBackHome,
}: PlayerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenListPart, setIsOpenListPart] = useState(false);

  const [currentPart, setCurrentPart] = useState(dataRoom.room.partNumber);
  const [currentEpisode, setCurrentEpisode] = useState(dataRoom.room.episodeNumber);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const { partData } = useFilmStore();
  const { part, episode, handleUpdateEpisode } = useCoWatchingStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    setCurrentPart(part);
    setCurrentEpisode(episode);
  }, [part, episode]);


  useEffect(() => {
    if (!partData?.length) {
      setVideoUrl(null);
      return;
    }

    const selectedPart = partData.find((part) => part.partNumber === currentPart);
    const selectedEpisode = selectedPart?.episodes.find(
      (episode) => episode.episodeNumber === currentEpisode
    );

    setVideoUrl(selectedEpisode?.videoUrl ?? null);
  }, [partData, currentPart, currentEpisode]);


  const handleChangeEpisode = (part: number, episode: number) => {
    if (authUser.userId !== dataRoom.room.hostId) {
      toast.error("Chỉ chủ phòng mới có thể thay đổi tập phim");
      return;
    }

    setCurrentPart(part);
    setCurrentEpisode(episode);

    handleSyncEpisode(part, episode);
    handleUpdateEpisode(part, episode);
  }

  const handleEnd = async () => {
    const result = await roomServices.updateRoom(dataRoom.room.roomId, { isLive: false });
    if (result && result.EC === 0) {
      handleEndLive();
      handleBackHome();
    }
  }

  return (
    <div>
      <div className="shadow-[-8px_-8px_40px_10px_rgba(0,0,0,0.3),8px_8px_40px_10px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden">
        <div className="relative group">
          <StreamInfo
            name={dataRoom.room.name}
            filmTitle={dataRoom.filmData.film.title}
            episodeNumber={currentEpisode}
            partNumber={currentPart}
            onOpenChange={setIsOpen}
            onOpenList={setIsOpenListPart}
            leaveRoom={leaveRoom}
          />
          <DetailNav
            open={isOpen}
            onOpenChange={setIsOpen}
            film={dataRoom.filmData}
          />
          <PlayListNav
            title={dataRoom.filmData.film.title}
            currentPart={currentPart.toString()}
            currentEpisode={(currentEpisode).toString()}
            handleChangeEpisode={handleChangeEpisode}
            open={isOpenListPart}
            onOpenChange={setIsOpenListPart}
          />
          <div className="relative">
            {videoUrl ? (
              <ArtPlayerClient
                src={videoUrl}
                poster="/co-watching/poster.png"
                onPlay={handlePlay}
                onPause={handlePause}
                onSeek={handleSeek}
                onReady={handleArtReady}
                handleManualSync={handleManualSync}
              />
            ) : (
              <div className="flex h-[700px] items-center justify-center bg-background text-foreground">
                Đang tải video...
              </div>
            )}
          </div>
          <div className="md:p-4 p-2 bg-zinc-950">
            <div className="flex items-center justify-between ">
              <div className="pl-2 flex items-center gap-4">
                <Avatar className="md:size-10 size-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-semibold">{dataRoom.room.host.fullName}</h1>
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(dataRoom.room.createdAt), { addSuffix: true, locale: vi })}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {!dataRoom.room.isPrivate && (
                  <CopyButton />
                )}
                {authUser.userId === dataRoom.room.hostId && (
                  <EndLiveButton handleEnd={handleEnd} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
