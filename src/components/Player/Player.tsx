"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Tv } from "lucide-react";

import { EpisodeDetail } from "@/types/episode.type";

import PlayerInfo from "./playerInfo";
import PlayerLineConfig from "./playerLineConfig";
import PlayListNav from "./playListNav";
import { PartDetail } from "@/types/part.type";


const PlayerController = dynamic(
  () => import("@/components/Player/PlayerController"),
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

// shadow-[0_0_30px_rgba(0,0,0,0.6)] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]
//  shadow-[-8px_-8px_40px_10px_rgba(255,255,255,0.1),_8px_8px_40px_10px_rgba(255,255,255,0.1)]
// shadow-[-8px_-8px_40px_10px_rgba(0,0,0,0.3),_8px_8px_40px_10px_rgba(0,0,0,0.3)]

interface PlayerProps {
  currentPart: string;
  currentEpisode: string;
  episodeDetail: EpisodeDetail;
  partDetail: PartDetail;
  filmId: string;
  episodeId: string;
}

const Player = ({
  currentPart,
  currentEpisode,
  episodeDetail,
  partDetail,
  filmId,
  episodeId,
}: PlayerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)]
  return (
    <div className="md:shadow-[0px_15px_50px_0px_rgba(59,_130,_246,_0.15)] shadow-[0px_15px_50px_0px_rgba(59,_130,_246,_0.4)] rounded-2xl overflow-hidden">
      <div className="relative group">
        <PlayerInfo
          episodeTitle={episodeDetail.title}
          partTitle={partDetail.title}
          onOpenChange={setIsOpen}
        />
        <PlayListNav
          currentPart={currentPart}
          currentEpisode={currentEpisode}
          open={isOpen}
          onOpenChange={setIsOpen}
        />
        <div className="relative">
          <PlayerController
            videoUrl={episodeDetail.videoUrl}
            posterUrl={episodeDetail.thumbUrl}
            filmId={filmId}
            episodeId={episodeId}
          />
        </div>
      </div>
      <PlayerLineConfig />
    </div>
  );
};

export default Player;
