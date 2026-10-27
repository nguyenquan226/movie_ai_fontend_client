import { cn } from "@/lib/utils";
import { useFilmStore } from "@/stores/filmStore";

export default function Background() {
  const { filmData } = useFilmStore();
  const backdropUrl = filmData?.filmImages.backdrop || "";
  return (
    <div
      className={cn(
        "relative w-full h-[280px] sm:h-[400px] md:h-[500px] lg:h-[650px] xl:h-[750px] overflow-hidden",
        "before:content-[''] before:absolute before:inset-0 before:opacity-20 before:z-[1]",
        "after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[100px] sm:after:h-[150px] md:after:h-[200px] after:z-[3] after:bg-gradient-to-t after:from-background after:to-transparent"
      )}
    >
      <img
        src={backdropUrl}
        alt="Poster phim"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.5))] pointer-events-none"></div>
    </div>
  );
}
