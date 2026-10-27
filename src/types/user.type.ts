export interface IUser {
  userId: number;
  email: string;
  fullName: string;
  roleId: number;
  roleName: string;
  genderCode: string;
  isVip: boolean;
  statusCode: string;
  avatarUrl: string;
  permissions?: {
    name: string;
    apiPath: string;
    method: string;
    module: string;
  }[];
}

export interface IFilmList {
  favorites: filmInUserPage[];
}

export interface filmInUserPage {
  filmId: string;
  title: string;
  thumbUrl: string;
  originalTitle?: string;
  badge?: string;
  slug: string;
}

export interface IFavorite {
  isFavorite: boolean;
}

export interface IPlaylist {
  playlistId: string;
  playlistName: string;
  description?: string | null;
  total_film: number;
  films: string[];
}

export interface IPlaylistArray {
  playlists: IPlaylist[];
}

export interface IPlaylistDetail {
  playlistId: string;
  playlistName: string;
  description?: string | null;
  total_film: number;
  films: {
    filmId: string;
    title: string;
    thumbUrl: string;
    originalTitle?: string;
    badge?: string;
    slug: string;
  }[];
}

export interface IUpdatePlaylist {
  playlistName: string;
  description?: string;
}
