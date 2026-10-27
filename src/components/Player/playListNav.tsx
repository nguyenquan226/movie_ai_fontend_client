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

import { Crown, X } from "lucide-react";
import { PartDetail } from "@/types/part.type";
import { useFilmStore } from "@/stores/filmStore";
import { useEffect, useState } from "react";
import { EpisodeDetail } from "@/types/episode.type";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { useAppRouter } from "@/hooks/useAppRouter";

interface PlayListNavProps {
  open: boolean;
  currentPart: string;
  currentEpisode: string;

  onOpenChange: (open: boolean) => void;
}

const Header = ({
  part,
  selectedPart,
  onChangeSelectPart,
  onOpenChange,
}: {
  part: PartDetail[],
  selectedPart: string,
  onChangeSelectPart: (part: string) => void,
  onOpenChange: (open: boolean) => void
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-lg">Thủy Long Ngâm</p>
        <button
          className="rounded-full bg-secondary ring-1 p-1 cursor-pointer hover:bg-accent"
          onClick={() => onOpenChange(false)}
        >
          <X size={12} />
        </button>
      </div>
      <Select value={selectedPart} onValueChange={onChangeSelectPart}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Chọn phần" />
        </SelectTrigger>
        <SelectContent className="z-10000">
          <SelectGroup>
            {part.map((p, index) => (
              <SelectItem key={index} value={(p.partNumber).toString()}>
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
}: {
  listEpisode: EpisodeDetail[],
  currentEpisode: string,
  isActive: boolean,
  selectedPart: string,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { goUpgradeVip } = useAppRouter();
  const { filmData } = useFilmStore();
  const { authUser, isAuthenticated } = useAuthStore();

  // Hàm thay đổi searchParams
  const handlePlayEpisode = (episodeNumber: number) => {
    if (filmData?.film.isVip && !authUser.isVip && episodeNumber > 2) {
      if (isAuthenticated) {
        toast.warning("Bạn cần là VIP để xem tập phim này");
        setTimeout(() => { goUpgradeVip() }, 1000)
      } else {
        toast.warning("Bạn cần đăng nhập để xem tập phim này");
      }
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("ep", episodeNumber.toString());
    params.set("p", selectedPart);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Separator />
      <div className="h-[500px] w-full rounded-md">
        <div className="grid grid-cols-4 gap-4">
          {listEpisode.map((episode, i) => {
            const isSelected = episode.episodeNumber === +currentEpisode && isActive;
            return (
              <div
                key={i}
                onClick={() => handlePlayEpisode(episode.episodeNumber)}
                className={cn(
                  "flex items-center justify-center px-3 py-2 rounded-md bg-secondary text-foreground font-normal text-xs cursor-pointer border-3 border-border",
                  "hover:shadow-[0_3px_3px_rgba(253,153,0,1)] transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-200 ease relative",
                  isSelected && "border-primary text-primary",
                )}
              >
                {episode.title !== "" ? episode.title : `Tập ${episode.episodeNumber}`}
                {filmData?.film.isVip && i > 2 && !authUser.isVip && (
                  <div className="absolute top-0 right-0 -mt-3 -mr-2">
                    <Crown size={20} className="text-primary" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  );
};

const PlayListNav = ({ currentPart, currentEpisode, open, onOpenChange }: PlayListNavProps) => {

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
      className={cn("fixed inset-0 z-999999991", !open && "pointer-events-none")}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={() => onOpenChange(false)}
      ></div>
      <div
        className={cn(
          "bg-zinc-500/20 backdrop-blur-md text-foreground flex flex-col gap-4 transition ease-in-out absolute",
          "inset-y-0 right-0 w-[88%] md:w-3/4 sm:max-w-sm px-6 py-8 my-6 mr-6 rounded-2xl",
          "transform transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
          open ? "opacity-100" : "opacity-0"
        )}
      >
        <Header part={partData!} onOpenChange={onOpenChange} selectedPart={selectedPart} onChangeSelectPart={setSelectedPart} />
        {listEpisode ?
          <Content listEpisode={listEpisode!} currentEpisode={currentEpisode} isActive={isActive} selectedPart={selectedPart} />
          :
          <div className="font-semibold text-red-500">
            Đã xảy ra lỗi. Vui lòng thử lại sau!
          </div>
        }
      </div>
    </div>
  );
};
export default PlayListNav;
