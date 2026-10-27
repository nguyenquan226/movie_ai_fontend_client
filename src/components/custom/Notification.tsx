"use client"
import { useAuthStore } from "@/stores/authStore"
import { useState, useEffect } from "react"
import { useNotificationStore } from "@/stores/notificationStore"
import { useRouter } from "next/navigation"
import type { Notification } from "@/types/notification.type"

type TabType = "film" | "community" | "system"

const ITEMS_PER_PAGE = 5

export default function Notications() {
    const [activeTab, setActiveTab] = useState<TabType>("community")
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
    const { authUser } = useAuthStore()
    const router = useRouter()

    const {
        notifications,
        fetchNotifications,
        markAllAsRead,
        markAsRead,
        isLoading,
    } = useNotificationStore()

    useEffect(() => {
        fetchNotifications(1, 20)
    }, [fetchNotifications])

    const filmNotifications = notifications.filter((n) => n.type === "system")
    const communityNotifications = notifications.filter((n) => n.type === "reply" || n.type === "reaction")
    const systemNotifications = notifications.filter((n) =>
        n.type === "warning" || n.type === "violation_warning" || n.type === "info" || n.type === "hidden_comment" || n.type === "report" || n.type === "report_result"
    )
    const allCurrentNotifications = activeTab === "film" ? filmNotifications : activeTab === "community" ? communityNotifications : systemNotifications
    const currentNotifications = allCurrentNotifications.slice(0, visibleCount)
    const hasMoreLocal = visibleCount < allCurrentNotifications.length

    const getNotificationIcon = (notification: Notification) => {
        if (notification.type === 'reply') return 'fas fa-comment text-foreground'
        if (notification.type === 'reaction') {
            return notification.result?.reactionType === 'DISLIKE' ? 'fas fa-thumbs-down text-red-500' : 'fas fa-thumbs-up text-primary'
        }
        if (notification.type === 'warning' || notification.type === 'violation_warning') return 'fas fa-exclamation-triangle text-orange-500'
        if (notification.type === 'hidden_comment') return 'fas fa-eye-slash text-red-500'
        if (notification.type === 'info') return 'fas fa-check-circle text-green-500'
        if (notification.type === 'report') return 'fas fa-flag text-red-500'
        if (notification.type === 'report_result') return 'fas fa-clipboard-check text-blue-500'
        return 'fas fa-info-circle text-primary'
    }

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
    }


    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab)
        setVisibleCount(ITEMS_PER_PAGE)
    }
    const scrollToComment = (commentId: string) => {
        const commentElement = document.getElementById(`comment-${commentId}`)
        if (!commentElement) return
        const elementPosition = commentElement.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - 100
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
        setTimeout(() => {
            const contentDiv = commentElement.querySelector(':scope > .flex.items-start') as HTMLElement
            const target = contentDiv || commentElement
            target.classList.add('highlight-comment')
            setTimeout(() => target.classList.remove('highlight-comment'), 2800)
        }, 800)
    }

    const navigateToFilm = async (slug: string | undefined, filmId: string, commentId: string) => {
        if (slug) {
            router.push(`/film-detail/${slug}?commentId=${commentId}`)
            return
        }

        try {
            const filmServices = (await import('@/services/filmService')).default
            const filmData = await filmServices.getFilmById(String(filmId))
            const fetchedSlug = filmData?.data?.film?.slug
            if (fetchedSlug) {
                router.push(`/film-detail/${fetchedSlug}?commentId=${commentId}`)
            }
        } catch (error) {
            console.error('Failed to fetch film slug:', error)
        }
    }

    const handleNotificationClick = async (notification: Notification) => {
        try {
            if (!notification.isRead) {
                await markAsRead(notification.notificationId)
            }

            if (notification.type === 'warning' || notification.type === 'violation_warning' || notification.type === 'info' || notification.type === 'hidden_comment' || notification.type === 'report' || notification.type === 'report_result') {
                if (notification.result?.filmId && notification.result?.slug) {
                    router.push(`/film-detail/${notification.result.slug}`)
                }
                return
            }

            if (!notification.result?.filmId) return

            const commentId = notification.result.commentId || notification.result.parentId
            if (!commentId) return
            const currentPath = window.location.pathname
            const isOnSameFilm = notification.result?.slug && currentPath.includes(`/film-detail/${notification.result.slug}`)

            if (isOnSameFilm) {
                setTimeout(() => scrollToComment(commentId), 100)
            } else {
                await navigateToFilm(notification.result?.slug, notification.result.filmId, commentId)
            }
        } catch (error) {
            console.error("Failed to handle notification click:", error)
        }
    }

    const CheckAvatar = (notification: Notification) => {
        if (notification.replier && notification.replier.avatarUrl) {
            return notification.replier.avatarUrl;
        }
        if (notification.avatarUrl) {
            return notification.avatarUrl;
        }
        if (authUser?.userId === notification.userId) {
            return authUser.avatarUrl || "/images/small.png";
        }
        return "/images/small.png";
    }
    const hasAnyNotifications = notifications.length > 0

    if (isLoading && !hasAnyNotifications) {
        return (
            <div className="flex-1">
                <div className="rounded-lg bg-[#23262f] p-8">
                    <div className="text-center">
                        <p className="text-lg text-muted-foreground">Đang tải thông báo...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!hasAnyNotifications) {
        return (
            <div className="flex-1">
                <div className="rounded-lg bg-[#23262f] p-8">
                    <div className="text-center">
                        <p className="text-lg text-muted-foreground">Chưa có thông báo nào</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1">
            <div className="overflow-hidden rounded-lg bg-[#23262f]">
                {/* Header with Tabs */}
                <div className="border-b border-gray-700">
                    <div className="flex items-center justify-between px-4 pt-4 pb-0">
                        <h3 className="mb-4 text-xl font-semibold text-foreground">Thông báo</h3>
                        <button
                            onClick={() => markAllAsRead()}
                            className="mb-4 flex items-center gap-2 rounded-md bg-gray-700 px-4 py-1.5 text-sm text-foreground transition-colors hover:bg-gray-600"
                        >
                            <i className="fas fa-check" />
                            Đánh dấu đã đọc
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-border space-x-6 px-4">
                        <button
                            onClick={() => handleTabChange("film")}
                            className={`relative pb-2 font-semibold cursor-pointer transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-500 ease-in-out ${activeTab === "film" ? "text-primary" : "text-foreground hover:text-primary"
                                }`}
                        >
                            Phim ({filmNotifications.length})
                            <span
                                className={`absolute left-0 bottom-0 h-[2px] bg-primary transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-500 ease-in-out ${activeTab === "film" ? "w-full" : "w-0"
                                    }`}
                            />
                        </button>
                        <button
                            onClick={() => handleTabChange("community")}
                            className={`relative pb-2 font-semibold cursor-pointer transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-500 ease-in-out ${activeTab === "community" ? "text-primary" : "text-foreground hover:text-primary"
                                }`}
                        >
                            Cộng đồng ({communityNotifications.length})
                            <span
                                className={`absolute left-0 bottom-0 h-[2px] bg-primary transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-500 ease-in-out ${activeTab === "community" ? "w-full" : "w-0"
                                    }`}
                            />
                        </button>
                        <button
                            onClick={() => handleTabChange("system")}
                            className={`relative pb-2 font-semibold cursor-pointer transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-500 ease-in-out ${activeTab === "system" ? "text-primary" : "text-foreground hover:text-primary"
                                }`}
                        >
                            Hệ thống ({systemNotifications.length})
                            <span
                                className={`absolute left-0 bottom-0 h-[2px] bg-primary transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-500 ease-in-out ${activeTab === "system" ? "w-full" : "w-0"
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Notification List */}
                <div className="p-4">
                    {isLoading && currentNotifications.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-sm text-muted-foreground">Đang tải thông báo...</p>
                        </div>
                    ) : currentNotifications.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-sm text-muted-foreground">
                                {activeTab === "film"
                                    ? "Không có thông báo phim nào"
                                    : activeTab === "community"
                                        ? "Không có thông báo cộng đồng nào"
                                        : "Không có thông báo hệ thống nào"}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {currentNotifications.map((notification) => (
                                    <div
                                        key={notification.notificationId}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`flex cursor-pointer gap-3 rounded-lg p-3 transition-colors ${!notification.isRead
                                            ? "bg-[#2c2f3a] hover:bg-[#3d4251] "
                                            : "bg-[#353947] hover:bg-[#3d4251]"
                                            }`}
                                    >
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-600">
                                                <img
                                                    src={CheckAvatar(notification)}
                                                    alt="User Avatar"
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0 flex-1 ">
                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                <i className={`mr-2 ${getNotificationIcon(notification)}`} />
                                                {notification.message}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground/70">
                                                {new Date(notification.createdAt).toLocaleString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Load More */}
                            {hasMoreLocal && (
                                <div className="mt-6 text-center">
                                    <button
                                        onClick={handleLoadMore}
                                        className="cursor-pointer text-sm text-primary hover:text-primary transition-colors"
                                    >
                                        Tải thêm...
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
