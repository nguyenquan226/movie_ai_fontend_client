import { useRouter } from "next/navigation"

import { IFilmSuggestRes } from "@/types/film.type"
import { Eye } from "lucide-react";

const SuggestList = ({ suggestList }: { suggestList: IFilmSuggestRes[] }) => {
  const router = useRouter();

  return (
    <>
      <h1 className="text-2xl font-semibold pb-4">Phim đề xuất</h1>

      <div className="flex flex-col md:gap-4 gap-6">
        {suggestList.map((item, index) => {
          const thumb = item.filmImages?.find(img => img.type === 'poster')?.url || "/images/small.jpg";

          return (
            <div
              key={index}
              onClick={() => router.push(`/film-detail/${item.slug}`)}
              className="xl:flex xl:items-stretch gap-4 cursor-pointer duration-300 hover:bg-eerie-black rounded-[12px] bg-background xl:bg-transparent shadow-[0px_10px_20px_0px_rgba(59,_130,_246,_0.3)] md:shadow-none group ease-out"
            >
              <div className="relative w-full xl:w-[130px] xl:min-w-[130px] rounded-[8px] xl:rounded-[12px] overflow-hidden">
                <div className="w-full pb-[56.25%] relative">
                  <img
                    className="min-w-full min-h-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[8px] xl:rounded-[12px] group-hover:scale-110 transition-[color,background-color,border-color,opacity,transform,box-shadow] ease-out"
                    alt={item.title}
                    src={thumb}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0 p-4 xl:p-0  flex flex-col justify-center">
                <h3 className="text-white-smoke font-medium xl:text-[14px] text-[16px] leading-[150%] tracking-[0.32px] mb-2 line-clamp-2 group-hover:text-primary transition-colors ease-out">
                  {item.title}
                </h3>
                <div className="text-spanish-gray xl:text-[14px] text-[14px] leading-[150%] tracking-[0.32px] flex items-center gap-1">
                  <Eye size={12} />
                  <p>
                    {item.view} • {item.age.valueEn} • {item.country.valueVi}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </>
  )
}

export default SuggestList
