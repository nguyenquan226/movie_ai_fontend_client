"use client"

import { useEffect, useState } from "react"
import { Heart, Info, Play, Star } from "lucide-react"
import type { FilmDetailRes } from "@/types/filmType"
import { useFilmRouter } from "@/hooks/filmRouter"
import { ratingService } from "@/services/ratingService"

interface MovieCardProps {
  item: FilmDetailRes
  badgeColor?: string
  isFavorite: boolean
  hanhleToggleFavorite: (filmId: string) => void
}

export default function MovieCard({
  item,
  badgeColor = "bg-blue-600",
  isFavorite,
  hanhleToggleFavorite,
}: MovieCardProps) {
  const [averageRating, setAverageRating] = useState<number>(0)
  const [isLoadingRating, setIsLoadingRating] = useState(false)
  const { goFilmDetail } = useFilmRouter()

  useEffect(() => {
    if (!item.filmId) return

    let isCurrent = true
    const fetchMovieRating = async () => {
      setIsLoadingRating(true)
      try {
        const response = await ratingService.getRatingsByFilm(item.filmId)
        if (isCurrent && response?.EC === 1) {
          const result = response.data?.result
          setAverageRating(result?.averageRating || 0)
        }
      } catch (error) {
        console.error(`Error fetching rating for ${item.filmId}:`, error)
        if (isCurrent) setAverageRating(0)
      } finally {
        if (isCurrent) setIsLoadingRating(false)
      }
    }

    fetchMovieRating()
    return () => {
      isCurrent = false
    }
  }, [item.filmId])

  const ageRating =
    typeof item.age === "string"
      ? item.age
      : item.age?.valueVi || item.age?.valueEn
  const genreLabels = item.genres
    ?.map((genre) =>
      typeof genre === "string" ? genre : genre?.valueVi || genre?.valueEn || "",
    )
    .filter(Boolean)

  return (
    <article className="group min-w-0 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-primary/50">
      <button
        type="button"
        onClick={() => goFilmDetail(item.slug)}
        className="relative block aspect-video w-full overflow-hidden bg-muted text-left"
        aria-label={`Xem chi tiết phim ${item.title}`}
      >
        <img
          src={item.posterUrl || "/placeholder.svg"}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {item.badges?.length ? (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {item.badges.map((badge, index) => (
              <span
                key={`${badge.text}-${index}`}
                className={`${badge.color || badgeColor} rounded px-2 py-1 text-xs font-semibold text-foreground`}
              >
                {badge.text}
              </span>
            ))}
          </div>
        ) : null}
        <span className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
          <Play aria-hidden="true" className="h-4 w-4 fill-current" />
        </span>
      </button>

      <div className="space-y-3 p-3 sm:p-4">
        <div className="min-w-0">
          <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-snug text-foreground">
            {item.title}
          </h3>
          {item.originalTitle && (
            <p className="mt-1 truncate text-sm text-muted-foreground">{item.originalTitle}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {isLoadingRating ? (
            <span role="status" aria-label="Đang tải điểm đánh giá" className="h-4 w-12 animate-pulse rounded bg-muted" />
          ) : averageRating > 0 ? (
            <span className="inline-flex items-center gap-1 text-foreground">
              <Star aria-hidden="true" className="h-3.5 w-3.5 fill-primary text-primary" />
              {averageRating.toFixed(1)}
            </span>
          ) : null}
          {ageRating && <span className="rounded border border-border px-2 py-1">{ageRating}</span>}
          {item.year && <span>{item.year}</span>}
          {item.episodes && <span>{item.episodes}</span>}
        </div>

        {!!genreLabels?.length && (
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {genreLabels.join(", ")}
          </p>
        )}

        <div className="flex items-center gap-2 border-t border-border pt-3">
          <button
            type="button"
            onClick={() => goFilmDetail(item.slug)}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Play aria-hidden="true" className="h-4 w-4 fill-current" />
            Xem phim
          </button>
          <button
            type="button"
            onClick={() => hanhleToggleFavorite(item.filmId)}
            aria-label={isFavorite ? `Bỏ ${item.title} khỏi yêu thích` : `Thêm ${item.title} vào yêu thích`}
            aria-pressed={isFavorite}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-foreground transition-colors hover:border-primary/60 hover:text-primary"
          >
            <Heart aria-hidden="true" className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            onClick={() => goFilmDetail(item.slug)}
            aria-label={`Thông tin phim ${item.title}`}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-foreground transition-colors hover:border-primary/60 hover:text-primary"
          >
            <Info aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  )
}
