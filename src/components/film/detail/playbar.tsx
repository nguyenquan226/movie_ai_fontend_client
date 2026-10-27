import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import {
  Heart,
  Plus,
  Send,
  MessageSquare,
  Star,
  LucideIcon,
  Copy,
} from "lucide-react";
import { useRatingStore } from "@/stores/ratingStore";
import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  WeiboShareButton,
} from "react-share";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { eventBus } from "@/lib/eventBus";
import { userFavoriteStore } from "@/stores/favoriteStore";
import { userServices } from "@/services";
import { useFilmStore } from "@/stores/filmStore";
import { usePlayerStore } from "@/stores/playerStore";
import { userPlaylistStore } from "@/stores/playlistStore";
import { toast } from "sonner";
import { PlayListMessage } from "@/constants/messages/user.message";
import CreatePlaylistInFilmDetail from "@/components/users/playlists/CreatePlaylistInFilmDetail";
import { filmPath } from "@/constants/path";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

interface PlayBarProps {
  activeTab: "comments" | "ratings";
  setActiveTab: (tab: "comments" | "ratings") => void;
}

type actionType = {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
};

//luong add

const ModalAdd = ({ action }: { action: actionType }) => {
  const Icon = action.icon;

  const { filmData } = useFilmStore();
  const { userPlaylists, fetchPlaylists } = userPlaylistStore();

  const [openCreate, setOpenCreate] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlaylists();
    }
  }, [isAuthenticated]);

  const handleToggleFilm = async (
    playlistId: string,
    filmId: string,
    isCheck: boolean
  ) => {
    if (isAuthenticated) {
      if (!filmId || !playlistId) return;
      try {
        if (isCheck) {
          const res = await userServices.CallRemoveFilmFromPlaylist(
            playlistId,
            filmId
          );
          if (res && res?.EC === 1) {
            toast.success(PlayListMessage.deleteSucess);
          }
        } else {
          const res = await userServices.CallAddFilmToPlaylist(
            playlistId,
            filmId
          );
          if (res && res?.EC === 1) {
            toast.success(PlayListMessage.addSucess);
          }
        }
        fetchPlaylists();
      } catch (err) {
        console.log("Error toggle playlist:", err);
        toast.error("Lỗi thao tác");
      }
    } else {
      toast.warning("Vui lòng đăng nhập");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex flex-col items-center justify-center w-9 min-[400px]:w-10 sm:w-16 md:w-20 h-9 min-[400px]:h-10 sm:h-14 md:h-16 rounded-lg sm:rounded-2xl text-foreground transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 ease-in-out cursor-pointer hover:text-primary focus:outline-none focus:ring-0">
            <Icon size={12} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2} />
            <span className="text-[7px] min-[400px]:text-[8px] sm:text-xs mt-0.5 sm:mt-1 leading-tight truncate max-w-[36px] sm:max-w-none">{action.label}</span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="bottom"
          align="center"
          sideOffset={0}
          className="w-60 bg-zinc-700/30 backdrop-blur-md border border-white/20 text-foreground rounded-2xl p-3 shadow-xl"
        >
          <DropdownMenuLabel className="flex justify-between text-xs uppercase tracking-wide text-muted-foreground px-1">
            <span>Danh sách</span>
            <span className="text-muted-foreground/70 font-normal">
              {userPlaylists.length}/5
            </span>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-2 bg-zinc-500" />

          <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
            {userPlaylists &&
              userPlaylists.map((pl) => {
                const isCheck =
                  pl.films.findIndex(
                    (item) => item === filmData?.film.filmId
                  ) !== -1
                    ? true
                    : false;
                return (
                  <div
                    key={pl.playlistId}
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => {
                      if (filmData?.film.filmId) {
                        handleToggleFilm(
                          pl.playlistId,
                          filmData?.film.filmId,
                          isCheck
                        );
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isCheck}
                      readOnly
                      className="w-4 h-4 accent-yellow-400 cursor-pointer"
                    />
                    <span className="text-sm text-foreground group-hover:text-primary transition">
                      {pl.playlistName}
                    </span>
                  </div>
                );
              })}
          </div>

          <DropdownMenuSeparator className="my-3 bg-zinc-600" />

          <DropdownMenuItem
            onClick={() => {
              if (isAuthenticated) {
                setOpenCreate(true);
              } else {
                toast.warning("Vui lòng đăng nhập");
              }
            }}
            className="flex justify-center p-2 font-medium rounded-md cursor-pointer text-primary bg-transparent hover:bg-primary hover:text-black hover:shadow-[0_0_12px_rgba(250,204,21,0.45)] focus:bg-primary focus:text-black transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-200 ease-in-out"
          >
            + Thêm mới
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreatePlaylistInFilmDetail
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
    </>
  );
};

//end luong add

