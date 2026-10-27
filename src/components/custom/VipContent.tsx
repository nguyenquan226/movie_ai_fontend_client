"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAppRouter } from "@/hooks/useAppRouter";

export default function VIPContent() {
  const [showModal, setShowModal] = useState(true);
  const { goHome, goUpgradeVip } = useAppRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center text-foreground">
        <h1 className="text-4xl font-bold mb-4">Chào mừng bạn đến Nội Dung Độc Quyền</h1>
        <p className="text-muted-foreground mb-8">Khám phá thư viện nội dung độc quyền của chúng tôi</p>
        <div className="flex items-center justify-center gap-2">
          <button
            className="px-6 py-2 bg-white rounded-lg hover:opacity-90 text-black cursor-pointer"
            onClick={goHome}
          >
            Quay về trang chủ
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-background rounded-lg hover:opacity-90 text-primary cursor-pointer ring ring-transparent hover:ring-amber-400 transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-200"
          >
            Hiện thị thông tin
          </button>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="py-8">
          <DialogHeader>
            <DialogTitle>Truy cập nội dung độc quyền</DialogTitle>
            <h2 className="text-2xl font-bold mb-2 text-primary">Mở khóa nội dung VIP</h2>
            <p className="text-card/90 text-sm">Gia nhập cùng hàng ngàn người dùng VIP khác</p>
          </DialogHeader>
          {/* Content */}
          <div className="px-6">
            <div className="space-y-4 mb-8">
              <p className="text-card-foreground font-semibold">Vui lòng đăng ký VIP để tiếp tục xem nội dung</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Nhận quyền truy cập vào toàn bộ thư viện nội dung độc quyền, các bài viết mới nhất và các tính năng cao
                cấp.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-card text-xs font-bold">✓</span>
                </div>
                <span className="text-sm text-card-foreground">Truy cập không giới hạn vào tất cả nội dung</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-card text-xs font-bold">✓</span>
                </div>
                <span className="text-sm text-card-foreground">Xem trước sớm các bài viết mới</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-card text-xs font-bold">✓</span>
                </div>
                <span className="text-sm text-card-foreground">Không quảng cáo, trải nghiệm sạch</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={goUpgradeVip}
                className="w-full bg-amber-400 text-card font-semibold py-3 rounded-lg hover:bg-background hover:text-primary transition text-balance cursor-pointer"
              >
                Nâng cấp lên VIP ngay
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full border-2 border-border text-card-foreground font-semibold py-3 rounded-lg hover:bg-muted transition cursor-pointer"
              >
                Để sau
              </button>
            </div>

            {/* Footer text */}
            <p className="text-xs text-muted-foreground text-center mt-6">Hủy bất cứ lúc nào. Không cần thẻ tín dụng.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
