"use client";
import { Check, Calendar, Crown, Zap } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { Button } from "@/components/ui/button";
import type { plan } from "@/types/subcsciptionPlan.type";

type VipPlanDetails = Partial<plan> & {
  vipStartDate?: string;
  vipExpiryDate?: string;
  durationTypeCode?: string;
};

interface VipPlanInfoProps {
  vipPlanUser: VipPlanDetails | undefined;
  onRenew?: () => void;
  onUpgrade?: () => void;
}

export default function VipPlanInfo({
  vipPlanUser,
  onRenew,
  onUpgrade,
}: VipPlanInfoProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDaysRemaining = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = 30;
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
  const isExpired = daysRemaining <= 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary">
          Thông Tin Gói VIP
        </h2>
        <p className="text-muted-foreground text-sm">
          Quản lý và theo dõi gói VIP của bạn
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 h-full">
        {/* Trick: Tạo 1 ô ẩn để đo chiều cao thực của "Gói hiện tại" */}

        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-lg border border-border/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground text-sm">Gói hiện tại</span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {vipPlanUser?.planName || "VIP Premium"}
            </p>
            <p className="text-primary text-sm">
              {vipPlanUser?.planDuration === 9999
                ? "Vĩnh viễn"
                : `${vipPlanUser?.planDuration} ${
                    vipPlanUser?.durationTypeCode || "tháng"
                  }`}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-lg border border-border/70 flex flex-col justify-center">
          <div>
            <span className="text-muted-foreground text-sm">Giá trị gói</span>
            <p className="text-lg font-bold text-primary mt-1">
              {formatPrice(parseInt(vipPlanUser?.price || "0"))} VNĐ
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-lg border border-border/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground text-sm">Ngày kích hoạt</span>
            </div>
            <p className="text-foreground text-sm">
              {vipPlanUser?.vipStartDate
                ? formatDate(vipPlanUser.vipStartDate)
                : "N/A"}
            </p>
          </div>
          <div className="h-4" />
        </div>

        <div
          className={`p-4 rounded-2xl bg-white/5 backdrop-blur-lg border flex flex-col justify-between ${
            isExpired
              ? "border-red-500/50"
              : isExpiringSoon
              ? "border-orange-400/50"
              : "border-border/70"
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar
                className={`w-4 h-4 ${
                  isExpired
                    ? "text-red-500"
                    : isExpiringSoon
                    ? "text-orange-400"
                    : "text-primary"
                }`}
              />
              <span className="text-muted-foreground text-sm">
                {vipPlanUser?.planDuration === 9999
                  ? "Trạng thái"
                  : "Ngày hết hạn"}
              </span>
            </div>

            {vipPlanUser?.planDuration === 9999 ? (
              <p className="text-green-400 font-semibold">Không giới hạn</p>
            ) : (
              <>
                <p
                  className={`text-sm ${
                    isExpired ? "text-red-500" : "text-foreground"
                  }`}
                >
                  {vipPlanUser?.vipExpiryDate
                    ? formatDate(vipPlanUser.vipExpiryDate)
                    : "N/A"}
                </p>
                {!isExpired && (
                  <p
                    className={`text-xs ${
                      isExpiringSoon ? "text-orange-400" : "text-muted-foreground"
                    }`}
                  >
                    Còn {daysRemaining} ngày
                  </p>
                )}
                {isExpired && (
                  <p className="text-red-500 text-xs">Đã hết hạn</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {/* Benefits */}
      <div className="mt-6 p-4 rounded-2xl bg-white/5 backdrop-blur-lg border border-border/70">
        <h3 className="text-primary font-semibold mb-2 flex items-center gap-1">
          <Check className="w-4 h-4" /> Quyền lợi của bạn
        </h3>
        <ul className="text-muted-foreground text-sm space-y-1">
          {[
            "Tắt toàn bộ quảng cáo",
            "Xem phim chất lượng 4K UHD",
            "Chat không delay - ưu tiên tốc độ",
            "Dùng sticker & GIF cực xịn",
            "Đổi avatar cá nhân không giới hạn",
            "Tên được gắn huy hiệu VIP sáng chói",
          ].map((f, i) => (
            <li key={i} className="flex items-center gap-1">
              <Check className="w-3 h-3 text-primary" /> {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      {vipPlanUser?.planDuration !== 9999 && (
        <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
          {(isExpiringSoon || isExpired) && onRenew && (
            <Button
              onClick={onRenew}
              className="bg-primary text-black font-bold py-2 px-4 rounded"
            >
              {isExpired ? "Gia Hạn Ngay" : "Gia Hạn VIP"}
            </Button>
          )}
          {onUpgrade && !isExpired && (
            <Button
              onClick={onUpgrade}
              className="bg-gray-700 text-foreground font-bold py-2 px-4 rounded"
            >
              Nâng Cấp Gói
            </Button>
          )}
        </div>
      )}

      {/* Lifetime Badge */}
      {vipPlanUser?.planDuration === 9999 && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-1 bg-primary text-black font-bold px-4 py-1 rounded-full">
            <Crown className="w-4 h-4" />
            <span>VIP VĨNH VIỄN</span>
            <Crown className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
}
