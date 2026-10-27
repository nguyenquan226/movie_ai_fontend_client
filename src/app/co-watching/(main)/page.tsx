"use client";

import { List, ListProps } from "@/components/co_watching/list"
import { useAuthStore } from "@/stores/authStore"
import { ListVideo } from "lucide-react"

const Co_WatchingPage = () => {
  const { authUser, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="pt-40 px-[20px] text-foreground">
        <div className="flex items-center gap-2">
          <ListVideo className="size-8" />
          <h2 className="lg:text-xl text-sm font-semibold">Danh sách xem chung</h2>
        </div>
        <div className="flex items-center justify-center h-[calc(50vh-100px)]">
          <div className="text-primary">Đang tải lên tất cả phòng live...</div>
        </div>
      </div>
    )
  }

  const query: ListProps['query'] = {
    isLive: true,
    hostId: authUser.userId ?? undefined,
    isMain: true,
  }

  return (
    <div className="lg:pt-40 md:pt-30 pt-20 px-[20px] text-foreground">
      <div className="flex items-center gap-2">
        <ListVideo className="lg:size-6 size-5" />
        <h2 className="lg:text-lg text-sm font-semibold">Danh sách xem chung</h2>
      </div>
      <List query={query} />
    </div>
  )
}

export default Co_WatchingPage
