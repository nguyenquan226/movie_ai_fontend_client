"use client";

import {
  Search,
  Bell,
  ChevronDown,
  Heart,
  Plus,
  CircleUserRound,
  RotateCw,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { allCodeServie, authService } from "@/services";
import type { AllCodeRow } from "@/types/allcode.type";
import { IBackendRes } from "@/types/backend.type";
import { FilmDetailRes } from "@/types/film.type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import { toast } from "sonner";
import { useAppRouter } from "@/hooks/useAppRouter";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useAuthModalStore } from "@/stores/authModalStore";
import { AuthenticationsMessage } from "@/constants/messages/user.message";
import { useChatDrawerStore } from "@/stores/chatDrawerStore";
import { socket } from "@/lib/socket";
import { useCommentStore } from "@/stores/comentStore";
import { useRatingStore } from "@/stores/ratingStore";
import SearchDropdown from "./header/search-dropdown";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useNotificationStore } from "@/stores/notificationStore";
import {
  NewCommentData,
  ReplyCommentData,
  ReplyNotificationData,
  ReactionNotificationData,
  DeleteCommentData,
  CountCommentsData,
} from "@/types/socket.type";

export default function Header() {
  const [genresList, setGenresList] = useState<AllCodeRow[]>([]);
  const [countriesList, setCountriesList] = useState<AllCodeRow[]>([]);
  const [activeTab, setActiveTab] = useState("film");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { openLoginModal } = useAuthModalStore();

  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [showAllReadNotifications, setShowAllReadNotifications] =
    useState(false);

  const {
    goHome,
    goProfile,
    goPlaylist,
    goFavorite,
    goUpgradeVip,
    goSingleFilms,
    goSeriesFilms,
    goGenre,
    goCountry,
    goMostViewed,
    goLatestUpdate,
    goCoWatching,
    goFilmVip,
  } = useAppRouter();
  const { openDrawer } = useChatDrawerStore();

  const { logOutAction, isAuthenticated, isLoading, authUser } = useAuthStore();

  const {
    removeCommentRealtime,
    createCommentRealtime,
    replyCommentRealtime,
    countCommentsRealtime,
    reactCommentRealtime,
    hideCommentRealtime,
    unhideCommentRealtime,
  } = useCommentStore();

  const { hideRatingRealtime } = useRatingStore();

  const {
    notifications,
    unreadCount,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    deleteNotification,
    reset: resetNotifications,
  } = useNotificationStore();

  useEffect(() => {
    fetchGenresList();
    fetchCountriesList();
  }, []);

  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const fetchData = async () => {
      if (authUser?.userId) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        await Promise.all([fetchNotifications(1, 20), fetchUnreadCount()]);
      } else {
        resetNotifications();
      }
    };

    fetchData();
  }, [
    authUser?.userId,
    isAuthenticated,
    fetchNotifications,
    fetchUnreadCount,
    resetNotifications,
  ]);

  useEffect(() => {
    const userId = authUser?.userId;
    if (userId) {
      socket.emit("register", { userId });
    }
  }, [authUser?.userId]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchGenresList = async () => {
    const res = await allCodeServie.getGenresList();
    if (res && res.EC === 1) {
      setGenresList(res.data?.GENRE || []);
    } else {
      setGenresList([]);
    }
  };

  const fetchCountriesList = async () => {
    const res = await allCodeServie.getCountriesList();
    if (res && res.EC === 1) {
      setCountriesList(res.data?.COUNTRY || []);
    } else {
      setCountriesList([]);
    }
  };

  const haneleLogOut = async () => {
    try {
      const res = await authService.callLogout();

      if (res && res.EC === 1) {
        goHome();
        toast.success(AuthenticationsMessage.logoutSucess);
        logOutAction();
      }
    } catch (_error) {
      toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  const refreshNotifications = async () => {
    await Promise.all([fetchNotifications(1, 20), fetchUnreadCount()]);
  };

  useEffect(() => {
    const handleConnect = () => {
      if (authUser?.userId) {
        socket.emit("register", { userId: authUser.userId });
      }
    };

    const handleNewComment = (data: NewCommentData) => {
      if (data.user?.userId === authUser?.userId || data?.parent) return;
      createCommentRealtime(data);
    };

    const handleReplyComment = (data: ReplyCommentData) => {
      if (data.replyComment?.user?.userId === authUser?.userId) return;
      replyCommentRealtime({
        parentId: data.parentId,
        comment: data.replyComment,
      });
    };

    const handleReplyNotification = async (data: ReplyNotificationData) => {
      if (!authUser || String(data.targetUserId) !== String(authUser.userId)) {
        return;
      }

      const message = `${data.replyComment.user.fullName} đã trả lời bình luận của bạn: "${data.replyComment.content}"`;

      await refreshNotifications();
      toast.success(message);
    };

    const handleReactionNotification = async (
      data: ReactionNotificationData
    ) => {
      if (!authUser || String(data.targetUserId) !== String(authUser.userId)) {
        return;
      }

      const reactionText =
        data.reactionType === "LIKE" ? "thích" : "không thích";
      const message = `${data.reactionUser.fullName} đã ${reactionText} bình luận của bạn`;

      await refreshNotifications();
      toast.success(message);
    };

    const handleDeleteComment = ({ commentId }: DeleteCommentData) => {
      removeCommentRealtime(commentId);
    };

    const handleCountComments = ({ filmId, total }: CountCommentsData) => {
      countCommentsRealtime(filmId, total);
    };

    socket.on("connect", handleConnect);
    socket.on("newComment", handleNewComment);
    socket.on("replyComment", handleReplyComment);
    socket.on("replyNotification", handleReplyNotification);
    socket.on("reactionNotification", handleReactionNotification);
    socket.on("deleteComment", handleDeleteComment);
    socket.on("countComments", handleCountComments);
    socket.on("reactComment", reactCommentRealtime);
    socket.on("hideComment", ({ commentId, isHidden }) => {
      hideCommentRealtime(commentId, isHidden);
    });
    socket.on("unhideComment", (comment) => {
      unhideCommentRealtime(comment);
    });
    socket.on("hiddenCommentNotification", async (data) => {
      toast.warning(data.message);
      await refreshNotifications();
    });
    socket.on("warningNotification", async (data) => {
      toast.warning(data.message, {
        duration: 5000,
      });
      await refreshNotifications();
    });
    socket.on("infoNotification", async (data) => {
      toast.success(data.message, {
        duration: 5000,
      });
      await refreshNotifications();
    });
    socket.on("hideRating", ({ ratingId, isHidden, filmId }) => {
      hideRatingRealtime(ratingId, isHidden, filmId);
    });
    return () => {
      socket.off("connect", handleConnect);
      socket.off("newComment", handleNewComment);
      socket.off("replyComment", handleReplyComment);
      socket.off("replyNotification", handleReplyNotification);
      socket.off("reactionNotification", handleReactionNotification);
      socket.off("deleteComment", handleDeleteComment);
      socket.off("countComments", handleCountComments);
      socket.off("reactComment", reactCommentRealtime);
      socket.off("hideComment");
      socket.off("unhideComment");
      socket.off("hiddenCommentNotification");
      socket.off("warningNotification");
      socket.off("infoNotification");
      socket.off("hideRating");
    };
  }, [
    authUser?.userId,
    createCommentRealtime,
    replyCommentRealtime,
    removeCommentRealtime,
    countCommentsRealtime,
    reactCommentRealtime,
    hideCommentRealtime,
    unhideCommentRealtime,
    hideRatingRealtime,
    refreshNotifications,
  ]);

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
    <header
      className={`
    fixed top-0 left-0 w-full z-99999999 transition-[background-color,backdrop-filter] duration-300 ease-in-out
    ${isScrolled
          ? "bg-background/90 backdrop-blur-md"
          : "bg-gradient-to-b from-background/90 via-background/50 to-transparent"
        }
  `}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 md:gap-4 lg:gap-6">
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
              className={`lg:hidden text-muted-foreground hover:text-primary ${isScrolled ? "hover:bg-secondary" : "hover:bg-transparent"
                } transition p-2 rounded-md`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>

          <button
            type="button"
            onClick={goHome}
            aria-label="ChillFlix - về trang chủ"
            className="flex flex-shrink-0 items-center gap-2 rounded-md text-left"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary md:h-10 md:w-10">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background md:h-8 md:w-8">
                <span aria-hidden="true" className="text-primary font-bold text-base md:text-lg">
                  ▶
                </span>
              </span>
            </span>
            <span className="hidden sm:block">
              <span className="text-foreground font-bold text-base md:text-lg">
                ChillFlix
              </span>
            </span>
          </button>

          <SearchDropdown isScrolled={isScrolled} />

          <nav aria-label="Điều hướng chính" className="hidden lg:flex items-center gap-0">
            <button
              className={`text-muted-foreground hover:text-primary ${isScrolled ? "hover:bg-secondary" : "hover:bg-transparent"
                } transition bg-transparent border-none cursor-pointer px-3 py-2 rounded-md`}
              onClick={() => {
                goSingleFilms();
              }}
            >
              Phim Lẻ
            </button>
            <button
              className={`text-muted-foreground hover:text-primary ${isScrolled ? "hover:bg-secondary" : "hover:bg-transparent"
                } transition bg-transparent border-none cursor-pointer px-3 py-2 rounded-md`}
              onClick={() => {
                goSeriesFilms();
              }}
            >
              Phim Bộ
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1 text-foreground hover:text-primary ${isScrolled ? "hover:bg-secondary" : "hover:bg-transparent"
                    } transition px-3 py-2 rounded-md cursor-pointer focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none`}
                >
                  Thể loại
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="bg-popover/95 backdrop-blur-md border border-border/70
                  w-max p-4 rounded-xl shadow-lg
                  transition-colors duration-300 ease-out
                  transform origin-top scale-95 opacity-0
                  data-[state=open]:scale-100 data-[state=open]:opacity-100"
              >
                <div className="flex flex-col flex-wrap gap-x-0 max-h-[592px] overflow-hidden">
                  {genresList.map((genre, index) => (
                    <button
                      key={`${index}-${genre.id}`}
                      className="text-muted-foreground hover:text-primary transition text-sm whitespace-nowrap cursor-pointer text-left
                        w-[140px] h-[40px] px-3 py-[3px] rounded-md hover:bg-accent text-[13px] overflow-hidden"
                      onClick={() => {
                        goGenre(genre.valueEn as string);
                      }}
                    >
                      {genre.valueVi}
                    </button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1 text-muted-foreground hover:text-primary ${isScrolled ? "hover:bg-secondary" : "hover:bg-transparent"
                    } transition px-3 py-2 rounded-md cursor-pointer focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none`}
                >
                  Quốc gia
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="bg-popover/95 backdrop-blur-md border border-border/70
                  w-max p-4 rounded-xl shadow-lg
                  transition-colors duration-300 ease-out
                  transform origin-top scale-95 opacity-0
                  data-[state=open]:scale-100 data-[state=open]:opacity-100"
              >
                <div className="flex flex-col flex-wrap gap-x-0 max-h-[592px] overflow-hidden">
                  {countriesList.map((country, index) => (
                    <button
                      key={`${index}-${country.id}`}
                      className="text-muted-foreground hover:text-primary transition text-sm whitespace-nowrap cursor-pointer text-left
                        w-[140px] h-[40px] px-3 py-[3px] rounded-md hover:bg-accent text-[13px] overflow-hidden"
                      onClick={() => {
                        goCountry(country.valueEn as string);
                      }}
                    >
                      {country.valueVi}
                    </button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              className={`text-muted-foreground hover:text-primary ${isScrolled ? "hover:bg-secondary" : "hover:bg-transparent"
                } transition bg-transparent border-none cursor-pointer px-3 py-2 rounded-md`}
              onClick={goCoWatching}
            >
              Xem Chung
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1 text-muted-foreground hover:text-primary ${isScrolled ? "hover:bg-secondary" : "hover:bg-transparent"
                    } transition px-3 py-2 rounded-md cursor-pointer focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none`}
                >
                  Thêm
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="bg-popover/95 backdrop-blur-md border border-border/70
                  w-max p-4 rounded-xl shadow-lg
                  transition-colors duration-300 ease-out
                  transform origin-top scale-95 opacity-0
                  data-[state=open]:scale-100 data-[state=open]:opacity-100"
              >
                <div className="flex  flex-col flex-wrap gap-x-0  max-h-[592px] overflow-hidden">
                  <button
                    className="text-muted-foreground hover:text-primary transition text-sm whitespace-nowrap cursor-pointer text-left
                       w-[140px] h-[40px] px-3 py-[3px]  rounded-md hover:bg-accent text-[13px] overflow-hidden"
                    onClick={() => {
                      goLatestUpdate();
                    }}
                  >
                    Mới cập nhật
                  </button>
                  <button
                    className="text-muted-foreground hover:text-primary transition text-sm whitespace-nowrap cursor-pointer text-left
                       w-[140px] h-[40px] px-3 py-[3px]  rounded-md hover:bg-accent text-[13px] overflow-hidden"
                    onClick={() => {
                      goMostViewed();
                    }}
                  >
                    Phổ biến
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              className={`text-muted-foreground hover:text-primary ${isScrolled ? "hover:bg-secondary" : "hover:bg-transparent"
                } transition bg-transparent border-none cursor-pointer px-3 py-2 rounded-md`}
              onClick={goFilmVip}
            >
              Phim VIP
            </button>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={openDrawer}
              className={`hidden md:flex items-center gap-2 text-[16px] text-muted-foreground hover:text-primary ${isScrolled ? "hover:bg-secondary" : "hover:bg-transparent"
                } cursor-pointer bg-transparent border-none transition px-3 py-2 rounded-md`}
            >
              <span>Chat với FlixAI</span>
            </button>

            <DropdownMenu
              onOpenChange={(open) => {
                if (!open) {
                  setShowAllNotifications(false);
                  setShowAllReadNotifications(false);
                }
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`text-muted-foreground hover:text-primary ${isScrolled ? "hover:bg-secondary" : "hover:bg-transparent"
                    } relative cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none`}
                >
                  <Bell className="w-8 h-8" strokeWidth={2.6} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-foreground">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="bg-popover/95 backdrop-blur-md text-muted-foreground border border-border/70
                  rounded-2xl w-80 p-0 shadow-xl overflow-hidden mt-2
                  transition-colors duration-300 ease-out
                  transform origin-top-right scale-95 opacity-0
                  data-[state=open]:scale-100 data-[state=open]:opacity-100"
              >
                <Tabs
                  value={activeTab}
                  onValueChange={(value) => {
                    setActiveTab(value);
                    setShowAllNotifications(false);
                    setShowAllReadNotifications(false);
                  }}
                >
                  <div className="relative overflow-hidden border-b border-border">
                    <TabsList className="relative flex w-full justify-start bg-transparent text-sm font-medium">
                      {["film", "community", "read"].map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                          <TabsTrigger
                            key={tab}
                            value={tab}
                            className={`relative flex-1 cursor-pointer rounded-none py-2 transition-colors duration-300 data-[state=active]:bg-transparent data-[state=active]:text-primary
                              ${isActive
                                ? "text-primary font-semibold scale-[1.03]"
                                : "text-muted-foreground hover:text-primary"
                              }`}
                          >
                            {tab === "film" && "Phim"}
                            {tab === "community" && "Cộng đồng"}
                            {tab === "read" && "Đã đọc"}

                            <span
                              className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-primary transition-colors duration-300 ${isActive
                                ? "w-full opacity-100"
                                : "w-0 opacity-0"
                                }`}
                            />
                            {tab === "community" && unreadCount > 0 && (
                              <span className="absolute top-3 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                            )}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                  </div>

                  <TabsContent
                    value="film"
                    className="p-4 text-center text-sm text-muted-foreground"
                  >
                    Không có thông báo phim nào
                  </TabsContent>

                  <TabsContent
                    value="community"
                    className={`p-4 text-left text-sm text-muted-foreground ${showAllNotifications
                      ? "max-h-[500px] overflow-y-auto"
                      : ""
                      }`}
                  >
                    {notifications.filter((n) => !n.isRead).length === 0 ? (
                      <div className="text-center text-muted-foreground/70">
                        Không có thông báo chưa đọc
                      </div>
                    ) : (
                      <>
                        <ul className="space-y-3">
                          {notifications
                            .filter((n) => !n.isRead)
                            .slice(0, showAllNotifications ? undefined : 3)
                            .map((n) => (
                              <li
                                key={n.notificationId}
                                className="cursor-pointer rounded-lg border border-border/70 bg-secondary/80 p-3 transition-colors hover:bg-accent/80"
                                onClick={async () => {
                                  try {
                                    if (n.notificationId > 0 && !n.isRead) {
                                      await markAsRead(n.notificationId);
                                      refreshNotifications();
                                    }
                                    if (!n.result?.filmId && !n.result?.slug)
                                      return;

                                    const isHiddenType = [
                                      "hidden_comment",
                                      "violation_warning",
                                    ].includes(n.type);
                                    const commentId = isHiddenType
                                      ? null
                                      : n.result.commentId || n.result.parentId;

                                    const currentPath =
                                      window.location.pathname;
                                    const isOnSameFilm =
                                      n.result?.slug &&
                                      (currentPath.includes(
                                        `/film-detail/${n.result.slug}`
                                      ) ||
                                        currentPath.includes(
                                          `/play/${n.result.slug}`
                                        ));
                                    if (isOnSameFilm) {
                                      const { eventBus } = await import(
                                        "@/lib/eventBus"
                                      );
                                      eventBus.emit("switchTab", "comments");

                                      if (commentId) {
                                        const url = new URL(
                                          window.location.href
                                        );
                                        url.searchParams.set(
                                          "commentId",
                                          String(commentId)
                                        );
                                        url.searchParams.set(
                                          "t",
                                          Date.now().toString()
                                        );
                                        window.history.replaceState(
                                          null,
                                          "",
                                          url.toString()
                                        );
                                      }
                                      return;
                                    }
                                    if (n.result?.slug) {
                                      if (commentId) {
                                        router.push(
                                          `/film-detail/${n.result.slug
                                          }?commentId=${commentId}&t=${Date.now()}`
                                        );
                                      } else {
                                        router.push(
                                          `/film-detail/${n.result.slug}`
                                        );
                                      }
                                    } else {
                                      try {
                                        const filmServices = (
                                          await import("@/services/filmService")
                                        ).default;
                                        const filmData =
                                          (await filmServices.getFilmById(
                                            String(n.result.filmId)
                                          )) as IBackendRes<FilmDetailRes>;
                                        const slug =
                                          filmData?.data?.film?.slug ||
                                          filmData?.data?.film.slug;
                                        if (filmData?.EC === 1 && slug) {
                                          if (commentId) {
                                            router.push(
                                              `/film-detail/${slug}?commentId=${commentId}&t=${Date.now()}`
                                            );
                                          } else {
                                            router.push(`/film-detail/${slug}`);
                                          }
                                        } else {
                                          toast.error(
                                            "Không tìm thấy thông tin. Vui lòng thử lại sau."
                                          );
                                        }
                                      } catch {
                                        toast.error(
                                          "Không thể tải thông tin phim. Vui lòng thử lại sau."
                                        );
                                      }
                                    }
                                  } catch {
                                    toast.error(
                                      "Không thể xử lý thông báo. Vui lòng thử lại."
                                    );
                                  }
                                }}
                              >
                                <div className="flex items-start gap-2">
                                  <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />
                                  <div className="min-w-0 flex-1">
                                    <div className="whitespace-normal break-words text-[13px]">
                                      {n.message}
                                    </div>
                                    <div className="mt-1 text-xs text-muted-foreground/70">
                                      {new Date(n.createdAt).toLocaleTimeString(
                                        "vi-VN"
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (n.notificationId > 0) {
                                        deleteNotification(
                                          n.notificationId
                                        ).catch(() => {
                                          toast.error(
                                            "Không thể xóa thông báo. Vui lòng thử lại."
                                          );
                                        });
                                      }
                                    }}
                                    className="flex-shrink-0 p-1 text-muted-foreground transition-colors hover:text-red-400"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </li>
                            ))}
                        </ul>
                        {notifications.filter((n) => !n.isRead).length > 3 && (
                          <button
                            onClick={() =>
                              setShowAllNotifications(!showAllNotifications)
                            }
                            className="mt-3 w-full py-2 text-center text-sm font-medium text-primary transition-colors hover:text-primary"
                          >
                            {showAllNotifications
                              ? "Thu gọn"
                              : `Xem tất cả (${notifications.filter((n) => !n.isRead).length
                              } thông báo)`}
                          </button>
                        )}
                      </>
                    )}
                  </TabsContent>

                  <TabsContent
                    value="read"
                    className={`p-4 text-left text-sm text-muted-foreground ${showAllReadNotifications
                      ? "max-h-[500px] overflow-y-auto"
                      : ""
                      }`}
                  >
                    {notifications.filter((n) => n.isRead).length === 0 ? (
                      <div className="text-center text-muted-foreground/70">
                        Chưa có thông báo đã đọc
                      </div>
                    ) : (
                      <>
                        <ul className="space-y-3">
                          {notifications
                            .filter((n) => n.isRead)
                            .slice(0, showAllReadNotifications ? undefined : 3)
                            .map((n) => (
                              <li
                                key={n.notificationId}
                                className="cursor-pointer rounded-lg border border-border/70 bg-secondary/80 p-3 opacity-70 transition-colors hover:bg-accent/80"
                                onClick={async () => {
                                  if (!n.result?.filmId) return;

                                  const isHiddenType = [
                                    "hidden_comment",
                                    "violation_warning",
                                  ].includes(n.type);
                                  const commentId = isHiddenType
                                    ? null
                                    : n.result.commentId || n.result.parentId;
                                  const currentPath = window.location.pathname;
                                  const isOnSameFilm =
                                    n.result?.slug &&
                                    (currentPath.includes(
                                      `/film-detail/${n.result.slug}`
                                    ) ||
                                      currentPath.includes(
                                        `/play/${n.result.slug}`
                                      ));

                                  if (isOnSameFilm) {
                                    const { eventBus } = await import(
                                      "@/lib/eventBus"
                                    );
                                    eventBus.emit("switchTab", "comments");
                                    if (commentId) {
                                      const url = new URL(window.location.href);
                                      url.searchParams.set(
                                        "commentId",
                                        String(commentId)
                                      );
                                      url.searchParams.set(
                                        "t",
                                        Date.now().toString()
                                      );
                                      window.history.replaceState(
                                        null,
                                        "",
                                        url.toString()
                                      );
                                    }
                                    return;
                                  } else if (n.result?.slug) {
                                    if (commentId) {
                                      router.push(
                                        `/film-detail/${n.result.slug
                                        }?commentId=${commentId}&t=${Date.now()}`
                                      );
                                    } else {
                                      router.push(
                                        `/film-detail/${n.result.slug}`
                                      );
                                    }
                                  }
                                }}
                              >
                                <div className="flex items-start gap-2">
                                  <div className="mt-1.5 h-2 w-2 rounded-full" />
                                  <div className="min-w-0 flex-1">
                                    <div className="whitespace-normal break-words text-[13px]">
                                      {n.message}
                                    </div>
                                    <div className="mt-1 text-xs text-muted-foreground/70">
                                      {new Date(n.createdAt).toLocaleTimeString(
                                        "vi-VN"
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (n.notificationId > 0) {
                                        deleteNotification(
                                          n.notificationId
                                        ).catch(() => {
                                          toast.error(
                                            "Không thể xóa thông báo. Vui lòng thử lại."
                                          );
                                        });
                                      }
                                    }}
                                    className="flex-shrink-0 p-1 text-muted-foreground transition-colors hover:text-red-400"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </li>
                            ))}
                        </ul>

                        {notifications.filter((n) => n.isRead).length > 3 && (
                          <button
                            onClick={() =>
                              setShowAllReadNotifications(
                                !showAllReadNotifications
                              )
                            }
                            className="mt-3 w-full py-2 text-center text-sm font-medium text-primary transition-colors hover:text-primary"
                          >
                            {showAllReadNotifications
                              ? "Thu gọn"
                              : `Xem tất cả (${notifications.filter((n) => n.isRead).length
                              } thông báo)`}
                          </button>
                        )}
                      </>
                    )}
                  </TabsContent>
                </Tabs>

                <DropdownMenuSeparator className="bg-accent p-0 m-0" />
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex justify-end">
              {isLoading ? (
                <div className="w-10 h-10 rounded-full bg-accent/80 animate-pulse" />
              ) : (
                <>
                  {!isAuthenticated ? (
                    <button
                      onClick={openLoginModal}
                      className="px-5 py-2.5 rounded-full text-primary-foreground font-semibold text-sm
            bg-primary cursor-pointer"
                    >
                      Thành viên
                    </button>
                  ) : (
                    <DropdownMenu
                      open={isUserMenuOpen}
                      onOpenChange={setIsUserMenuOpen}
                    >
                      <DropdownMenuTrigger asChild>
                        <button className="focus:outline-none focus:ring-0 flex items-center cursor-pointer">
                          <Image
                            src={authUser.avatarUrl || "/images/vn_flag.svg"}
                            alt="User Avatar"
                            width={30}
                            height={30}
                            className="w-10 h-10 rounded-full border-2 border-primary/50"
                          />
                        </button>
                      </DropdownMenuTrigger>
                      {/* menu content */}
                      <DropdownMenuContent
                        align="end"
                        className="bg-popover/95 backdrop-blur-md border border-border/70
                        w-64 md:w-64 p-0 rounded-2xl shadow-xl overflow-hidden mt-2
                        transition-colors duration-300 ease-out
                        transform origin-top-right scale-95 opacity-0
                        data-[state=open]:scale-100 data-[state=open]:opacity-100"
                      >
                        {/* User Info Section */}
                        <div className="p-4 border-b border-border/70">
                          <div className="flex items-center gap-3 mb-3">
                            <Image
                              src={authUser.avatarUrl || "/images/vn_flag.svg"}
                              alt="User Avatar"
                              width={30}
                              height={30}
                              className="w-8 h-8 rounded-full flex-shrink-0 cursor-pointer hover:scale-105 transition-transform object-cover border-2 border-primary/50"
                            />
                            <div>
                              <h3 className="text-foreground font-semibold flex items-center gap-1">
                                {authUser.fullName}
                              </h3>
                              <p className="text-muted-foreground text-xs">
                                {isAuthenticated && authUser.isVip
                                  ? "Bạn đang là thành viên VIP"
                                  : " Nâng cấp tài khoản ChillFlix để có trải nghiệm đẳng cấp hơn."}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              goUpgradeVip();
                            }}
                            className="w-full rounded-lg bg-primary py-2 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
                          >
                            {isAuthenticated && authUser.isVip
                              ? "Xem thông tin VIP"
                              : "Nâng cấp ngay"}
                          </button>
                        </div>
                        <div className="py-2">
                          <button
                            onClick={goFavorite}
                            className="w-full cursor-pointer flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-primary hover:bg-accent/70 transition text-sm"
                          >
                            <span className="text-lg">
                              <Heart />
                            </span>
                            <span>Yêu thích</span>
                          </button>
                          <button
                            onClick={goPlaylist}
                            className="w-full flex cursor-pointer items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-primary hover:bg-accent/70 transition text-sm"
                          >
                            <span className="text-lg">
                              <Plus />
                            </span>
                            <span>Danh sách</span>
                          </button>
                          <button className="w-full cursor-pointer flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-primary hover:bg-accent/70 transition text-sm">
                            <span className="text-lg">
                              <RotateCw />
                            </span>
                            <span>Xem tiếp</span>
                          </button>
                          <button
                            onClick={() => {
                              goProfile();
                            }}
                            className="w-full cursor-pointer flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-primary hover:bg-accent/70 transition text-sm"
                          >
                            <span className="text-lg">
                              <CircleUserRound />
                            </span>
                            <span>Tài khoản</span>
                          </button>
                        </div>
                        <DropdownMenuSeparator className="bg-accent/70 m-0" />
                        <button
                          onClick={() => haneleLogOut()}
                          className="w-full cursor-pointer flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-accent/80 hover:text-primary"
                        >
                          <span className="text-lg">
                            <LogOut />
                          </span>
                          <span>Thoát</span>
                        </button>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

    </header>
      <SheetContent
          id="mobile-navigation"
          side="left"
          className="w-[min(20rem,88vw)] border-border bg-background p-0 text-foreground sm:max-w-sm"
        >
        <SheetTitle className="sr-only">Điều hướng ChillFlix</SheetTitle>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-background rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">▶</span>
                </div>
              </div>
              <h2 className="text-foreground font-bold text-lg">Menu</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav aria-label="Điều hướng di động" className="flex flex-col">
              <button
                className="text-muted-foreground hover:text-primary hover:bg-secondary transition px-6 py-3 text-center"
                onClick={goSingleFilms}
              >
                Phim Lẻ
              </button>
              <button
                className="text-muted-foreground hover:text-primary hover:bg-secondary transition px-6 py-3 text-center"
                onClick={goSeriesFilms}
              >
                Phim Bộ
              </button>

              <div className="border-t border-border my-2" />
              <div className="px-6 py-2">
                <h3 className="text-primary font-semibold text-sm mb-2 text-center">
                  Thể loại
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {genresList.map((genre, index) => (
                    <button
                      key={`${index}-${genre.id}`}
                      className="text-muted-foreground hover:text-primary transition text-sm text-center px-3 py-2 rounded-md hover:bg-secondary"
                      onClick={() => goGenre(genre.valueEn as string)}
                    >
                      {genre.valueVi}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border my-2" />
              <div className="px-6 py-2">
                <h3 className="text-primary font-semibold text-sm mb-2 text-center">
                  Quốc gia
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {countriesList.map((country, index) => (
                    <button
                      key={`${index}-${country.id}`}
                      className="text-muted-foreground hover:text-primary transition text-sm text-center px-3 py-2 rounded-md hover:bg-secondary"
                      onClick={() => goCountry(country.valueEn as string)}
                    >
                      {country.valueVi}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border my-2" />
              <button
                className="text-muted-foreground hover:text-primary hover:bg-secondary transition px-6 py-3 text-center"
                onClick={goCoWatching}
              >
                Xem Chung
              </button>

              <div className="border-t border-border my-2" />
              <button
                className="text-muted-foreground hover:text-primary hover:bg-secondary transition px-6 py-3 text-center"
                onClick={goLatestUpdate}
              >
                Mới cập nhật
              </button>
              <button
                className="text-muted-foreground hover:text-primary hover:bg-secondary transition px-6 py-3 text-center"
                onClick={goMostViewed}
              >
                Phổ biến
              </button>

              <div className="border-t border-border my-2" />
              <button className="text-muted-foreground hover:text-primary hover:bg-secondary transition px-6 py-3 text-center">
                Phim VIP
              </button>

              <div className="border-t border-border my-2" />
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openDrawer();
                }}
                className="text-muted-foreground hover:text-primary hover:bg-secondary transition px-6 py-3 text-center md:hidden"
              >
                Chat với FlixAI
              </button>
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
