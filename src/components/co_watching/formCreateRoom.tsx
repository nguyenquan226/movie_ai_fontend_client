"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { co_watchingPath } from "@/constants/path";
import { useAuthStore } from "@/stores/authStore";
import { useCoWatchingStore } from "@/stores/co-watchingStore";
import { IFilmSearch } from "@/types/search.type";
import { FilmDetail } from "@/types/film.type";
import { PartDetail } from "@/types/part.type";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PartEpisodeDialog } from "./partEpisodeDialog";
import SearchDropdown from "@/app/co-watching/create/_components/search-dropdown";

interface FormCreateRoomProps {
  filmData: FilmDetail;
  partData: PartDetail[],
  setSelectedFilm: (film: IFilmSearch) => void;
  resetFilmDetail: () => void;
}

export const FormCreateRoom = ({
  filmData,
  partData,
  setSelectedFilm,
  resetFilmDetail
}
  : FormCreateRoomProps
) => {
  const router = useRouter();

  const { authUser } = useAuthStore();
  const { dataRoom, createLiveRoom } = useCoWatchingStore();

  const [roomName, setRoomName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [open, setOpen] = useState(false);
  const [part, setPart] = useState('1');
  const [episode, setEpisode] = useState('1')
  const [filmId, setFilmId] = useState("");
  const [thumbUrl, setThumbUrl] = useState("");

  useEffect(() => {
    if (!authUser.userId || !filmData) {
      return;
    }

    setRoomName(`Xem phim ${filmData.film.title} cùng ${authUser.fullName} nhé!`);
    setFilmId(filmData.film.filmId);
    setThumbUrl(filmData.filmImages.poster);
  }, [filmData, authUser]);


  const createRoom = async () => {
    if (!authUser.userId) {
      toast.error("Vui lòng đăng nhập lại để tạo phòng!");
      return;
    }
    if (!filmId) {
      toast.error("Vui lòng chọn phim!");
      return;
    }

    const data = {
      name: roomName,
      isPrivate: isPrivate,
      isLive: true,
      filmId: filmId,
      partNumber: +part,
      episodeNumber: +episode,
      thumbUrl: thumbUrl
    }

    await createLiveRoom(data);
  }

  useEffect(() => {

    console.log("check data room: ", dataRoom)
    if (!dataRoom) return;

    const handleRedirect = async () => {
      toast.success("Vui lòng đợi vài giây để chuyển sang phòng LIVE")
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push(co_watchingPath.PLAY(dataRoom.room.roomId));
    }

    handleRedirect();
  }, [dataRoom, router]);

  const handleCancel = () => {
    resetFilmDetail();
    router.push(co_watchingPath.MAIN());
  }

  return (
    <>
      <div>
        <div className="space-y-4">
          <div className="p-6 pt-5 text-foreground bg-[#282b3a] rounded-3xl">
            <Label
              className="lg:text-lg text-sm font-semibold pb-2"
            >
              Tìm kiếm phim khác
            </Label>
            <div className="mt-2">
              <SearchDropdown
                className="md:py-3 py-2 bg-transparent rounded-lg !text-sm text-foreground caret-amber-400 active:text-foreground border-zinc-500 active:border-zinc-500 active:ring-0 focus-visible:ring-0 selection:bg-amber-400 selection:text-black"
                onSelectFilm={(film) => {
                  setSelectedFilm(film);
                }}
              />
            </div>
          </div>

          <div className="p-6 pt-5 text-foreground bg-[#282b3a] rounded-3xl">
            <Label
              htmlFor="room-name"
              className="lg:text-lg text-sm font-semibold pb-2"
            >
              Tên phòng
            </Label>
            <Input
              type="text"
              id="room-name"
              placeholder="Nhập tên phòng"
              className="md:!text-sm !text-xs text-foreground caret-amber-400 active:text-foreground md:py-5 py-3 px-4 border-zinc-500 active:border-zinc-500 active:ring-0 focus-visible:ring-0 selection:bg-amber-400 selection:text-black"
              value={roomName}
              onChange={(evt) => setRoomName(evt.target.value)}
            />
          </div>

          <div className="p-6 pt-5 text-foreground bg-[#282b3a] rounded-3xl">
            <div className="flex items-center pb-2 justify-between">
              <h3 className="lg:text-lg text-sm  font-semibold">
                Thông tin chi tiết:
              </h3>
              <button
                className="md:px-2 px-1 py-0.5 rounded-lg bg-transparent border-2 border-zinc-400 text-muted-foreground md:text-sm text-xs hover:bg-amber-400 hover:border-amber-400 hover:text-black cursor-pointer transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-150 ease-in-out font-semibold"
                type="button"
                onClick={() => setOpen(true)}
              >
                Chọn
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1 flex items-center gap-3">
                <h3 className="md:text-sm text-xs italic">Phần: </h3>
                <p className="text-primary font-semibold">{part}</p>
              </div>
              <div className="flex-1 flex items-center gap-3 ">
                <h3 className="md:text-sm text-xs italic">Tập: </h3>
                <p className="text-primary font-semibold">{episode}</p>
              </div>
            </div>
          </div>
          <div className="p-6 pt-5 text-foreground bg-[#282b3a] rounded-3xl">
            <div className="flex items-center justify-between pb-2">
              <h3 className="lg:text-lg text-sm  font-semibold">Bạn chỉ muốn xem với bạn bè?</h3>
              <Switch
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
            </div>
            <p className="text-zinc-200/80 md:text-sm text-xs">Nếu bật, chỉ có thành viên có link mới được xem phòng này</p>
          </div>
          <div className="grid grid-cols-10 gap-4">
            <div className="col-span-7">
              <button
                className="w-full bg-amber-300 md:py-3 py-2.5 rounded-2xl cursor-pointer md:text-lg text-xs font-semibold hover:shadow-[0px_0px_10px_0px_#ffd230] transition-[color,background-color,border-color,opacity,transform,box-shadow] ease duration-200"
                onClick={createRoom}
              >
                Tạo phòng
              </button>
            </div>
            <div className="col-span-3">
              <button
                className="w-full bg-zinc-300 md:py-3 py-2.5 rounded-2xl cursor-pointer md:text-lg text-xs font-semibold hover:shadow-[0px_0px_10px_0px_#d4d4d8] transition-[color,background-color,border-color,opacity,transform,box-shadow] ease duration-200"
                onClick={handleCancel}
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      </div>
      <PartEpisodeDialog
        partData={partData}
        open={open}
        setOpen={setOpen}
        part={part}
        setPart={setPart}
        episode={episode}
        setEpisode={setEpisode}
      />
    </>
  )
}
