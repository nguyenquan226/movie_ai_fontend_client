"use client";

import { NotAuthContent } from "@/components/custom/notAuthContent";
import { useAuthStore } from "@/stores/authStore";

interface Co_WatchingLayoutProps {
  children: React.ReactNode,
}

const Co_WatchingLayout = ({ children }: Co_WatchingLayoutProps) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <NotAuthContent />
    )
  }

  return (
    <div>
      {children}
    </div>
  )
}
export default Co_WatchingLayout
