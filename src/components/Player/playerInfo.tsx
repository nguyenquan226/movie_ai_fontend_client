import { ListVideo } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFilmStore } from "@/stores/filmStore";

interface PlayerInfoProps {
  episodeTitle: string;
  partTitle: string;

  onOpenChange: (open: boolean) => void;
}

const PlayerInfo = ({
  episodeTitle,
  partTitle,
  onOpenChange,
}: PlayerInfoProps) => {
  const { filmData } = useFilmStore();
  const title = `${partTitle} - ${episodeTitle}`

  return (
    <div className="absolute w-full px-6 py-6 z-100 text-foreground bg-gradient-to-b from-zinc-950 via-zinc-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-350">
      <div className="flex justify-between">
        <div className="flex flex-col justify-center gap-2 font-semibold">
          <p className="md:text-lg text-sm">{filmData?.film.title}</p>
          <p className="md:text-sm text-xs">
            {title}
          </p>
        </div>
        <Button
          variant={"ghost"}
          className="flex gap-2 justify-center cursor-pointer"
          onClick={() => onOpenChange(true)}
        >
          <ListVideo />
          <p>Danh sách tập</p>
        </Button>
      </div>
    </div>
  );
};
export default PlayerInfo;
