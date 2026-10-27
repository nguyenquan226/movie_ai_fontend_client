"use client";

import { useEffect, useState } from "react";
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
import { IUpdatePlaylist } from "@/types/user.type";

interface EditPlaylistModalProps {
  open: boolean;
  onClose: () => void;
  playlistName?: string;
  playlistId: string;
}

export default function EditPlaylistModal({
  open,
  onClose,
  playlistName = "",
  playlistId,
}: EditPlaylistModalProps) {
  const [name, setName] = useState("");
  const { fetchPlaylists } = userPlaylistStore();

  useEffect(() => {
    if (open) {
      setName(playlistName || "");
    }
  }, [playlistName, open]);

  const handledEdit = async () => {
    if (!name.trim()) {
      toast.error("Tên danh sách không được để trống");
      return;
    }
    try {
      const datUpdate: IUpdatePlaylist = {
        playlistName: name,
      };
      const res = await userServices.CallEditPlaylist(playlistId, datUpdate);
      if (res && res?.EC === 1) {
        toast.success(PlayListMessage.editSucess);
        fetchPlaylists();
        setName("");
        onClose();
      }

      if (res && res.EC == 2) {
        toast.error(PlayListMessage.alreadyExist);
      }
    } catch (error) {
      toast.error(PlayListMessage.errorEdit);
      console.log("Error from edit paylist modal component: ", error);
    }
  };

  const handleDeletePlaylist = async () => {
    try {
      const res = await userServices.CallDeletePlaylist(playlistId);
      if (res && res.EC === 1) {
        toast.success(PlayListMessage.deletePlaylsitSucess);
        fetchPlaylists();
        setName("");
        onClose();
      }
    } catch (error) {
      toast.error(PlayListMessage.erroDelete);
      console.log("Error from edit paylist modal component: ", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border border-border/70 text-foreground rounded-2xl px-6 py-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Cập nhật playlist
          </DialogTitle>
        </DialogHeader>

        {/* Input */}
        <input
          placeholder="Tên danh sách"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-4 p-3 rounded-lg bg-secondary border border-border/70 text-foreground outline-none focus:border-primary transition"
        />

        {/* Buttons */}
        <div className="flex justify-center gap-3 mt-6">
          <Button
            onClick={handledEdit}
            className="px-5 bg-primary text-black hover:bg-primary cursor-pointer"
          >
            Lưu
          </Button>
          <Button
            variant="secondary"
            onClick={handleDeletePlaylist}
            className="px-5 bg-white text-black hover:bg-gray-200 cursor-pointer"
          >
            Xóa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
