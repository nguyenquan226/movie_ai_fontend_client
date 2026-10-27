import { FavoriteListMessage } from "@/constants/messages/user.message";
import privateAxios from "@/lib/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import {
  IFavorite,
  IFilmList,
  IPlaylistArray,
  IPlaylistDetail,
  IUpdatePlaylist,
  IUser,
} from "@/types/user.type";
import { User } from "lucide-react";
import { toast } from "sonner";

export const userServices = {
  callFavoriteFilmsList: (): Promise<IBackendRes<IFilmList>> => {
    return privateAxios.get("/favorites/get-user-favorite-list");
  },

  CallToggleFavoriteFilm: (
    filmdId: string
  ): Promise<IBackendRes<IFavorite>> => {
    return privateAxios.post("/favorites/toggle", { filmId: filmdId });
  },

  toggleFavoriteFilm: async (filmId: string) => {
    try {
      const res = await userServices.CallToggleFavoriteFilm(filmId);
      if (res && res.EC === 1) {
        if (res.data?.isFavorite === true)
          toast.success(FavoriteListMessage.addSucess);
        if (res.data?.isFavorite === false)
          toast.success(FavoriteListMessage.deleteSucess);
      }
    } catch (error) {
      console.log("Error from toggleFavoriteFilm: ", error);
      toast.error(FavoriteListMessage.error);
    }
  },

  CallGetUserPlaylist: (): Promise<IBackendRes<IPlaylistArray>> => {
    return privateAxios.get("/playlists/all-playlist");
  },

  CallGetPlaylistDetail: (
    playlistId: string
  ): Promise<IBackendRes<IPlaylistDetail>> => {
    return privateAxios.get(`/playlists/${playlistId}`);
  },

  CallRemoveFilmFromPlaylist: (
    playlistId: string,
    filmId: string
  ): Promise<IBackendRes<null>> => {
    return privateAxios.delete(`/playlists/${playlistId}/film/${filmId}`);
  },

  CallAddFilmToPlaylist: (
    playlistId: string,
    filmId: string
  ): Promise<IBackendRes<null>> => {
    return privateAxios.post(`/playlists/add-film`, {
      playlistId,
      filmId,
    });
  },

  CallCreatePlaylist: (
    playlistName: string,
    description?: string
  ): Promise<IBackendRes<null>> => {
    return privateAxios.post(`playlists`, {
      playlistName,
      description,
    });
  },

  CallEditPlaylist: (
    playlistId: string,
    updateData: IUpdatePlaylist
  ): Promise<IBackendRes<null>> => {
    return privateAxios.patch(
      `playlists/edit-playlist/${playlistId}`,
      updateData
    );
  },

  CallDeletePlaylist: (playlistId: string): Promise<IBackendRes<null>> => {
    return privateAxios.delete(`/playlists/remove-playlist/${playlistId}`);
  },

  CallUpdateProfile: (updateUserInfor: any): Promise<IBackendRes<null>> => {
    return privateAxios.patch("/users/update-profile", updateUserInfor);
  },
};
