"use client"

import Link from "next/link"
import { useAuthStore } from "@/stores/authStore"
import { User, Heart, List, Clock, Bell, LogOut } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

interface PlaylistSidebarProps {
  userName?: string
  userEmail?: string
}

export default function PlaylistSidebar({ userName, userEmail }: PlaylistSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { authUser } = useAuthStore()

  const menuItems = [
    { id: "favorites", label: "Yêu thích", icon: Heart, href: "/user/favorites" },
    { id: "playlists", label: "Danh sách", icon: List, href: "/user/playlists" },
    { id: "continue-watching", label: "Xem tiếp", icon: Clock, href: "/user/continue-watching" },
    { id: "notifications", label: "Thông báo", icon: Bell, href: "/user/notifications" },
    { id: "account", label: "Tài khoản", icon: User, href: "/user/profile" },
  ]

  const activeTab = pathname.split("/").pop() || "profile"

  const handleLogout = () => {
    localStorage.clear()
    router.push("/")
  }

  return (
    <aside className="flex w-full shrink-0 flex-col rounded-2xl border border-border bg-card p-4 text-card-foreground sm:p-6 lg:w-72">
      <nav aria-label="Tài khoản" className="flex-1 space-y-1">
        <h2 className="mb-4 px-3 text-base font-semibold text-foreground">Quản lý tài khoản</h2>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id || (item.id === "account" && activeTab === "profile")

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon aria-hidden="true" size={18} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-6 border-t border-border pt-5">
        <div className="mb-4 flex min-w-0 items-center gap-3">
          <img
            src={authUser?.avatarUrl || "/images/vn_flag.svg"}
            alt=""
            className="h-11 w-11 shrink-0 rounded-full border border-border object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{userName || authUser?.fullName || "Tài khoản"}</p>
            <p className="truncate text-xs text-muted-foreground">{userEmail || authUser?.email || ""}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <LogOut aria-hidden="true" size={18} />
          <span>Thoát</span>
        </button>
      </div>
    </aside>
  )
}
