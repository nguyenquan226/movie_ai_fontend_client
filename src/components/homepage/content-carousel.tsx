"use client"

import type { FilmDetailRes } from "@/types/filmType"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import MovieCard from "./movie-card"
import type { filmInUserPage } from "@/types/user.type"
import { useAppRouter } from "@/hooks/useAppRouter"

interface ContentCarouselProps {
  title: string
  items: FilmDetailRes[]
  userFavoriteList: filmInUserPage[]
  hanhleToggleFavorite: (filmId: string) => void
  country?: string // Added country prop
}

export default function ContentCarousel({
  title,
  items,
  userFavoriteList,
  hanhleToggleFavorite,
  country = "korea",
}: ContentCarouselProps) {
  const { goCountry } = useAppRouter()
  const getCountrySlug = (country: string) => {
    const countryMap: { [key: string]: string } = {
      korea: "korea",
      china: "china",
      usa: "usa",
    }
    return countryMap[country] || "korea"
  }

  const handleViewAll = () => {
    goCountry(getCountrySlug(country))
  }
  return (
    <section className="py-8 px-4 md:px-8 bg-background">
      <div className="w-full max-w-7xl mx-auto">
        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold leading-snug text-foreground md:text-2xl">
              {title}
            </h2>
            <button
              type="button"
              onClick={handleViewAll}
              className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-md px-2 text-sm font-medium text-primary transition-colors hover:bg-secondary hover:text-foreground"
            >
              Xem toàn bộ
              <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative flex items-center gap-6">
          <Carousel
            className="w-full"
            aria-label={title}
            opts={{
              align: "start",
            }}
          >
            <CarouselContent className="-ml-3 py-4 sm:-ml-4">
              {items.map((item) => {
                //luong add
                let isFavorite = false;
                const index = userFavoriteList.findIndex(
                  (f) => f.filmId === item.filmId
                );
                if (index !== -1) {
                  isFavorite = true;
                }

                return (
                  <CarouselItem key={item.filmId} className="basis-[86%] pl-3 sm:basis-1/2 sm:pl-4 lg:basis-1/3">
                    <MovieCard
                      item={item}
                      isFavorite={isFavorite}
                      hanhleToggleFavorite={hanhleToggleFavorite}
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <CarouselPrevious aria-label={`Phần trước: ${title}`} className="absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 rounded-full border border-border bg-card text-foreground shadow-lg hover:bg-secondary sm:flex lg:-left-5" />
            <CarouselNext aria-label={`Phần tiếp theo: ${title}`} className="absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 rounded-full border border-border bg-card text-foreground shadow-lg hover:bg-secondary sm:flex lg:-right-5" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
