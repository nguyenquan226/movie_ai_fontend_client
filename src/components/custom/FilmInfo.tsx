"use client";

import { useFilmStore } from "@/stores/filmStore";
import { useRatingStore } from "@/stores/ratingStore";
import { AllCodeValue } from "@/types/allcode.type";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { useFilmRouter } from "@/hooks/filmRouter";
import { useEffect, useState } from "react";
import { useAppRouter } from "@/hooks/useAppRouter";
import VIPBadge from "../film/detail/VIPBagde";
import { cn } from "@/lib/utils";

export default function FilmInfo() {
  const { loading, error, filmData } = useFilmStore();
  const { averageRating, fetchRatings } = useRatingStore();
  const { goActorDetail, goDirectorDetail, goProducerDetail } = useFilmRouter();
  const { goGenre, goCountry } = useAppRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const decodeHTMLEntities = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  useEffect(() => {
    if (filmData?.film?.filmId) {
      fetchRatings(filmData.film.filmId);
    }
  }, [filmData?.film?.filmId, fetchRatings]);

  if (loading || !filmData) {
    return <div className="text-center py-20">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-center py-20">Has error !</div>;
  }

  const { film, filmImages, actors, directors, producers } = filmData;

  return (
    <div className="flex flex-col gap-2 min-[400px]:gap-3 sm:gap-4 p-2 min-[400px]:p-3 sm:p-4 md:p-5 rounded-lg">
      <div className="flex justify-center sm:justify-start">
        <img
          src={filmImages.poster}
          alt={film.title}
          className="object-cover w-32 min-[400px]:w-40 sm:w-48 md:w-56 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 ease-out"
        />
      </div>

      <div className="flex flex-col gap-1 min-[400px]:gap-1.5 sm:gap-2 text-center sm:text-left">
        <h1 className="text-sm min-[400px]:text-base sm:text-2xl font-bold text-foreground line-clamp-2 sm:line-clamp-none">
          {film.title || "Đang cập nhật"}
          {filmData.film.isVip && (
            <VIPBadge
              size="sm"
              className="ml-1 sm:ml-2 inline-block align-middle scale-75 sm:scale-100"
            />
          )}
        </h1>

        <h2 className="text-[10px] min-[400px]:text-xs sm:text-sm text-muted-foreground italic line-clamp-1">
          {film.originalTitle || ""}
        </h2>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-0.5 min-[400px]:gap-1 sm:gap-1.5 text-xs">
          <span className="inline-flex items-center bg-[#facc15] text-black px-1 min-[400px]:px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-semibold whitespace-nowrap text-[10px] min-[400px]:text-xs sm:text-sm">
            {averageRating > 0 ? `${averageRating.toFixed(1)}` : "N/A"}
            <Star
              size={10}
              className="ml-0.5 min-[400px]:w-3 min-[400px]:h-3 sm:w-3.5 sm:h-3.5"
            />
          </span>
          <span className="bg-[#FF3300] text-foreground px-1 min-[400px]:px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-semibold whitespace-nowrap text-[9px] min-[400px]:text-[10px] sm:text-sm">
            {film.age?.valueVi || "N/A"}
          </span>
          <span className="bg-secondary text-foreground px-1 min-[400px]:px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border whitespace-nowrap text-[9px] min-[400px]:text-[10px] sm:text-sm">
            {film.year || "N/A"}
          </span>
        </div>

        <div className="flex flex-wrap justify-center sm:justify-start gap-0.5 min-[400px]:gap-1 sm:hidden">
          {Array.isArray(film.genres) &&
            film.genres.slice(0, 3).map((g: AllCodeValue) => (
              <button
                key={g.keyMap}
                onClick={() => goGenre(g.keyMap)}
                className="bg-secondary hover:bg-[#3f3f46] text-foreground px-1 min-[400px]:px-1.5 py-0.5 rounded cursor-pointer text-[9px] min-[400px]:text-[10px]"
              >
                {g.valueVi}
              </button>
            ))}
          {Array.isArray(film.genres) && film.genres.length > 3 && (
            <span className="text-muted-foreground text-[9px] min-[400px]:text-[10px] px-0.5 min-[400px]:px-1">
              +{film.genres.length - 3}
            </span>
          )}
        </div>

        <div className="hidden sm:flex flex-wrap gap-1.5 text-sm text-muted-foreground">
          {Array.isArray(film.genres) && film.genres.length > 0 ? (
            film.genres.map((g: AllCodeValue) => (
              <button
                key={g.keyMap}
                onClick={() => goGenre(g.keyMap)}
                className="bg-secondary hover:bg-[#3f3f46] text-foreground px-1.5 py-0.5 rounded cursor-pointer whitespace-nowrap"
              >
                {g.valueVi}
              </button>
            ))
          ) : (
            <span className="italic text-muted-foreground">Đang cập nhật</span>
          )}
        </div>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="sm:hidden w-full flex items-center justify-center gap-1 py-1.5 min-[400px]:py-2 text-primary text-xs min-[400px]:text-sm font-medium border-t border-b border-gray-700/50"
      >
        {isExpanded ? (
          <>
            <span>Thu gọn</span>
            <ChevronUp size={16} />
          </>
        ) : (
          <>
            <span>Xem thêm thông tin</span>
            <ChevronDown size={16} />
          </>
        )}
      </button>

      <div
        className={cn(
          "flex flex-col gap-2 min-[400px]:gap-3 sm:gap-4 transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 overflow-hidden",
          isExpanded
            ? "max-h-[2000px] opacity-100"
            : "max-h-0 opacity-0 sm:max-h-none sm:opacity-100"
        )}
      >
        <div>
          <h3 className="text-xs min-[400px]:text-sm sm:text-base font-semibold text-foreground mb-1">
            Giới thiệu:
          </h3>
          <p className="text-[10px] min-[400px]:text-xs sm:text-sm text-muted-foreground leading-relaxed text-justify">
            {film.description ? decodeHTMLEntities(film.description) : "Đang cập nhật"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-1.5 min-[400px]:gap-2 text-[10px] min-[400px]:text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">Thời lượng:</h3>
            <span className="text-muted-foreground">
              {film.duration
                ? `${Math.floor(film.duration / 60)}h ${film.duration % 60
                }m`
                : "Đang cập nhật"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">Lượt xem:</h3>
            <span className="text-muted-foreground">
              {film.view ? `${film.view}` : "Đang cập nhật"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">Quốc gia:</h3>
            {film.country?.valueVi ? (
              <button
                onClick={() => goCountry(film.country.keyMap)}
                className="text-muted-foreground cursor-pointer hover:text-primary"
              >
                {film.country.valueVi}
              </button>
            ) : (
              <span className="italic text-muted-foreground">Đang cập nhật</span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground">Sản xuất:</h3>
            {Array.isArray(producers) && producers.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {producers.map((p, idx) => (
                  <span
                    key={p.producerId || p.slug || idx}
                    className="flex items-center"
                  >
                    <button
                      className="text-muted-foreground cursor-pointer hover:text-primary"
                      onClick={() =>
                        goProducerDetail(p.producerId || p.slug)
                      }
                      type="button"
                    >
                      {p.producerName}
                    </button>
                    {idx < producers.length - 1 && (
                      <span className="text-muted-foreground">,</span>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground italic">Đang cập nhật</span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground">Đạo diễn:</h3>
            {Array.isArray(directors) && directors.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {directors.map((d, idx) => (
                  <span
                    key={d.directorId || d.slug || idx}
                    className="flex items-center"
                  >
                    <button
                      className="text-muted-foreground cursor-pointer hover:text-primary"
                      onClick={() => goDirectorDetail(d.slug)}
                    >
                      {d.directorName}
                    </button>
                    {idx < directors.length - 1 && (
                      <span className="text-muted-foreground">,</span>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground italic">Đang cập nhật</span>
            )}
          </div>
        </div>

        <div className="mt-1.5 min-[400px]:mt-2">
          <h3 className="text-sm min-[400px]:text-base sm:text-xl md:text-2xl font-semibold text-foreground">
            Diễn viên
          </h3>
          {Array.isArray(actors) && actors.length > 0 ? (
            <div className="flex overflow-x-auto gap-2 min-[400px]:gap-3 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-4 mt-1.5 min-[400px]:mt-2 pb-2 scrollbar-hide">
              {actors.map((a, index) => (
                <div
                  key={`${a.actorId}-${index}`}
                  onClick={() => goActorDetail(a.slug)}
                  className="flex flex-col items-center text-center cursor-pointer group hover:scale-105 transition-transform duration-300 flex-shrink-0"
                >
                  <div className="w-12 h-12 min-[400px]:w-14 min-[400px]:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden shadow-lg">
                    <img
                      src={a.avatarUrl || "/images/small.jpg"}
                      alt={a.actorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="mt-1 min-[400px]:mt-1.5 text-[10px] min-[400px]:text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors text-center truncate w-14 min-[400px]:w-16 sm:w-20 md:w-24"
                    title={a.actorName}
                  >
                    {a.actorName}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic mt-1.5 min-[400px]:mt-2 text-[10px] min-[400px]:text-xs sm:text-sm">
              Chưa có thông tin diễn viên
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
