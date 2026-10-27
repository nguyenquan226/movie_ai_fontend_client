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

interface CreatePlaylistModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreatePlaylistModal({
  open,
  onClose,
}: CreatePlaylistModalProps) {
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
bg-card border border-border/70 text-foreground rounded-2xl px-6 py-6 shadow-2xl
        "
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center text-foreground drop-shadow">
            Thêm danh sách mới
          </DialogTitle>
        </DialogHeader>

        {/* Input */}
        <input
          placeholder="Tên danh sách"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
            w-full mt-4 p-3 rounded-lg
            bg-background/30
            border border-white/20
            backdrop-blur-md
            text-foreground
            outline-none
            focus:border-primary
            transition
          "
        />

        {/* Buttons */}
        <div className="flex justify-center gap-3 mt-6">
          <Button
            onClick={handleCreate}
            className="
              px-5
              bg-primary
              text-black
              hover:bg-primary
              hover:shadow-[0_0_12px_rgba(250,204,21,0.45)]
              cursor-pointer
            "
          >
            Thêm
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            className="
              px-5
              bg-white/80
              text-black
              hover:bg-white
              cursor-pointer
            "
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
