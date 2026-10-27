"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { userServices } from "@/services";
import { toast } from "sonner";
import { userPlaylistStore } from "@/stores/playlistStore";
import { PlayListMessage } from "@/constants/messages/user.message";

interface CreatePlaylistInFilmDetailModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreatePlaylistInFilmDetail({
  open,
  onClose,
}: CreatePlaylistInFilmDetailModalProps) {
  const [name, setName] = useState("");

  const { fetchPlaylists } = userPlaylistStore();

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Tên danh sách không được để trống");
      return;
    }
    try {
      const res = await userServices.CallCreatePlaylist(name);
      if (res && res?.EC === 1) {
        toast.success(PlayListMessage.createPlaylistSucess);
        fetchPlaylists();
        setName("");
        onClose();
      }

      if (res && res.EC == 2) {
        toast.error(PlayListMessage.alreadyExist);
      }
    } catch (error) {
      toast.error(PlayListMessage.errorPlaylist);
      console.log("Error from create paylist modal component: ", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
     bg-zinc-700/30
      backdrop-blur-md
      border border-border/70
      shadow-[0_8px_30px_rgba(0,0,0,0.6)]
      rounded-2xl
      px-6 py-7
      text-foreground
      animate-in fade-in-0 zoom-in-95
      sm:w-[400px]
    "
      >
        <DialogHeader>
          <DialogTitle
            className="
          text-center text-base font-semibold uppercase tracking-wide
          text-foreground/90
        "
          >
            Thêm danh sách mới
          </DialogTitle>
        </DialogHeader>

        {/* Input */}
        <input
          placeholder="Tên danh sách"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
        w-full mt-4 p-3
        rounded-lg
        bg-black/20
        border border-border/70
        backdrop-blur-md
        text-foreground
        transition-[color,background-color,border-color,opacity,transform,box-shadow]
        outline-none
        focus:border-primary
        focus:shadow-[0_0_12px_rgba(250,204,21,0.4)]
      "
        />

        {/* Buttons */}
        <div className="flex justify-center gap-3 mt-6">
          <Button
            onClick={handleCreate}
            className="
          px-5 py-2
          bg-primary text-black font-semibold
          rounded-lg
          transition-[color,background-color,border-color,opacity,transform,box-shadow]
          hover:bg-primary
          hover:shadow-[0_0_12px_rgba(255,215,0,0.5)]
        "
          >
            Thêm
          </Button>

          <Button
            variant="ghost"
            onClick={onClose}
            className="
          px-5 py-2
          bg-card/70 text-foreground
          hover:bg-white/20
          backdrop-blur-md
        "
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
