"use client";

import filmServices from "@/services/filmService";
import { IFilmVipRes } from "@/types/film.type";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../loading";

import { motion } from "framer-motion";
import { useFilmRouter } from "@/hooks/filmRouter";
import VIPBadge from "@/components/film/detail/VIPBagde";
import { useFilmClick } from "@/hooks/handleFiilmClick";


const FilmVipPage = () => {
  const { goFilmDetail } = useFilmRouter();
  const [filmData, setFilmData] = useState<IFilmVipRes[] | null>(null);
  const { handleFilmClick } = useFilmClick();


  useEffect(() => {
    handleFetchData();
  }, [])

  const handleFetchData = async () => {
    try {
      const res = await filmServices.getAllVip();
      if (res.EC === 0 && res.data && res.data.result.length > 0) {
        setFilmData(res.data.result);
      } else {
        toast.warning("Không có thông tin film vip");
      }
    } catch (error) {
      console.log("Error when fetch data vip: ", error);
    }
  }

  if (!filmData) {
    return (
      <Loading />
    )
  }
  console.log("Check data vip: ", filmData)
  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden pt-[72px]">
      <div className="px-4 py-8 pb-0">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center">
            <span>
              Phim VIP
            </span>
            <VIPBadge size="lg" className="ml-2" />
          </h1>
          <p className="text-muted-foreground">
            {filmData.length} phim | Cập nhật mới nhất
          </p>
        </div>
      </div>

      <section className="relative flex-1 w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-5">
            {filmData.map((f, i) => {
              const thumb = f.filmImages?.find(img => img.type === 'poster')?.url || "/images/small.jpg";
              return (
                <div
                  key={i}
                  className="flex items-center justify-center"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.08,
                      zIndex: 10,
                      boxShadow: "0 0 25px rgba(250, 204, 21, 0.3)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group relative overflow-hidden rounded-xl aspect-[3/4] md:aspect-[2/3] h-72 md:h-80 min-w-[220px] bg-secondary/50 cursor-pointer  border border-amber-400 mb-10"
                    onClick={() => goFilmDetail(f.slug)}
                  >
                    <img
                      src={thumb}
                      alt={f.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                flex flex-col justify-end p-4">
                      <h1 className="text-[11px] md:text-sm font-semibold text-foreground leading-tight line-clamp-2">
                        {f.title}
                      </h1>
                      <h2 className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {f.originalTitle}
                      </h2>
                      <div className="text-xs text-muted-foreground mt-1">
                        {f.year && <span>{f.year}</span>}
                        {f.duration && <span> - {f.duration} phút</span>}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilmClick(f);
                        }}
                        className="absolute bottom-3 right-4 text-xs font-semibold
                                                bg-primary text-black px-3 py-1 rounded-full shadow-md
                                                hover:bg-primary hover:scale-105 hover:shadow-[0_0_12px_rgba(250,204,21,0.6)]
                                                transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 ease-in-out flex items-center"
                      >
                        Xem ngay
                      </button>
                    </div>
                  </motion.div>
                </div>

              );
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
export default FilmVipPage
