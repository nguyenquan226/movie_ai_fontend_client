"use client";

import { useState, useEffect } from "react";
import { userServices } from "@/services";
import ListCardPlayListFilms from "./ListCardPlayListFilms";
import { IPlaylist, IPlaylistDetail } from "@/types/user.type";
import { Plus } from "lucide-react";
import { Play } from "lucide-react";
import { toast } from "sonner";
import { PlayListMessage } from "@/constants/messages/user.message";
import CreatePlaylistModal from "./CreatePlaylistModal";
import EditPlaylistModal from "./EditPlaylistModal";

export default function PlaylistContent({
  userPlaylists,
  fetchPlaylists,
  isLoadingPlaylist,
}: {
  userPlaylists: IPlaylist[];
  fetchPlaylists: () => void;
  isLoadingPlaylist: boolean;
}) {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [playlistDetail, setPlaylistDetail] = useState<IPlaylistDetail>();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPlaylistName, setSelectedPlaylistName] = useState("");
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    if (selectedPlaylist) {
      fetchPlaylistDetail(selectedPlaylist);
    }
  }, [selectedPlaylist]);

  const fetchPlaylistDetail = async (playlistId: string) => {
    try {
      setIsLoadingDetail(true);
      const res = await userServices.CallGetPlaylistDetail(playlistId);
      if (res && res.EC === 1) {
        setPlaylistDetail(res.data);
      }
    } catch (eror) {
      toast.error(PlayListMessage.errorFetchDetail);
      console.log("Error form fetch detail playlist", eror);
    } finally {
      await new Promise((r) => setTimeout(r, 500));
      setIsLoadingDetail(false);
    }
  };

  return (
    <>
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Danh sách</h1>
          <button
            type="button"
            onClick={() => setOpenCreate(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <Plus size={18} /> Thêm mới
          </button>
        </div>

        {isLoadingPlaylist ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4" role="status" aria-live="polite">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="space-y-3 rounded-xl border border-border bg-card p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
              </div>
            ))}
            <span className="sr-only">Đang tải danh sách</span>
          </div>
        ) : userPlaylists.length === 0 ? (
          <div className="mt-8 rounded-xl border border-border bg-background p-8 text-center text-sm text-muted-foreground">
            Bạn chưa có danh sách nào. Chọn “Thêm mới” để tạo danh sách.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {userPlaylists.map((pl) => (
              <article
                key={pl.playlistId}
                className={`rounded-xl border p-4 transition-colors sm:p-5 ${
                  selectedPlaylist === pl.playlistId
                    ? "border-primary"
                    : "border-border"
                } bg-card hover:border-primary/60`}
              >
                <button
                  type="button"
                  aria-pressed={selectedPlaylist === pl.playlistId}
                  onClick={() => setSelectedPlaylist(pl.playlistId)}
                  className="w-full rounded-md text-left"
                >
                  <span className="block truncate text-base font-semibold text-foreground">{pl.playlistName}</span>
                  <span className="mt-2 flex items-center text-sm text-muted-foreground">
                    <Play aria-hidden="true" className="h-4 w-4" />
                    <span className="ml-1">{pl.total_film} phim</span>
                  </span>
                </button>
                <button
                  type="button"
                  aria-label={`Sửa danh sách ${pl.playlistName}`}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedPlaylistName(pl.playlistName);
                    setOpenEdit(true);
                  }}
                >
                  {" "}
                  <span className="mt-3 inline-block min-h-11 pt-3 text-sm text-primary underline">Sửa</span>
                </button>
              </article>
            ))}
          </div>
        )}

        {selectedPlaylist && (
          <div>
            {isLoadingDetail ? (
              <div className="mt-6 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground" role="status">
                Đang tải danh sách phim...
              </div>
            ) : playlistDetail &&
              playlistDetail.films &&
              playlistDetail.films.length > 0 && (
                <ListCardPlayListFilms
                  isLoadingDetail={isLoadingDetail}
                  playlistDetail={playlistDetail}
                  fetchPlaylists={fetchPlaylists}
                  fetchPlaylistDetail={() =>
                    fetchPlaylistDetail(selectedPlaylist)
                  }
                />
              )}
            {!isLoadingDetail && playlistDetail?.films?.length === 0 && (
              <div className="mt-6 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
                Danh sách này chưa có phim.
              </div>
            )}
          </div>
        )}
      </div>

      <CreatePlaylistModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />

      <EditPlaylistModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        playlistName={selectedPlaylistName}
        playlistId={selectedPlaylist ?? ""}
      />
    </>
  );
}
