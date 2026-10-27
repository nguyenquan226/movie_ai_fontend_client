import { cn } from "@/lib/utils";
import { FilmDataStream } from "@/types/film.type"

interface FilmCardProps {
  filmData: FilmDataStream;
  isCreate?: boolean;
}

export const FilmCard = ({
  filmData,
  isCreate = true
}: FilmCardProps) => {
  const film = filmData.film;
  const filmImage = filmData.filmImages;
  return (
    <div className="h-full group/filmCard">
      <div className="relative overflow-hidden">
        <img
          src={filmImage.poster}
          alt="poster"
          className="object-cover object-center aspect-auto"
        />
        <div className={cn(
          "absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#212a56] via-[#212a56]/90 to-transparent",
          !isCreate && "pointer-events-none opacity-0 group-hover/filmCard:opacity-100 transition-opacity duration-300"
        )}></div>
      </div>
      <div className={cn(
        "relative -mt-65",
        !isCreate && "opacity-0 translate-y-4 group-hover/filmCard:opacity-100 group-hover/filmCard:translate-y-0 transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-500 ease-out"
      )}>
        <div className="space-y-4 px-6 pb-4">
          <h1 className="text-xl font-semibold text-foreground mb-3">{film.title}</h1>
          <p className="font-semibold text-primary py-1/2">{film.originalTitle}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="py-1 px-2 text-xs font-semibold bg-white text-zinc-900 rounded-lg border border-transparent">{film.age.valueEn}</div>
            <div className="py-1 px-2 text-xs bg-transparent text-zinc-200 rounded-lg border border-zinc-200">{film.year}</div>
            <div className="py-1 px-2 text-xs bg-transparent text-zinc-200 rounded-lg border border-zinc-200">{film.duration} phút</div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {film.genres.map((genre, index) => (
              <div
                key={index}
                className="text-foreground text-xs bg-card/70 py-1 px-1.5 rounded-md"
              >
                {genre.valueVi}
              </div>
            ))}
          </div>
          <p
            className="text-zinc-200/90 overflow-hidden text-ellipsis text-xs"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
            }}
          >
            {film.description}
          </p>
        </div>
      </div>
    </div>
  )
}
