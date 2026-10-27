import { cn } from "@/lib/utils";

import { FilmCard } from "../../create/_components/filmCard";
import { FilmDataStream } from "@/types/film.type";

interface PlayListNavProps {
  open: boolean;
  film: FilmDataStream;

  onOpenChange: (open: boolean) => void;
}

const DetailNav = ({
  open,
  film,
  onOpenChange
}: PlayListNavProps) => {

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
        <div className="bg-[#212a56] rounded-xl overflow-hidden">
          <FilmCard filmData={film} isCreate={false} />
        </div>
      </div>
    </div>
  );
};
export default DetailNav;
