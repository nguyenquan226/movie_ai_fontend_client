"use client";

import NotFound from "@/app/not-found";
import { List, ListProps } from "@/components/co_watching/list"
import { useAuthStore } from "@/stores/authStore";
import { ListVideo } from "lucide-react"
import { useEffect, useState } from "react";

const ManagePage = () => {
  const { authUser } = useAuthStore();
  const [query, setQuery] = useState<ListProps['query']>({
    hostId: authUser.userId ?? undefined,
  })

  useEffect(() => {
    if (!authUser || !authUser.userId) return;
    setQuery({
      hostId: authUser.userId,
    })
  }, [authUser]);


  if (!authUser || !authUser.userId) {
    return (
      <NotFound />
    );
  }

  return (
    <div className="lg:pt-40 md:pt-30 pt-20 px-[20px] text-foreground">
      <div className="flex items-center gap-2">
        <ListVideo className="lg:size-6 size-5" />
        <h2 className="lg:text-lg text-sm font-semibold">Quản lý</h2>
      </div>
      <List query={query} />
    </div>
  )
}
export default ManagePage
