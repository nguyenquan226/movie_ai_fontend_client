"use client";

import { useAppRouter } from "@/hooks/useAppRouter";
import { House } from "lucide-react";

export const NotAuthContent = () => {
  const { goHome } = useAppRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">

      <div className="text-center text-foreground">
        <h1 className="text-4xl font-bold mb-4 text-primary">Bạn không có quyền truy cập</h1>
        <p className="text-muted-foreground mb-8">Vui lòng đăng nhập/đăng ký tài khoản để tận hưởng những dịch vụ thú vị của chúng tôi</p>
        <div className="flex items-center justify-center gap-2">
          <button
            className="px-6 py-2 bg-white rounded-lg hover:opacity-90 text-black cursor-pointer flex items-center"
            onClick={goHome}
          >
            <House size={22} className="mr-2" />
            <span className="font-semibold">
              Quay về trang chủ
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
