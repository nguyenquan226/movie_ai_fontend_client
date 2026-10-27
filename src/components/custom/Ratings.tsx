"use client";
import { useEffect, useState } from "react";
import { Star, Trash2, Flag, AlertTriangle } from "lucide-react";
import { useFilmStore } from "@/stores/filmStore";
import { useAuthStore } from "@/stores/authStore";
import { useAuthModalStore } from "@/stores/authModalStore";
import { useRatingStore } from "@/stores/ratingStore";
import { socket } from "@/lib/socket";
import { toast } from "sonner";
import { formatTimeFromNowVN } from "@/lib/dateFomat";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ratingService } from "@/services/ratingService";

export default function Ratings() {
    const { filmData } = useFilmStore();
    const { authUser, isAuthenticated } = useAuthStore();
    const { openLoginModal } = useAuthModalStore();
    const {
        ratings,
        averageRating,
        totalRatings,
        isLoading,
        fetchRatings,
        createRating,
        deleteRating,
        updateRatingRealtime,
        deleteRatingRealtime,
    } = useRatingStore();

    const filmId = filmData?.film?.filmId ?? "";

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [reportContent, setReportContent] = useState("");
    const [reportingRatingId, setReportingRatingId] = useState<string | null>(null);
    const [reportReason, setReportReason] = useState("");
    const [isSubmittingReport, setIsSubmittingReport] = useState(false);

    const REPORT_REASONS = [
        "Ngôn từ thô tục, xúc phạm",
        "Phát tán thông tin sai sự thật",
        "Quảng cáo, spam, lừa đảo",
        "Kích động bạo lực, thù ghét",
        "Nội dung khiêu dâm, đồi trụy",
        "Tiết lộ thông tin cá nhân",
        "Bắt nạt, quấy rối người khác",
        "Vi phạm pháp luật, bản quyền",
        "Nội dung không liên quan đến phim",
        "Khác (vui lòng ghi rõ)"
    ];

    useEffect(() => {
        if (filmId) {
            fetchRatings(filmId);
        }
    }, [filmId, fetchRatings]);

    useEffect(() => {
        if (!filmId) return;

        const handleRatingUpdated = (data: any) => {
            if (data.filmId === filmId) {
                updateRatingRealtime(data);
            }
        };

        const handleRatingDeleted = (data: any) => {

            if (data.filmId === filmId) {
                deleteRatingRealtime(data.ratingId);
            }
        };

        const handleRatingHidden = (data: any) => {
            if (data.filmId !== filmId) return;
            if (data.isHidden) {
                deleteRatingRealtime(data.ratingId);
            } else {
                fetchRatings(filmId);
            }
        };

        socket.on('ratingUpdated', handleRatingUpdated);
        socket.on('ratingDeleted', handleRatingDeleted);
        socket.on('hideRating', handleRatingHidden);

        return () => {
            socket.off('ratingUpdated', handleRatingUpdated);
            socket.off('ratingDeleted', handleRatingDeleted);
            socket.off('hideRating', handleRatingHidden);
        };
    }, [filmId, updateRatingRealtime, deleteRatingRealtime, fetchRatings]);

    const handleSend = async () => {
        if (!isAuthenticated) {
            toast.warning("Bạn cần đăng nhập để đánh giá phim.");
            openLoginModal();
            return;
        }

        if (rating === 0) return;

        try {
            const response: any = await createRating({
                filmId,
                ratingValue: rating,
                content: comment.trim() || undefined,
            });
            setComment("");
            setRating(0);
            toast.success(response?.EM || "Đánh giá thành công!");
        } catch (error: any) {
            toast.error(error.message || "Không thể gửi đánh giá. Vui lòng thử lại.");
        }
    };

    const handleDelete = async (ratingId: string) => {
        if (!isAuthenticated) return;
        try {
            const response: any = await deleteRating(ratingId);
            toast.success(response?.EM || "Xóa đánh giá thành công");
        } catch (error: any) {
            toast.error(error.message || "Không thể xóa đánh giá. Vui lòng thử lại.");
        }
    };

    const handleSendReport = async () => {
        setIsSubmittingReport(true);

        if (!reportReason) {
            toast.warning("Vui lòng chọn lý do báo cáo.");
            setIsSubmittingReport(false);
            return;
        }

        if (reportReason === REPORT_REASONS[9] && !reportContent.trim()) {
            toast.warning("Vui lòng nhập nội dung báo cáo chi tiết.");
            setIsSubmittingReport(false);
            return;
        }

        if (!reportingRatingId) {
            toast.error("Không tìm thấy đánh giá cần báo cáo.");
            setIsSubmittingReport(false);
            return;
        }

        try {
            const description = reportReason === REPORT_REASONS[9]
                ? reportContent
                : reportReason;

            const res = await ratingService.reportRating(
                reportingRatingId,
                reportReason,
                description
            );

            if (res.EC === 1) {
                toast.success("Báo cáo của bạn đã được gửi. Cảm ơn bạn!");
                setReportingRatingId(null);
                setReportReason("");
                setReportContent("");
            } else {
                toast.error(res.EM || "Gửi báo cáo thất bại. Vui lòng thử lại.");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.");
        } finally {
            setIsSubmittingReport(false);
        }
    };

    return (
        <div id="rating-section" className="mt-1.5 min-[400px]:mt-2 text-center">
            <div className="mb-3 min-[400px]:mb-4 sm:mb-6">
                <h3 className="text-base min-[400px]:text-lg sm:text-2xl font-semibold mb-1.5 min-[400px]:mb-2">Đánh giá</h3>
                {totalRatings > 0 && (
                    <div className="flex items-center justify-center gap-1 min-[400px]:gap-1.5 sm:gap-2 text-primary">
                        <Star size={14} className="min-[400px]:w-4 min-[400px]:h-4 sm:w-5 sm:h-5 fill-yellow-400" />
                        <span className="text-sm min-[400px]:text-base sm:text-lg font-bold">{averageRating.toFixed(1)}</span>
                        <span className="text-[10px] min-[400px]:text-xs sm:text-sm text-muted-foreground">({totalRatings} đánh giá)</span>
                    </div>
                )}
            </div>

            <div className="flex justify-center mb-2 min-[400px]:mb-3 sm:mb-4 gap-1.5 min-[400px]:gap-2 sm:gap-3">
                {[...Array(5)].map((_, i) => {
                    const val = i + 1;
                    return (
                        <Star
                            key={i}
                            size={24}
                            onClick={() => setRating(val)}
                            onMouseEnter={() => setHover(val)}
                            onMouseLeave={() => setHover(0)}
                            className={`cursor-pointer transition-transform min-[400px]:w-[28px] min-[400px]:h-[28px] sm:w-[34px] sm:h-[34px] ${val <= (hover || rating)
                                ? "text-primary fill-yellow-400"
                                : "text-muted-foreground/70"
                                }`}
                        />
                    );
                })}
            </div>

            <textarea
                placeholder="Viết nhận xét về phim (tuỳ chọn)"
                className="w-full p-1.5 min-[400px]:p-2 sm:p-3 rounded-lg bg-secondary/70 text-foreground placeholder-gray-500 text-[10px] min-[400px]:text-xs sm:text-sm focus:outline-none resize-none h-16 min-[400px]:h-20 sm:h-24 mb-2 min-[400px]:mb-3 sm:mb-4 border border-border"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            ></textarea>

            <div className="flex justify-center gap-1.5 min-[400px]:gap-2 sm:gap-3">
                <button
                    onClick={handleSend}
                    disabled={isLoading || rating === 0}
                    className="bg-primary hover:bg-primary text-black font-semibold px-2 min-[400px]:px-3 sm:px-5 py-1 min-[400px]:py-1.5 sm:py-2 text-[10px] min-[400px]:text-xs sm:text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
                <button
                    onClick={() => {
                        setRating(0);
                        setComment("");
                    }}
                    className="bg-gray-700 hover:bg-gray-600 px-2 min-[400px]:px-3 sm:px-5 py-1 min-[400px]:py-1.5 sm:py-2 text-[10px] min-[400px]:text-xs sm:text-sm rounded-lg"
                >
                    Xoá
                </button>
            </div>

            <div className="mt-3 min-[400px]:mt-4 sm:mt-6">
                {ratings.length === 0 ? (
                    <div className="bg-secondary/70 rounded-lg min-[400px]:rounded-xl sm:rounded-2xl border border-border py-6 min-[400px]:py-8 sm:py-12 flex flex-col items-center justify-center text-muted-foreground">
                        <Star size={28} className="min-[400px]:w-8 min-[400px]:h-8 sm:w-10 sm:h-10 mb-1.5 min-[400px]:mb-2 sm:mb-3 opacity-70" />
                        <p className="text-[10px] min-[400px]:text-xs sm:text-sm">Chưa có đánh giá nào</p>
                    </div>
                ) : (
                    <div className="space-y-3 min-[400px]:space-y-4 sm:space-y-6">
                        {ratings.map((rev) => (
                            <div
                                key={rev.ratingId}
                                className="flex flex-col gap-1.5 min-[400px]:gap-2 sm:gap-3 border-b border-border pb-2 min-[400px]:pb-3 sm:pb-4"
                            >
                                <div className="flex items-start gap-1.5 min-[400px]:gap-2 sm:gap-3">
                                    <div className="relative w-7 h-7 min-[400px]:w-8 min-[400px]:h-8 sm:w-12 sm:h-12 flex-shrink-0">
                                        <img
                                            src={rev.user?.avatar || "/images/monkey.jpg"}
                                            alt="avatar"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="flex items-start sm:items-center justify-between gap-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 min-w-0">
                                                <p className="text-[10px] min-[400px]:text-xs sm:text-sm font-semibold text-foreground truncate">
                                                    {rev.user?.name || 'Anonymous'}
                                                </p>
                                                <p className="text-[9px] min-[400px]:text-[10px] sm:text-xs text-muted-foreground/70">
                                                    {formatTimeFromNowVN(rev.createdAt)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {authUser?.userId === rev.user?.id ? (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className="text-red-400 hover:text-red-300 transition"
                                                                title="Xóa"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="bg-background border-border text-foreground">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className="flex items-center gap-2">
                                                                    <AlertTriangle size={20} className="text-primary" />
                                                                    Xác nhận xóa đánh giá?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription className="text-muted-foreground">
                                                                    Hành động này không thể hoàn tác.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel className="bg-secondary border-border text-foreground hover:bg-accent">
                                                                    Hủy
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(rev.ratingId)}
                                                                    className="bg-red-600 hover:bg-red-500 text-foreground"
                                                                >
                                                                    Xóa
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            if (!isAuthenticated) {
                                                                toast.warning("Bạn cần đăng nhập để báo cáo đánh giá.");
                                                                return;
                                                            }
                                                            setReportingRatingId(rev.ratingId);
                                                            setReportReason("");
                                                            setReportContent("");
                                                        }}
                                                        className="text-muted-foreground hover:text-red-400 transition"
                                                        title="Báo cáo"
                                                    >
                                                        <Flag size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={`${i < rev.ratingValue
                                                        ? "text-primary fill-yellow-400"
                                                        : "text-muted-foreground/80"
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        {rev.content && (
                                            <p className="text-muted-foreground text-sm mt-1 break-words whitespace-pre-wrap leading-relaxed">
                                                {rev.content}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Report Dialog */}
            <Dialog open={!!reportingRatingId} onOpenChange={(open) => {
                if (!open) {
                    setReportingRatingId(null);
                    setReportReason("");
                    setReportContent("");
                }
            }}>
                <DialogContent className="bg-background border-border text-foreground max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-red-500 text-lg flex items-center gap-2">
                            <AlertTriangle size={20} className="text-primary" />
                            Báo cáo đánh giá tiêu cực
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Vui lòng chọn lý do báo cáo:
                        </DialogDescription>
                    </DialogHeader>

                    <RadioGroup value={reportReason} onValueChange={setReportReason}>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {REPORT_REASONS.map((reason) => (
                                <div key={reason} className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value={reason}
                                        id={reason}
                                        className="border-gray-600 text-primary focus:bg-primary"
                                    />
                                    <Label
                                        htmlFor={reason}
                                        className="text-sm text-muted-foreground cursor-pointer flex-1"
                                    >
                                        {reason}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </RadioGroup>

                    {reportReason === REPORT_REASONS[9] && (
                        <Textarea
                            value={reportContent}
                            onChange={(e) => setReportContent(e.target.value)}
                            placeholder="Nhập nội dung báo cáo chi tiết..."
                            className="bg-secondary border-border text-foreground placeholder-gray-500 min-h-[100px]"
                        />
                    )}

                    <div className="flex gap-2 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setReportingRatingId(null);
                                setReportReason("");
                                setReportContent("");
                            }}
                            disabled={isSubmittingReport}
                            className="bg-secondary border-border text-foreground hover:bg-accent"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSendReport}
                            disabled={isSubmittingReport || !reportReason}
                            className="bg-red-600 hover:bg-red-700 text-foreground"
                        >
                            {isSubmittingReport ? "Đang gửi..." : "Gửi báo cáo"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
