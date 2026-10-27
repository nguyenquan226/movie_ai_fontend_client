import { Film, ListVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExitButton } from "./exitButton";

interface PlayerInfoProps {
  name: string;
  filmTitle: string;
  episodeNumber: number;
  partNumber: number;

  onOpenChange: (open: boolean) => void;
  onOpenList: (open: boolean) => void;
  leaveRoom: () => void;
}

const StreamInfo = ({
  name,
  filmTitle,
  partNumber,
  episodeNumber,
  onOpenChange,
  onOpenList,
  leaveRoom,
}: PlayerInfoProps) => {
  const title = `Phần ${partNumber} - Tập ${episodeNumber} • ${filmTitle}`;

  return (
    <div className="absolute w-full px-6 py-6 z-20 text-foreground bg-gradient-to-b from-zinc-950 via-zinc-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-350">
      <div className="flex justify-between">
        <div className="group/info_bar flex gap-3">
          <div className="">
            <ExitButton onClick={leaveRoom} />
          </div>
          <div className="flex flex-col justify-center gap-2 font-semibold">
            <div className="flex items-center gap-2">
              <div className="bg-rose-600 text-center p-0.5 px-1.5 rounded-md uppercase text-xs border border-background font-semibold tracking-wide"
              >
                live
              </div>
              <p className="text-sm">{name}</p>
            </div>
            <p className="text-xs font-normal text-muted-foreground">
              {title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:block hidden">
          <Button
            variant={"ghost"}
            className="flex gap-2 justify-center cursor-pointer hover:bg-amber-400"
            onClick={() => onOpenChange(true)}
          >
            <Film />
            <p className="text-sm">Thông tin film</p>
          </Button>
          <Button
            variant={"ghost"}
            className="flex gap-2 justify-center cursor-pointer hover:bg-amber-400"
            onClick={() => onOpenList(true)}
          >
            <ListVideo />
            <p>Danh sách tập</p>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default StreamInfo;
