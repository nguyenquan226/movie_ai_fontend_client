"use client";

import { useFilmRouter } from "@/hooks/filmRouter";
import { filmInUserPage } from "@/types/user.type";
import { X } from "lucide-react";
import { userServices } from "@/services";
import { Loader } from "lucide-react";

export interface FavoriteFilmsProps {
  films: filmInUserPage[];
  fetchFilmList: () => void;
  isLoading: boolean;
}

export default function FavoriteFilms({
  films,
  fetchFilmList,
  isLoading,
}: FavoriteFilmsProps) {
  const { goFilmDetail } = useFilmRouter();

  const hanhleToggleFavorite = async (filmId: string) => {
    await userServices.toggleFavoriteFilm(filmId);
    fetchFilmList();
  };

  return (
    <section className="min-w-0 flex-1">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">Phim yêu thích</h1>

      {isLoading === true ? (
        <>
          <div className="mt-4 flex w-full justify-center" role="status" aria-live="polite">
            <div
              className="flex h-48 w-full max-w-4xl items-center justify-center rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground"
            >
              <Loader
                aria-hidden="true"
                className="animate-spin"
                size={20}
                style={{ animationDuration: "1.5s" }}
              />{" "}
              <span className="ml-1"> Đang tải danh sách phim yêu thích</span>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Nếu không có film */}
          {films.length === 0 && (
              <div className="mt-4 flex w-full justify-center">
              <div
                className="flex h-48 w-full max-w-4xl items-center justify-center rounded-xl border border-border bg-card px-6 text-center text-sm text-muted-foreground"
              >
                Bạn chưa có phim yêu thích nào
              </div>
            </div>
          )}

          {/* Grid film cards */}
          {films.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {films.map((film) => (
                <article key={film.filmId} className="relative min-w-0 overflow-hidden rounded-xl border border-border bg-card">
                    <button
                      type="button"
                      onClick={() => {
                        hanhleToggleFavorite(film.filmId);
                      }}
                      aria-label={`Bỏ ${film.title} khỏi yêu thích`}
                      className="absolute right-2 top-2 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-background/90 text-foreground transition-colors hover:bg-destructive hover:text-foreground"
                    >
                      <X aria-hidden="true" size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => goFilmDetail(film.slug)}
                      aria-label={`Xem chi tiết phim ${film.title}`}
                      className="relative block aspect-[2/3] w-full overflow-hidden bg-muted text-left"
                    >
                      <img
                        src={film.thumbUrl}
                        alt={film.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                      />
                    </button>

                    {film.badge && (
                      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
                        <span className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
                          {film.badge}
                        </span>
                      </div>
                    )}

                    <div className="p-3">
                      <h2 className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-foreground">{film.title}</h2>
                      {film.originalTitle && <p className="mt-1 truncate text-xs text-muted-foreground">{film.originalTitle}</p>}
                    </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
