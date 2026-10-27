import { Check } from "lucide-react";

export default function VipBenifitBanner() {
  return (
    <>
      <section className="px-4 my-6">
        <div className="max-w-5xl mx-auto backdrop-blur-xl bg-black/40 border border-primary/30 p-6 rounded-2xl shadow-[0_0_45px_rgba(255,215,0,0.25)]">
          <h2 className="text-primary font-semibold text-center mb-4 text-lg">
            Quyền lợi VIP bao gồm
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {[
              "Tắt toàn bộ quảng cáo",
              "Xem phim chất lượng 4K UHD",
              "Chat không delay - ưu tiên tốc độ",
              "Dùng sticker & GIF cực xịn",
              "Đổi avatar cá nhân không giới hạn",
              "Tên được gắn huy hiệu VIP sáng chói",
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-primary">
                <Check className="w-4 h-4 text-primary" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
