import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="relative p-8 rounded-3xl border border-primary/20 bg-gradient-to-br from-black/40 to-yellow-900/10 shadow-xl flex flex-col items-center gap-5">
        <div className="relative flex items-center justify-center">
          <Loader2 className="w-14 h-14 text-primary animate-spin drop-shadow-[0_0_12px_rgba(255,215,0,0.7)]" />
        </div>
        <div className="text-center">
          <p className="text-primary font-bold text-xl tracking-wide drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]">
            Đang chuyển đến trang thanh toán...
          </p>
          <p className="text-primary/80 text-sm mt-1">
            Vui lòng chờ một chút
          </p>
        </div>
      </div>
    </div>
  );
}
