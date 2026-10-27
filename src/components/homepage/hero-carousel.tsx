"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Play, Heart, Info, ChevronLeft, ChevronRight, Star } from "lucide-react";
import filmService from "@/services/filmService";
import { userServices } from "@/services";
import type { FilmDetailRes } from "@/types/filmType";
import Link from "next/link";
import { userFavoriteStore } from "@/stores/favoriteStore";
import { useAppRouter } from "@/hooks/useAppRouter";
import { useFilmRouter } from "@/hooks/filmRouter";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { useFilmStore } from "@/stores/filmStore";

const getPosterUrl = (film: FilmDetailRes): string => {
  if (film.posterUrl) return film.posterUrl; // fallback for old format
  if (film.filmImages && Array.isArray(film.filmImages)) {
    const posterImage = film.filmImages.find(
      (img) => img.type === "backdrop"
    );
    if (posterImage) return posterImage.url;
    // fallback to first image if poster not found
    if (film.filmImages.length > 0) return film.filmImages[1].url;
  }
  return "/placeholder.svg";
};

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center gap-1">
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-primary text-primary" />
        ))}
      {hasHalfStar && <Star className="h-4 w-4 fill-primary text-primary opacity-50" />}
      {Array(emptyStars)
        .fill(0)
        .map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground" />
        ))}
      <span className="ml-1 text-xs font-semibold text-foreground">{rating.toFixed(1)}</span>
    </div>
  )
}

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [films, setFilms] = useState<FilmDetailRes[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [favoriteStates, setFavoriteStates] = useState<{
    [key: string]: boolean;
  }>({});
  const { fetchFavoriteList, favoriteList } = userFavoriteStore();
  const { isAuthenticated } = useAuthStore();
  const { goGenre } = useAppRouter();
  const { goFilmDetail } = useFilmRouter();
  const { heroFilms, getRatingByFilmId, ratingData } = useFilmStore()
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const res = await filmService.getHeroSlides();

        const heroFilms = (res.data?.result || []).map(
          (film) =>
          ({
            filmId: film.filmId,
            title: film.title,
            originalTitle: film.originalTitle,
            description: film.description,
            posterUrl: getPosterUrl(film),
            year: film.year,
            age: film.age,
            genres: film.genres,
            slug: film.slug,
            duration: film.duration,
          } as FilmDetailRes)
        );
        setFilms(heroFilms);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu phim:", error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFilms();
    if (isAuthenticated) {
      fetchFavoriteList();
    }
  }, []);


  useEffect(() => {
    if (films.length > 0) {
      getRatingByFilmId(films[currentSlide].filmId)
    }
  }, [currentSlide, films])

  useEffect(() => {
    const states: { [key: string]: boolean } = {};
    favoriteList.forEach((fav) => {
      states[fav.filmId] = true;
    });
    setFavoriteStates(states);
  }, [favoriteList]);

  const handleToggleFavorite = async (filmId: string) => {
    if (isAuthenticated) {
      await userServices.toggleFavoriteFilm(filmId);
      fetchFavoriteList();
    } else {
      toast.warning("Vui lòng đăng nhập");
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % films.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + films.length) % films.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const getGenreText = (genre: NonNullable<FilmDetailRes["genres"]>[number]): string => {
    if (typeof genre === "string") return genre;
    return genre?.valueVi || genre?.valueEn || "";
  };

  if (loading || films.length === 0) {
    return (
      <section
        className="flex min-h-[32rem] w-full items-center justify-center bg-background px-6 pt-20 text-center md:min-h-[36rem] lg:min-h-[40rem]"
        role={loading ? "status" : "region"}
        aria-live="polite"
      >
        <div className="max-w-md">
          <p className="text-foreground">
            {loading
              ? "Đang tải phim nổi bật..."
              : loadError
                ? "Không thể tải phim nổi bật lúc này."
                : "Chưa có phim nổi bật để hiển thị."}
          </p>
          {!loading && loadError && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 min-h-11 rounded-lg bg-primary px-5 font-semibold text-primary-foreground"
            >
              Thử lại
            </button>
          )}
        </div>
      </section>
    );
  }

  const slide = films[currentSlide];
  const isCurrentSlideFavorite = favoriteStates[slide.filmId] || false;

  return (
    <section
      ref={containerRef}
      aria-label="Phim nổi bật"
      aria-roledescription="carousel"
      className="group relative w-full overflow-hidden bg-background cursor-grab active:cursor-grabbing"
      onPointerDown={(e: React.PointerEvent) => {
        if ((e.target as HTMLElement).closest("button, a")) return;
        setIsDragging(true);
        setDragStart(e.clientX);
      }}
      onPointerUp={(e: React.PointerEvent) => {
        if (!isDragging) return;
        setIsDragging(false);
        const dragEnd = e.clientX;
        const diff = dragStart - dragEnd;

        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
      }}
      onPointerCancel={() => setIsDragging(false)}
      onPointerLeave={(e: React.PointerEvent) => {
        if (!isDragging) return;
        setIsDragging(false);
        const dragEnd = e.clientX;
        const diff = dragStart - dragEnd;

        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
      }}
    >
      {/* Hero Slides */}
      {films.map((s, index) => (
        <div
          key={s.filmId}
          aria-hidden={index !== currentSlide}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${s.posterUrl})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
          </div>
        </div>
      ))}

      {/* Content Container */}
      <div className="relative flex min-h-[32rem] select-none items-center md:min-h-[36rem] lg:min-h-[40rem]">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-xl space-y-2 md:space-y-3">
            <h1 className="min-w-0 break-words text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {slide.title}
            </h1>

            {/* Original Title */}
            {slide.originalTitle && (
              <p className="text-sm md:text-base text-primary font-semibold select-none">
                {slide.originalTitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1 select-none">
              {ratingData?.averageRating ? (
                <div className="flex items-center gap-2 rounded border border-primary/60 bg-background/40 px-2 py-1 backdrop-blur-sm">
                  {renderStars(ratingData.averageRating)}
                </div>
              ) : null}
              {slide.age && (
                <div className="rounded border border-border bg-background/40 px-2 py-1 text-xs text-foreground backdrop-blur-sm">
                  {typeof slide.age === "string" ? slide.age : slide.age.valueVi}
                </div>
              )}
              {slide.year && (
                <div className="rounded border border-border bg-background/40 px-2 py-1 text-xs text-foreground backdrop-blur-sm">
                  {slide.year}
                </div>
              )}
              {slide.duration && (
                <div className="rounded border border-border bg-background/40 px-2 py-1 text-xs text-foreground backdrop-blur-sm">
                  <span>
                    {" "}
                    {Math.floor(slide.duration / 60)}h {slide.duration % 60}m
                  </span>
                </div>
              )}
            </div>

            {slide.genres && slide.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {slide.genres.map((genre, idx) => (
                <button
                  type="button"
                    key={idx}
                    className="rounded border border-border/70 bg-background/40 px-2 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary"
                    onClick={() => {
                      goGenre(typeof genre === "string" ? genre : genre.valueEn || genre.keyMap || "");
                    }}
                  >
                    {getGenreText(genre)}
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            {slide.description && (
                <p className="max-w-xl line-clamp-2 select-none pt-1 text-xs leading-relaxed text-foreground md:text-sm">
                {slide.description}
              </p>
            )}

            <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  aria-label={`Xem phim ${slide.title}`}
                  onClick={() => goFilmDetail(slide.slug)}
                  className="mr-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 sm:mr-4 sm:h-16 sm:w-16"
                >
                  <Play className="w-8 h-8 fill-current" />
                </button>
              <button
                type="button"
                aria-label={isCurrentSlideFavorite ? `Bỏ ${slide.title} khỏi yêu thích` : `Thêm ${slide.title} vào yêu thích`}
                aria-pressed={isCurrentSlideFavorite}
                onClick={() => handleToggleFavorite(slide.filmId)}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card/80 text-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                <Heart
                  className="w-4 h-4"
                  fill={isCurrentSlideFavorite ? "currentColor" : "none"}
                />
              </button>
              <button
                type="button"
                aria-label={`Thông tin phim ${slide.title}`}
                onClick={() => {
                  goFilmDetail(slide.slug);
                }}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card/80 text-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-20 flex max-w-[45%] gap-2 sm:bottom-8 sm:right-8">
        {films.map((film, index) => (
          <button
            key={film.filmId}
            type="button"
            aria-label={`Chuyển tới phim ${film.title}`}
            aria-current={index === currentSlide}
            onClick={() => goToSlide(index)}
            className={`relative h-14 w-10 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-[border-color,opacity,transform] duration-200 md:h-16 md:w-12 ${index === currentSlide
              ? "scale-105 border-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
              : "border-border opacity-75 hover:border-primary/60 hover:opacity-100"
              }`}
          >
            <img
              src={film.posterUrl || "/placeholder.svg"}
              alt={film.title}
              className="h-full w-full object-cover transition-[filter] duration-200"
            />
            <div className="absolute inset-0 bg-background/20" />
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        aria-label="Phim nổi bật trước"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-background/80 p-3 text-foreground opacity-100 transition-opacity hover:bg-background focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <button
        type="button"
        aria-label="Phim nổi bật tiếp theo"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-background/80 p-3 text-foreground opacity-100 transition-opacity hover:bg-background focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {/* Hover group for arrow visibility */}
      <div className="group" />
    </section>
  );
}
