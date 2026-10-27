"use client";

import { PlayListMessage } from "@/constants/messages/user.message";
import { useFilmRouter } from "@/hooks/filmRouter";
import { userServices } from "@/services";
import { IPlaylistDetail } from "@/types/user.type";
import { X } from "lucide-react";
import { Loader } from "lucide-react";
import { toast } from "sonner";

export interface ListCardPlayListFilmsProps {
  playlistDetail: IPlaylistDetail;
  fetchPlaylistDetail: () => void;
  fetchPlaylists: () => void;
  isLoadingDetail: boolean;
}

export default function ListCardPlayListFilms({
  playlistDetail,
  fetchPlaylistDetail,
  fetchPlaylists,
  isLoadingDetail,
}: ListCardPlayListFilmsProps) {
  const { goFilmDetail } = useFilmRouter();

  const delteFilmFromPlaylist = async (playlistId: string, filmId: string) => {
    try {
      const res = await userServices.CallRemoveFilmFromPlaylist(
        playlistId,
        filmId
      );
      console.log("check res", res);

      if (res && res.EC === 1) {
        toast.success(PlayListMessage.deleteSucess);
        fetchPlaylists();
        fetchPlaylistDetail();
      }
    } catch (error) {
      console.log("Error from list card playlist film", error);
    }
  };

  return (
    <>
      <div className="flex-1">
        <>
          {isLoadingDetail && (
            <div className="flex justify-center items-center py-20">
              <Loader
                className="animate-spin text-muted-foreground"
                size={40}
                style={{ animationDuration: "1.5s" }}
              />
            </div>
          )}
          {!isLoadingDetail &&
            playlistDetail &&
            playlistDetail.films.length === 0 && (
              <div className="w-full flex justify-center mt-4">
                <div
                  className="w-full max-w-4xl h-48 rounded-xl flex items-center justify-center
                      border border-border/60 bg-background/60 backdrop-blur-sm
                      text-muted-foreground text-base font-medium shadow-inner"
                >
                  Danh sách này chưa có phim nào
                </div>
              </div>
            )}

          {!isLoadingDetail &&
            playlistDetail &&
            playlistDetail.films.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 overflow-scroll overflow-y-auto">
                {playlistDetail.films.map((film) => (
                  <div key={film.filmId} className="flex flex-col">
                    {/* CARD */}
                    <div
                      className="relative bg-card rounded-xl overflow-hidden shadow cursor-pointer "
                      style={{ borderRadius: "12px" }}
                    >
                      <button
                        onClick={() => {
                          delteFilmFromPlaylist(
                            playlistDetail.playlistId,
                            film.filmId
                          );
                        }}
                        className="absolute top-2 right-2 bg-background/80 p-1.5 rounded-full hover:bg-background z-20"
                      >
                        <X size={18} className="text-foreground cursor-pointer" />
                      </button>

                      <div
                        onClick={() => {
                          goFilmDetail(film.slug);
                        }}
                        className="w-full h-64 relative"
                      >
                        <img
                          src={film.thumbUrl}
                          alt={film.title}
                          className="object-cover w-full h-full transition-transform duration-300 hover:scale-[1.04]"
                        />
                      </div>

                      {film.badge && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                          <span className="px-3 py-1 text-xs rounded-md bg-primary text-black font-semibold shadow">
                            {film.badge}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-between text-center">
                      <p className="mt-3 text-foreground font-semibold truncate px-1">
                        {film.title}
                      </p>
                      <p className="text-muted-foreground text-sm truncate px-1">
                        {film.originalTitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </>
      </div>
    </>
  );
}
