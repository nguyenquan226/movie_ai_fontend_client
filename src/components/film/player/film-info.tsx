import { Star } from "lucide-react"
import { AllCodeValue } from "@/types/allcode.type"

import { useFilmStore } from "@/stores/filmStore"
import Link from "next/link";
import { filmPath } from "@/constants/path";

const FilmInfo = () => {

  const { filmData } = useFilmStore();
  if (!filmData) {
    return <div className="text-2xl font-semibold text-primary">Đang tải thông tin film...</div>
  }

  const { film, filmImages } = filmData;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-10  gap-4">
      <div className="col-span-6">
        <div className="flex">
          <img
            src={filmImages.poster}
            alt={film.title}
            className="object-cover w-30 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 ease-out"
          />
          <div className="flex flex-col gap-1 pl-4">
            <h1 className="text-2xl lg:text-xl font-bold text-foreground">{film.title}</h1>
            {film.originalTitle && (
              <h2 className="text-sm text-muted-foreground italic">{film.originalTitle}</h2>
            )}

            <div className="flex items-center flex-wrap gap-2 text-xs lg:text-sm text-muted-foreground">
              <span className="inline-flex items-center bg-[#facc15] text-black px-2 xl:py-0.5 py-1 rounded font-semibold">
                Chưa có đánh giá
                <Star size={14} className="ml-1" />
              </span>
              {film.age && (
                <span className="bg-[#FF3300] text-foreground px-2 xl:py-0.5 py-1 rounded font-semibold">
                  {film.age.valueVi}
                </span>
              )}
              {film.year && (
                <span className="bg-secondary text-foreground px-2 xl:py-0.5 py-1 rounded border">
                  {film.year}
                </span>
              )}
            </div>

            {!!film.genres?.length && (
              <div className="flex flex-wrap gap-2 text-xs lg:text-sm text-muted-foreground mt-2 ">
                {film.genres.map((g: AllCodeValue) => (
                  <button
                    key={g.keyMap}
                    className="bg-secondary text-foreground px-2 xl:py-0.5 py-1 rounded"
                  >
                    {g.valueVi}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="col-span-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-foreground">Giới thiệu:</h3>
          <p className="lg:text-sm text-xs text-muted-foreground leading-relaxed text-justify">
            {film.description}
          </p>
          <Link
            href={filmPath.FILM_DETAIL(filmData.film.slug)}
            className="
              relative text-primary
              after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-yellow-600 after:transition-[color,background-color,border-color,opacity,transform,box-shadow] after:duration-300 after:ease-out hover:after:w-[90px] xl:hover:after:w-[105px] xl:text-sm text-xs"
          >
            Thông tin chi tiết
          </Link>

        </div>
      </div>
    </div>

  )
}

export default FilmInfo
