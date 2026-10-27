"use client"

import { useEffect, useState } from "react"
import HeroCarousel from "@/components/homepage/hero-carousel"
import ContentCarousel from "@/components/homepage/content-carousel"
import { userFavoriteStore } from "@/stores/favoriteStore"
import { userServices } from "@/services"
import { useFilmStore } from "@/stores/filmStore"
import type { FilmDetailRes } from "@/types/filmType"

const getPosterUrl = (film: FilmDetailRes): string => {
  if (film.posterUrl) return film.posterUrl
  if (film.filmImages && Array.isArray(film.filmImages)) {
    const posterImage = film.filmImages.find((img) => img.type === "poster")
    if (posterImage) return posterImage.url
    if (film.filmImages.length > 0) return film.filmImages[0].url
  }
  return "/placeholder.svg"
}

export default function Home() {
  const {
    fetchKoreanFilms,
    fetchChineseFilms,
    fetchUSUKFilms,
    koreanFilms,
    chineseFilms,
    usukFilms,
    error,
  } = useFilmStore()

  const { fetchFavoriteList, favoriteList } = userFavoriteStore()
  const [isLoadingHome, setIsLoadingHome] = useState(true)

  const handleToggleFavorite = async (filmId: string) => {
    await userServices.toggleFavoriteFilm(filmId)
    fetchFavoriteList()
  }

  useEffect(() => {
    let isCurrent = true
    Promise.allSettled([
      fetchKoreanFilms(),
      fetchChineseFilms(),
      fetchUSUKFilms(),
      fetchFavoriteList(),
    ]).finally(() => {
      if (isCurrent) setIsLoadingHome(false)
    })

    return () => {
      isCurrent = false
    }
  }, [])

  if (isLoadingHome) {
    return (
      <div className="min-h-[70vh] bg-background px-4 pt-28" role="status" aria-live="polite">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="aspect-video animate-pulse bg-muted" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
        <span className="sr-only">Đang tải danh sách phim</span>
      </div>
    )
  }

  if (!koreanFilms.length && !chineseFilms.length && !usukFilms.length) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-background px-4 pt-24 text-center">
        <div className="max-w-md rounded-2xl border border-border bg-card p-8">
          <h1 className="text-xl font-semibold text-foreground">
            {error ? "Chưa thể tải phim" : "Chưa có phim để hiển thị"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {error
              ? "Đã xảy ra lỗi khi tải danh sách. Vui lòng thử tải lại trang."
              : "Danh sách phim hiện đang trống. Hãy quay lại sau."}
          </p>
          {error && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 min-h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Thử lại
            </button>
          )}
        </div>
      </main>
    )
  }

  const transformFilmData = (films: FilmDetailRes[]) => {
    return films.map((film) => ({
      filmId: film.filmId,
      id: film.filmId,
      title: film.title,
      originalTitle: film.originalTitle,
      posterUrl: getPosterUrl(film),
      imdbRating: film.ratingData?.averageRating || 0,
      partData: film.partData || [],
      age: film.age,
      year: film.year,
      slug: film.slug,
      country: film.country,
      genres:
        film.genres
          ?.map((genre) =>
            typeof genre === "string" ? genre : genre.valueVi || genre.valueEn || genre.keyMap || "",
          )
          .filter(Boolean) || [],
      badges: film.badges || [],
      episodes: film.partData?.length ? `${film.partData.length} tập` : undefined,
    }))
  }

  const transformedKoreanFilms = transformFilmData(koreanFilms)
  const transformedChineseFilms = transformFilmData(chineseFilms)
  const transformedUSUKFilms = transformFilmData(usukFilms)

  return (
    <div className="min-h-screen bg-background">
      <HeroCarousel />

      <main className="space-y-4 overflow-x-clip bg-background pb-12">
        {transformedKoreanFilms.length > 0 && (
          <ContentCarousel
            title="Phim Hàn Quốc mới"
            items={transformedKoreanFilms}
            userFavoriteList={favoriteList}
            hanhleToggleFavorite={handleToggleFavorite}
            country="korea"
          />
        )}
        {transformedChineseFilms.length > 0 && (
          <ContentCarousel
            title="Phim Trung Quốc mới"
            items={transformedChineseFilms}
            userFavoriteList={favoriteList}
            hanhleToggleFavorite={handleToggleFavorite}
            country="china"
          />
        )}
        {transformedUSUKFilms.length > 0 && (
          <ContentCarousel
            title="Phim US-UK mới"
            items={transformedUSUKFilms}
            userFavoriteList={favoriteList}
            hanhleToggleFavorite={handleToggleFavorite}
            country="usa"
          />
        )}
      </main>
    </div>
  )
}
