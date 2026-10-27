"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { X } from "lucide-react";
import { PartDetail } from "@/types/part.type";
import { useFilmStore } from "@/stores/filmStore";
import { EpisodeDetail } from "@/types/episode.type";


const Header = ({
  title,
  part,
  selectedPart,
  onChangeSelectPart,
  onOpenChange,
}: {
  title: string;
  part: PartDetail[],
  selectedPart: string,
  onChangeSelectPart: (part: string) => void,
  onOpenChange: (open: boolean) => void
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-lg">{title}</p>
        <button
          className="rounded-full bg-secondary ring-1 p-1 cursor-pointer hover:bg-accent"
          onClick={() => onOpenChange(false)}
        >
          <X size={12} />
        </button>
      </div>
      <Select value={selectedPart} onValueChange={onChangeSelectPart}>
        <SelectTrigger className="w-[120px] border-amber-300">
          <SelectValue placeholder="Chọn phần" />
        </SelectTrigger>
        <SelectContent className="z-10000  bg-[#282b3a]/50 backdrop-blur-sm  border-0 text-foreground ring-1 ring-amber-400/50">
          <SelectGroup>
            {part.map((p, index) => (
              <SelectItem
                key={index}
                value={(p.partNumber).toString()}
                className="focus:bg-amber-400"
              >
                {p.title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

const Content = ({
  listEpisode,
  currentEpisode,
  isActive,
  selectedPart,
  handleChangeEpisode,
}: {
  listEpisode: EpisodeDetail[],
  currentEpisode: string,
  isActive: boolean,
  selectedPart: string,
  handleChangeEpisode: (part: number, episode: number) => void;
}) => {
  const handlePlayEpisode = (episodeNumber: number) => {
    handleChangeEpisode(+selectedPart, +episodeNumber)
  };

  return (
    <>
      <Separator />
      <ScrollArea className="h-full w-full rounded-md">
        <div className="grid grid-cols-4 gap-4">
          {listEpisode.map((episode, i) => {
            const isSelected = episode.episodeNumber === +currentEpisode && isActive;
            console.log(">>>>> Check: ", isSelected, episode.episodeNumber === +currentEpisode, isActive)
            return (
              <div
                key={i}
                onClick={() => handlePlayEpisode(episode.episodeNumber)}
                className={cn(
                  "flex items-center justify-center px-3 py-2 rounded-md bg-secondary text-foreground font-normal text-xs cursor-pointer border-3 border-border",
                  "hover:shadow-[0_3px_3px_rgba(253,153,0,1)] transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-200 ease",
                  isSelected && "border-primary text-primary",
                )}
              >
                {episode.title !== "" ? episode.title : `Tập ${episode.episodeNumber}`}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </>
  );
};


interface PlayListNavProps {
  title: string;
  open: boolean;
  currentPart: string;
  currentEpisode: string;

  handleChangeEpisode: (part: number, episode: number) => void;
  onOpenChange: (open: boolean) => void;
}

const PlayListNav = ({
  title,
  currentPart,
  currentEpisode,
  open,

  handleChangeEpisode,
  onOpenChange,
}: PlayListNavProps) => {

  const { partData } = useFilmStore();

  const [selectedPart, setSelectedPart] = useState(currentPart);
  const [isActive, setIsActive] = useState(false);

  const [listEpisode, setListEpisode] = useState<EpisodeDetail[] | null>(null);

  useEffect(() => {
    if (!partData) return;
    const episodes = partData[+selectedPart - 1].episodes;
    setListEpisode(episodes);

    setIsActive(selectedPart === currentPart)
  }, [selectedPart, currentPart, partData])

  return (
    <div
      className={cn("absolute inset-0 z-1000 md:block hidden", !open && "pointer-events-none")}
    >
      <div
        className={cn(
          "absolute inset-0 bg-zinc-950/10 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={() => onOpenChange(false)}
      ></div>
      <div
        className={cn(
          "bg-secondary/60 backdrop-blur-md text-foreground flex flex-col gap-4 transition ease-in-out absolute",
          "inset-y-0 right-0 w-3/4 sm:max-w-sm px-6 py-8 my-6 mr-6 rounded-2xl overflow-hidden",
          "transform transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
          open ? "opacity-100" : "opacity-0"
        )}
      >
        <Header
          title={title}
          part={partData!}
          onOpenChange={onOpenChange}
          selectedPart={selectedPart}
          onChangeSelectPart={setSelectedPart}
        />

        {listEpisode ?
          (
            <Content
              listEpisode={listEpisode!}
              currentEpisode={currentEpisode}
              isActive={isActive}
              selectedPart={selectedPart}
              handleChangeEpisode={handleChangeEpisode}
            />
          )
          :
          (
            <div className="font-semibold text-red-500">
              Đã xảy ra lỗi. Vui lòng thử lại sau!
            </div>
          )
        }
      </div>
    </div>
  );
};
export default PlayListNav;
