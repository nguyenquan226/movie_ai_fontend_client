export const userPath = {
  HOME: "/phimhay",
  UPGRADE_VIP: "/user/upgrade_vip",
  CONTINUE_WATCHING: "/user/continue-watching",
  FAVORITE: "/user/favorites",
  NOTIFICATION: "/user/notifications",
  PLAYLIST: "/user/playlists",
  PROFILE: "/user/profile",
};
export const filmPath = {
  ACTOR_DETAIL: (slug: number | string) => `/actor-detail/${slug}`,
  DIRECTOR_DETAIL: (slug: number | string) => `/director-detail/${slug}`,
  PRODUCER_DETAIL: (slug: number | string) => `/producer-detail/${slug}`,
  FILM_DETAIL: (slug: string) => `/film-detail/${slug}`,
  PLAYER_DETAIL: (filmSlug: string, part: string, episode: string) =>
    `/play/${filmSlug}?p=${part}&ep=${episode}`,
};

export const playPath = {
  WATCHNOW: (id: string) => `/play/${id}`,
};

export const co_watchingPath = {
  MAIN: () => `/co-watching`,
  CREATE: () => `/co-watching/create`,
  PLAY: (id: string) => `/co-watching/${id}`,
};