const ModalShare = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { filmData } = useFilmStore();
  const filmTitle = filmData?.film?.title || "";
  const filmDescription = filmData?.film?.description || "";
  let filmImage = "";
  if (filmData?.filmImages?.poster) {
    filmImage = filmData.filmImages.poster;
  } else if (
    filmData?.film?.filmImages &&
    Array.isArray(filmData.film.filmImages)
  ) {
    const posterObj = filmData.film.filmImages.find(
      (img) => img.type === "poster"
    );
    filmImage = posterObj?.url || "";
  }
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentUrl);
    toast.success("Đã sao chép link!", {
      description: "Bạn có thể gửi cho bạn bè.",
      duration: 2500,
      position: "top-center",
      // className: "bg-background/90 text-primary border border-primary/30 rounded-xl px-5 py-4 shadow-[0_0_25px_rgba(250,204,21,0.25)]",
    });
  };
  const socialItems = [
    {
      icon: <i className="fa-brands fa-facebook-f text-foreground text-lg"></i>,
      color: "bg-blue-600 hover:bg-blue-600/80",
      name: "Facebook",
      ButtonComponent: FacebookShareButton,
      props: {
        url: currentUrl,
        hashtag: "#ChillFlix",
        quote: filmDescription,
      },
    },
    {
      icon: <i className="fa-brands fa-x-twitter text-foreground text-lg"></i>,
      color: "bg-black hover:bg-zinc-950",
      name: "Twitter",
      ButtonComponent: TwitterShareButton,
      props: {
        url: currentUrl,
        title: filmTitle,
      },
    },
    {
      icon: <i className="fa-brands fa-telegram text-foreground text-lg"></i>,
      color: "bg-sky-500 hover:bg-sky-500/80",
      name: "Telegram",
      ButtonComponent: TelegramShareButton,
      props: {
        url: currentUrl,
        title: filmTitle,
      },
    },
    {
      icon: <i className="fa-brands fa-whatsapp text-foreground text-lg"></i>,
      color: "bg-green-600 hover:bg-green-600/80",
      name: "WhatsApp",
      ButtonComponent: WhatsappShareButton,
      props: {
        url: currentUrl,
        title: filmTitle,
      },
    },
    {
      icon: <i className="fa-brands fa-weibo text-foreground text-lg"></i>,
      color: "bg-red-600 hover:bg-red-600/80",
      name: "Weibo",
      ButtonComponent: WeiboShareButton,
      props: {
        url: currentUrl,
        title: filmTitle,
        image: filmImage,
      },
    },
    {
      icon: <Copy size={18} className="text-foreground" />,
      color: "bg-gray-700 hover:bg-gray-600",
      name: "Copy",
      isCopy: true,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-600/10 backdrop-blur-md border border-white/25 text-foreground">
        <DialogHeader>
          <DialogTitle>Chia sẻ</DialogTitle>
          <DialogDescription className="text-muted-foreground/70">
            Bất kì ai có đường link đều cho thể truy cập được website.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center gap-2 pt-2">
          {socialItems.map((item, index) => {
            if (item.isCopy) {
              return (
                <Button
                  key={index}
                  onClick={handleCopy}
                  variant="ghost"
                  className={cn(
                    item.color,
                    "cursor-pointer transition-transform duration-240 ease-in hover:-translate-y-1.5"
                  )}
                >
                  {item.icon}
                </Button>
              );
            } else if (item.ButtonComponent) {
              const ShareBtn = item.ButtonComponent;
              return (
                <ShareBtn key={index} {...item.props}>
                  <div
                    className={cn(
                      item.color,
                      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,border-color,opacity,transform,box-shadow] cursor-pointer hover:-translate-y-1.5 duration-240 ease-in h-9 px-3"
                    )}
                  >
                    {item.icon}
                  </div>
                </ShareBtn>
              );
            } else {
              return null;
            }
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function PlayBar({ activeTab, setActiveTab }: PlayBarProps) {
  const [liked, setLiked] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const { averageRating, totalRatings } = useRatingStore();
  const router = useRouter();
  //luong add
  const { favoriteList, fetchFavoriteList } = userFavoriteStore();
  const { filmData } = useFilmStore();
  const { authUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavoriteList();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let likeStatus = false;
    likeStatus =
      favoriteList.findIndex((f) => f.filmId === filmData?.film.filmId) !== -1
        ? true
        : false;

    setLiked(likeStatus);
  }, [favoriteList]);

  const hanhleToggleFavorite = async (filmId: string) => {
    if (isAuthenticated) {
      await userServices.toggleFavoriteFilm(filmId);
      fetchFavoriteList();
    } else {
      toast.warning("Vui lòng đăng nhập");
    }
  };
  //end luong add
  const actions: actionType[] = [
    {
      id: "like",
      label: "Yêu thích",
      icon: Heart,
      onClick: () => {
        if (filmData?.film.filmId) {
          hanhleToggleFavorite(filmData.film.filmId); //luong addd
        }
      },
    },
    {
      id: "add",
      label: "Thêm vào",
      icon: Plus,
    },
    {
      id: "share",
      label: "Chia sẻ",
      icon: Send,
      onClick: () => setShowShare(true),
    },
    {
      id: "comment",
      label: "Bình luận",
      icon: MessageSquare,
      onClick: () => {
        eventBus.emit("switchTab", "comments");
        document
          .getElementById("comment-section")
          ?.scrollIntoView({ behavior: "smooth" });
      },
    },
  ];

  const { part, episode } = usePlayerStore();
  const p = part || "1";
  const ep = episode || "1";
  const handleFilmClick = () => {
    if (filmData?.film.type.keyMap === "FT_SINGLE" && filmData.film.isVip) {
      if (isAuthenticated) {
        if (authUser.isVip) {
          if (filmData?.film.slug) {
            router.push(filmPath.PLAYER_DETAIL(filmData.film.slug, p, ep));
          }
        } else {
          toast.warning("Bạn cần đăng ký VIP để xem được phim này");
        }
      } else {
        toast.warning("Bạn cần đăng nhập để xem được phim này");
      }
    } else {
      if (filmData?.film.slug) {
        router.push(filmPath.PLAYER_DETAIL(filmData.film.slug, p, ep));
      }
    }
  };
  return (
    <>
      {/* Mobile Layout - 1 dòng */}
      <div className="flex sm:hidden items-center justify-between w-full mt-2 px-1">
        <button
          onClick={handleFilmClick}
          className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-semibold rounded-full text-black bg-gradient-to-r from-yellow-300 to-yellow-500 hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 cursor-pointer whitespace-nowrap flex-shrink-0"
        >
          <span className="inline-block w-0 h-0 border-t-[3px] border-t-transparent border-l-[5px] border-l-black border-b-[3px] border-b-transparent"></span>
          <span className="hidden min-[320px]:inline">Xem Ngay</span>
          <span className="min-[320px]:hidden">Xem</span>
        </button>

        <div className="flex items-center justify-center flex-1 gap-0">
          {actions.map((action) => {
            const Icon = action.icon;
            const isLiked = action.id === "like" && liked;

            if (action.id === "add") {
              return <ModalAdd key={action.id} action={action} />;
            }

            return (
              <button
                key={action.id}
                onClick={action.onClick}
                className={cn(
                  "flex flex-col items-center justify-center w-9 h-9 min-[400px]:w-10 min-[400px]:h-10 rounded-lg transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-180 cursor-pointer",
                  isLiked ? "text-primary" : "text-foreground hover:text-primary"
                )}
              >
                <Icon
                  size={12}
                  strokeWidth={isLiked ? 0 : 2}
                  fill={isLiked ? "#facc15" : "none"}
                />
                <span className="text-[7px] min-[400px]:text-[8px] mt-0.5 leading-tight truncate max-w-[36px]">{action.label}</span>
              </button>
            );
          })}
        </div>

        <Button
          variant={"default"}
          className="px-1.5 py-1 bg-indigo-800 hover:bg-indigo-800/90 rounded-full text-xs flex-shrink-0 h-auto"
          onClick={() => {
            eventBus.emit("switchTab", "ratings");
            document.getElementById("rating-section")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <Star className="text-primary w-3 h-3" />
          <span className="text-[9px] min-[400px]:text-[10px]">{averageRating > 0 ? averageRating.toFixed(1) : "0.0"}</span>
        </Button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center justify-between w-full mt-4 px-4 md:px-6">
        <div className="flex items-center justify-center">
          <button
            onClick={handleFilmClick}
            className="flex items-center gap-2 px-8 py-3 font-semibold rounded-full text-black bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-200 hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 ease-in-out cursor-pointer whitespace-nowrap min-w-fit relative"
          >
            <span className="inline-block w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent"></span>
            Xem Ngay
          </button>

          <div className="flex items-center gap-4 md:gap-8 justify-center px-6 md:px-12">
            {actions.map((action) => {
              const Icon = action.icon;
              const isLiked = action.id === "like" && liked;

              if (action.id === "add") {
                return <ModalAdd key={action.id} action={action} />;
              }

              return (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className={cn(
                    "flex flex-col items-center justify-center w-16 md:w-20 h-14 md:h-16 rounded-2xl transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-180 ease-in-out cursor-pointer",
                    isLiked
                      ? "text-primary hover:text-primary"
                      : "text-foreground hover:text-primary"
                  )}
                >
                  <Icon
                    size={18}
                    strokeWidth={isLiked ? 0 : 2}
                    fill={isLiked ? "#facc15" : "none"}
                  />
                  <span className="text-xs mt-1">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <Button
          variant={"default"}
          className="px-3 py-4 bg-indigo-800 hover:bg-indigo-800/90 rounded-full group"
          onClick={() => {
            eventBus.emit("switchTab", "ratings");
            document
              .getElementById("rating-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <p className="flex items-center justify-center gap-1">
            <Star className="text-primary w-5 h-5" />
            <span className="text-base">{averageRating > 0 ? averageRating.toFixed(1) : "0.0"}</span>
          </p>
          <p className="relative inline-block text-xs font-normal after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[1.5px] after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 group-hover:after:scale-x-100">
            Đánh giá {totalRatings > 0 && `(${totalRatings})`}
          </p>
        </Button>
      </div>

      {showShare && <ModalShare open={showShare} onOpenChange={setShowShare} />}
    </>
  );
}
