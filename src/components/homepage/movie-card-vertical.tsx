"use client"

import { Heart, Info, Play } from "lucide-react"
import type { FilmDetailRes } from "@/types/filmType"
import { useFilmRouter } from "@/hooks/filmRouter"

interface MovieCardVerticalProps {
  item: FilmDetailRes
  handleToggleFavorite: (filmId: string) => void
  isFavorite: boolean
}

export default function MovieCardVertical({ item, handleToggleFavorite, isFavorite }: MovieCardVerticalProps) {
  const { goFilmDetail } = useFilmRouter()

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-primary/50">
      <button
        type="button"
        onClick={() => goFilmDetail(item.slug)}
        aria-label={`Xem chi tiết phim ${item.title}`}
        className="relative block aspect-[2/3] w-full overflow-hidden bg-muted text-left"
      >
        <img
          src={item.posterUrl || "/placeholder.svg"}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {item.badges?.length ? (
          <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
            {item.badges.map((badge, index) => (
              <span
                key={`${badge.text}-${index}`}
                className={`${badge.color} rounded px-2 py-1 text-xs font-semibold text-foreground`}
              >
                {badge.text}
              </span>
            ))}
          </div>
        ) : null}
      </button>

      <div className="flex flex-1 flex-col gap-3 p-3">
        <div className="min-w-0 flex-1">
          <h3 className="min-h-10">
            <button
              type="button"
              onClick={() => goFilmDetail(item.slug)}
              className="line-clamp-2 w-full text-left text-sm font-semibold leading-snug text-foreground transition-colors hover:text-primary"
            >
              {item.title}
            </button>
          </h3>
          {item.originalTitle && (
            <p className="mt-1 truncate text-xs text-muted-foreground">{item.originalTitle}</p>
          )}
          {item.year && <p className="mt-2 text-xs text-muted-foreground">{item.year}</p>}
        </div>

        <div className="flex items-center gap-2 border-t border-border pt-3">
          <button
            type="button"
            onClick={() => goFilmDetail(item.slug)}
            aria-label={`Xem phim ${item.title}`}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Play aria-hidden="true" className="h-4 w-4 fill-current" />
          </button>
          <button
            type="button"
            onClick={() => handleToggleFavorite(item.filmId)}
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
