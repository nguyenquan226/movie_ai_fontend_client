
"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ChevronRight,
  Flag,
  MessageSquare,
  Reply,
  Send,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

import { useFilmStore } from "@/stores/filmStore";
import { useCommentStore } from "@/stores/comentStore";
import { useAuthStore } from "@/stores/authStore";
import { useAuthModalStore } from "@/stores/authModalStore";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatTimeFromNowVN } from "@/lib/dateFomat";
import { toast } from "sonner";
import { CommentServices } from "@/services/commentService";
import type { CommentItem } from "@/types/comment.type";

export default function CommentSection() {
  const searchParams = useSearchParams();
  const commentIdFromUrl = searchParams.get("commentId");

  const { filmData } = useFilmStore();
  const { authUser } = useAuthStore();
  const { fullName } = authUser || {};
  const { isAuthenticated } = useAuthStore();
  const { openLoginModal } = useAuthModalStore();
  const filmId = filmData?.film?.filmId ?? "";

  const {
    comments,
    replyingTo,
    setReplyingTo,
    fetchComments,
    createComment,
    deleteComment,
    reactComment,
    countComments,
    totalComments,
  } = useCommentStore();

  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [visibleReplies, setVisibleReplies] = useState<Record<string, number>>({});
  const [scrollCommentId, setScrollCommentId] = useState<string | null>(null);
  const [reportContent, setReportContent] = useState("");
  const [reportingCommentId, setReportingCommentId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");

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


  const getVisibleCount = (commentId: string) => {
    return visibleReplies[commentId] || 1;
  };

  const loadMoreReplies = (commentId: string) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || 1) + 3,
    }));
  };

  useEffect(() => {
    if (filmId) {
      fetchComments(filmId, 1, 10);
      countComments(filmId);
    }
  }, [filmId, fetchComments, countComments, isAuthenticated]);

  const handleSend = async () => {
    if (!filmId || !commentText.trim()) return;
    if (!isAuthenticated) {
      toast.warning("Bạn cần đăng nhập để bình luận.");
      return;
    }

    await createComment({
      content: commentText,
      filmId,
    });
    setCommentText("");
    countComments(filmId);
  };

  const handleReplySend = async () => {
    if (!isAuthenticated) {
      toast.warning("Bạn cần đăng nhập để phản hồi bình luận.");
      return;
    }
    if (!filmId || !replyText.trim() || !replyingTo) return;
    const parentId = replyingTo.replyId || replyingTo.rootParentId;

    await createComment({
      content: replyText,
      filmId,
      parentId,
    });
    countComments(filmId);
    setReplyText("");
    setReplyingTo(null);
  };

  const handleReact = (commentId: string, type: "LIKE" | "DISLIKE") => {
    if (!isAuthenticated) {
      toast.warning("Bạn cần đăng nhập để phản ứng với bình luận.");
      return;
    }
    reactComment(commentId, type);
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
    countComments(filmId);
  };

  const countReplies = (replies: CommentItem[]): number => {
    if (!replies || replies.length === 0) return 0;
    let count = replies.length;
    replies.forEach((rep) => {
      if (rep.replies && rep.replies.length > 0) {
        count += countReplies(rep.replies);
      }
    });
    return count;
  };

  useEffect(() => {
    if (!commentIdFromUrl || comments.length === 0) return;
    const targetId = commentIdFromUrl;
    let foundParentKey: string | null = null;
    let neededVisible = 0;
    for (const cmt of comments) {
      if (!cmt.replies || cmt.replies.length === 0) continue;
      const flattened: CommentItem[] = [];
      const flatten = (reps: CommentItem[]) => {
        reps.forEach((r) => {
          flattened.push(r);
          if (r.replies && r.replies.length > 0) {
            flatten(r.replies);
          }
        });
      };
      flatten(cmt.replies);
      const index = flattened.findIndex(
        (rep) => String(rep.id) === String(targetId)
      );
      if (index !== -1) {
        foundParentKey = `${cmt.id}-replies`;
        neededVisible = index + 1;
        break;
      }
    }
    if (foundParentKey) {
      setVisibleReplies((prev) => {
        const current = prev[foundParentKey!] || 1;
        if (current >= neededVisible) return prev;
        return {
          ...prev,
          [foundParentKey!]: neededVisible,
        };
      });
    }
    const scrollTimer = setTimeout(() => {
      const commentElement = document.getElementById(`comment-${targetId}`);
      if (commentElement) {
        const elementPosition =
          commentElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - 100;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        setScrollCommentId(commentIdFromUrl + "-" + Date.now());
        setTimeout(() => {
          const contentDiv = commentElement.querySelector(
            ":scope > .flex.items-start"
          ) as HTMLElement | null;
          const targetEl = contentDiv || (commentElement as HTMLElement);
          targetEl.classList.add("highlight-comment");
          setTimeout(() => {
            targetEl.classList.remove("highlight-comment");
            const url = new URL(window.location.href);
            url.searchParams.delete("commentId");
            url.searchParams.delete("t");
            window.history.replaceState(null, "", url.pathname + url.search);
          }, 1500);
        }, 600);
      }
    }, 200);
    return () => clearTimeout(scrollTimer);
  }, [commentIdFromUrl, comments]);

  const handleSendReport = async () => {


    if (!reportReason) {
      toast.warning("Vui lòng chọn lý do báo cáo.");
      return;
    }
    if (reportReason === REPORT_REASONS[9] && !reportContent.trim()) {
      toast.warning("Vui lòng nhập nội dung báo cáo chi tiết.");
      return;
    }

    if (!reportingCommentId) {
      toast.error("Không tìm thấy bình luận cần báo cáo.");
      return;
    }

    try {
      const description = reportReason === REPORT_REASONS[9]
        ? reportContent
        : reportReason;

      const res = await CommentServices.reportComment(
        reportingCommentId,
        reportReason,
        description
      );

      if (res.EC === 1) {
        toast.success("Báo cáo của bạn đã được gửi. Cảm ơn bạn!");
        setReportContent("");
        setReportReason("");
        setReportingCommentId(null);
      } else {
        toast.error(res.EM || "Gửi báo cáo thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error reporting comment:", error);
      toast.error("Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.");
    }
  };


  const renderReplies = (replies: CommentItem[], rootParent: CommentItem) => {
    if (!replies || replies.length === 0) return null;

    const flattenedReplies: CommentItem[] = [];
    const flatten = (reps: CommentItem[]) => {
      reps.forEach((r) => {
        flattenedReplies.push(r);
        if (r.replies && r.replies.length > 0) {
          flatten(r.replies);
        }
      });
    };
    flatten(replies);

    const parentKey = `${rootParent.id}-replies`;
    const visibleCount = getVisibleCount(parentKey);
    const hasMore = flattenedReplies.length > visibleCount;
    const visibleReplies = flattenedReplies.slice(0, visibleCount);

    return (
      <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3 ml-6 sm:ml-10 md:ml-12">
        {visibleReplies.map((rep, index) => (
          <div
            key={`${rep.id}-${index}`}
            id={`comment-${rep.id}`}
            className="flex flex-col relative"
          >
            <div className="flex items-start gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-3">
              <div className="relative w-7 h-7 sm:w-10 sm:h-10 z-10 flex-shrink-0">
                <img
                  src={rep.user?.avatar || "/images/small.jpg"}
                  alt="avatar"
                  className="w-full h-full rounded-full object-cover border-2 border-[#0a0b0e]"
                />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
                  <p className="text-xs sm:text-sm font-semibold text-foreground">
                    {rep.user.name}
                  </p>

                  <div className="flex items-baseline text-[10px] sm:text-sm text-muted-foreground gap-0.5 sm:gap-1">
                    <ChevronRight size={10} className="sm:w-[13px] sm:h-[13px] relative top-[1px] sm:top-[2px]" />
                    <span className="truncate max-w-[60px] sm:max-w-none">{rep.parent?.user?.name || rootParent.user.name}</span>
                  </div>

                  <p className="text-[10px] sm:text-xs text-muted-foreground/70">
                    {formatTimeFromNowVN(rep.createdAt)}
                  </p>
                </div>

                <p className="text-muted-foreground text-xs sm:text-sm mt-1 leading-relaxed break-words overflow-wrap-anywhere">
                  {rep.content}
                </p>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1.5 sm:mt-2 text-[10px] sm:text-sm text-muted-foreground">
                  <button
                    onClick={() =>
                      setReplyingTo(
                        replyingTo?.replyId === rep.id
                          ? null
                          : {
                            rootParentId: rootParent.id,
                            replyId: rep.id,
                            replyToName: rep.user.name,
                          }
                      )
                    }
                    className="flex items-center gap-1 sm:gap-2 hover:text-primary transition"
                  >
                    <Reply size={12} className="sm:w-4 sm:h-4" /> Trả lời
                  </button>

                  <button
                    onClick={() => handleReact(rep.id, "LIKE")}
                    className="flex items-center gap-0.5 sm:gap-1 hover:text-primary transition"
                  >
                    <ThumbsUp
                      size={12}
                      className={`sm:w-4 sm:h-4 ${rep.currentUserReaction === "LIKE"
                          ? "text-primary fill-yellow-400"
                          : ""
                        }`}
                    />
                    <span>{rep.totalLike}</span>
                  </button>

                  <button
                    onClick={() => handleReact(rep.id, "DISLIKE")}
                    className="flex items-center gap-0.5 sm:gap-1 hover:text-red-400 transition"
                  >
                    <ThumbsDown
                      size={12}
                      className={`sm:w-4 sm:h-4 ${rep.currentUserReaction === "DISLIKE"
                          ? "text-red-400 fill-red-500"
                          : ""
                        }`}
                    />
                    <span>{rep.totalDislike}</span>
                  </button>

                  {authUser?.userId === rep.user.id && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="flex items-center gap-2 hover:text-red-400 transition"
                          type="button"
                        >
                          <Trash2 size={16} /> Xóa
                        </button>
                      </AlertDialogTrigger>

                      <AlertDialogContent className="bg-background border-border text-foreground">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle
                              size={20}
                              className="text-primary"
                            />
                            Xác nhận xóa bình luận?
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
                            onClick={() => handleDeleteComment(rep.id)}
                            className="bg-red-600 hover:bg-red-500 text-foreground"
                          >
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  <Dialog open={reportingCommentId === rep.id} onOpenChange={(open) => {
                    if (!open) {
                      setReportingCommentId(null);
                      setReportReason("");
                      setReportContent("");
                    }
                  }}>
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          toast.warning("Bạn cần đăng nhập để báo cáo bình luận.");
                          return;
                        }
                        setReportingCommentId(rep.id);
                        setReportReason("");
                        setReportContent("");
                      }}
                      className="flex items-center gap-1 hover:text-red-500 transition"
                      title="Báo cáo"
                      type="button"
                    >
                      <Flag size={16} />
                      <span>Báo cáo</span>
                    </button>

                    <DialogContent className="bg-background border-border text-foreground max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-red-500 flex items-center gap-2">
                          <AlertTriangle size={20} className="text-primary" />
                          Báo cáo bình luận tiêu cực
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
                                id={`rep-${rep.id}-${reason}`}
                                className="border-gray-600 text-primary"
                              />
                              <Label
                                htmlFor={`rep-${rep.id}-${reason}`}
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
                            setReportingCommentId(null);
                            setReportReason("");
                            setReportContent("");
                          }}
                          className="bg-secondary border-border text-foreground hover:bg-accent"
                        >
                          Hủy
                        </Button>
                        <Button
                          onClick={handleSendReport}
                          disabled={!reportReason}
                          className="bg-red-600 hover:bg-red-700 text-foreground"
                        >
                          Gửi báo cáo
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {replyingTo?.replyId === rep.id && (
                  <div className="ml-0 sm:ml-6 mt-2 w-full sm:w-[80%] md:w-[60%] bg-[#1E202A] border border-border rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-inner">
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">
                      Đang trả lời{" "}
                      <span className="text-primary">
                        {replyingTo?.replyToName}
                      </span>
                    </p>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleReplySend();
                        }
                      }}
                      rows={2}
                      placeholder="Viết phản hồi..."
                      className="w-full bg-transparent text-foreground placeholder-gray-500 resize-none outline-none text-xs sm:text-sm rounded-md px-2 py-1"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={handleReplySend}
                        className="flex items-center gap-1 font-semibold text-primary hover:text-primary transition text-xs sm:text-sm"
                      >
                        Gửi <Send size={12} className="sm:w-[14px] sm:h-[14px] text-primary" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {hasMore && (
          <button
            onClick={() => loadMoreReplies(parentKey)}
            className="ml-6 sm:ml-12 mt-2 text-xs sm:text-sm text-primary hover:text-primary transition font-medium"
          >
            Xem thêm{" "}
            {Math.min(3, flattenedReplies.length - visibleCount)} phản hồi...
          </button>
        )}
      </div>
    );
  };

  return (
    <div id="comment-section" className="mt-2">
      <div className="flex items-center justify-between mb-3 sm:mb-5">
        <h3 className="text-lg sm:text-2xl font-semibold text-foreground flex items-center gap-2">
          Bình luận ({totalComments})
        </h3>
      </div>

      {/* form comment */}
      <div className="bg-background p-3 sm:p-6 rounded-xl border border-border shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          {isAuthenticated ? (
            <>
              <div className="relative w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0">
                <img
                  src={authUser?.avatarUrl || "/images/monkey.jpg"}
                  alt="avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Bình luận với tên</p>
                <p className="text-foreground font-semibold text-sm sm:text-base truncate">{fullName}</p>
              </div>
            </>
          ) : (
            <button
              onClick={openLoginModal}
              className="text-xs sm:text-sm font-semibold text-muted-foreground transition"
            >
              Bạn cần{" "}
              <span className="text-primary hover:text-primary underline">
                đăng nhập
              </span>{" "}
              để bình luận.
            </button>
          )}
        </div>

        <div className="bg-secondary/70 border border-border rounded-lg p-2 sm:p-4">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            maxLength={2000}
            rows={3}
            placeholder="Viết bình luận..."
            className="w-full bg-secondary/70 text-foreground placeholder-gray-500 resize-none outline-none text-xs sm:text-sm p-2 sm:p-3 rounded-lg sm:rounded-xl text-left align-top"
          />

          <div className="flex justify-between items-center mt-2 sm:mt-3">
            <span className="text-muted-foreground/70 text-[10px] sm:text-xs">
              {commentText.length} / 2000
            </span>
            <button
              onClick={handleSend}
              className="flex items-center gap-1 sm:gap-2 font-semibold text-primary hover:text-primary transition text-xs sm:text-sm"
            >
              Gửi <Send size={14} className="sm:w-[18px] sm:h-[18px] text-primary" />
            </button>
          </div>
        </div>
      </div>

      {/* list comment */}
      <div className="mt-4 sm:mt-6">
        {comments.length === 0 ? (
          <div className="bg-secondary/70 rounded-xl sm:rounded-2xl border border-border py-8 sm:py-12 flex flex-col items-center justify-center text-muted-foreground">
            <MessageSquare size={32} className="sm:w-10 sm:h-10 mb-2 sm:mb-3 opacity-70" />
            <p className="text-xs sm:text-sm">Chưa có bình luận nào</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {[...comments]
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((cmt, index) => (
                <div
                  key={`${cmt.id}-${index}`}
                  id={`comment-${cmt.id}`}
                  className="flex flex-col gap-2 sm:gap-3 border-b border-border pb-3 sm:pb-4"
                >
                  {/* comment gốc */}
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                      <img
                        src={cmt.user?.avatar || "/images/monkey.jpg"}
                        alt="avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        <p className="text-xs sm:text-sm font-semibold text-foreground">
                          {cmt.user.name}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground/70">
                          {formatTimeFromNowVN(cmt.createdAt)}
                        </p>
                      </div>
                      <p className="text-muted-foreground text-xs sm:text-sm mt-1 leading-relaxed break-words overflow-wrap-anywhere">
                        {cmt.content}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-[10px] sm:text-sm text-muted-foreground">
                        <button
                          onClick={() =>
                            setReplyingTo(
                              replyingTo?.rootParentId === cmt.id &&
                                !replyingTo?.replyId
                                ? null
                                : {
                                  rootParentId: cmt.id,
                                  replyToName: cmt.user.name,
                                }
                            )
                          }
                          className="flex items-center gap-1 sm:gap-2 hover:text-primary transition"
                        >
                          <Reply size={14} className="sm:w-4 sm:h-4" />
                          <span>
                            Trả lời{" "}
                            {countReplies(cmt.replies || []) > 0 &&
                              `(${countReplies(cmt.replies || [])})`}
                          </span>
                        </button>

                        <button
                          onClick={() => handleReact(cmt.id, "LIKE")}
                          className="flex items-center gap-0.5 sm:gap-1 hover:text-primary transition"
                        >
                          <ThumbsUp
                            size={14}
                            className={`sm:w-4 sm:h-4 ${cmt.currentUserReaction === "LIKE"
                                ? "text-primary fill-yellow-400"
                                : ""
                              }`}
                          />
                          <span>{cmt.totalLike}</span>
                        </button>

                        <button
                          onClick={() => handleReact(cmt.id, "DISLIKE")}
                          className="flex items-center gap-0.5 sm:gap-1 hover:text-red-400 transition"
                        >
                          <ThumbsDown
                            size={14}
                            className={`sm:w-4 sm:h-4 ${cmt.currentUserReaction === "DISLIKE"
                                ? "text-red-400 fill-red-500"
                                : ""
                              }`}
                          />
                          <span>{cmt.totalDislike}</span>
                        </button>

                        {authUser?.userId === cmt.user.id && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                className="flex items-center gap-2 hover:text-red-400 transition"
                                type="button"
                              >
                                <Trash2 size={16} /> Xóa
                              </button>
                            </AlertDialogTrigger>

                            <AlertDialogContent className="bg-background border-border text-foreground">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                  <AlertTriangle
                                    size={20}
                                    className="text-primary"
                                  />
                                  Xác nhận xóa bình luận?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                  Hành động này không thể hoàn tác. Bạn chắc
                                  chắn muốn tiếp tục?
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-secondary border-border text-foreground hover:bg-accent">
                                  Hủy
                                </AlertDialogCancel>

                                <AlertDialogAction
                                  onClick={() => handleDeleteComment(cmt.id)}
                                  className="bg-red-600 hover:bg-red-500 text-foreground"
                                >
                                  Xóa
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        <Dialog open={reportingCommentId === cmt.id} onOpenChange={(open) => {
                          if (!open) {
                            setReportingCommentId(null);
                            setReportReason("");
                            setReportContent("");
                          }
                        }}>
                          <button
                            onClick={() => {
                              if (!isAuthenticated) {
                                toast.warning("Bạn cần đăng nhập để báo cáo bình luận.");
                                return;
                              }
                              setReportingCommentId(cmt.id);
                              setReportReason("");
                              setReportContent("");
                            }}
                            className="flex items-center gap-1 hover:text-red-500 transition"
                            title="Báo cáo"
                            type="button"
                          >
                            <Flag size={16} />
                            <span>Báo cáo</span>
                          </button>

                          <DialogContent className="bg-background border-border text-foreground max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-red-500 flex items-center gap-2">
                                <AlertTriangle size={20} className="text-primary" />
                                Báo cáo bình luận tiêu cực
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
                                      id={`cmt-${cmt.id}-${reason}`}
                                      className="border-gray-600 text-primary focus:bg-primary "
                                    />
                                    <Label
                                      htmlFor={`cmt-${cmt.id}-${reason}`}
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
                                  setReportingCommentId(null);
                                  setReportReason("");
                                  setReportContent("");
                                }}
                                className="bg-secondary border-border text-foreground hover:bg-accent"
                              >
                                Hủy
                              </Button>
                              <Button
                                onClick={handleSendReport}
                                disabled={!reportReason}
                                className="bg-red-600 hover:bg-red-700 text-foreground"
                              >
                                Gửi báo cáo
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>

                  {/* ô nhập reply cho comment gốc */}
                  {replyingTo?.rootParentId === cmt.id && !replyingTo.replyId && (
                    <div className="ml-8 sm:ml-12 mt-2 w-full sm:w-[70%] md:w-[60%] bg-[#1E202A] border border-border rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-inner">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">
                        Đang trả lời{" "}
                        <span className="text-primary">
                          {replyingTo.replyToName}
                        </span>
                      </p>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key == "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleReplySend();
                          }
                        }}
                        rows={2}
                        placeholder="Viết phản hồi..."
                        className="w-full bg-transparent text-foreground placeholder-gray-500 resize-none outline-none text-xs sm:text-sm rounded-md px-2 py-1"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <button
                          onClick={handleReplySend}
                          className="flex items-center gap-1 font-semibold text-primary hover:text-primary transition text-xs sm:text-sm"
                        >
                          Gửi <Send size={12} className="sm:w-[14px] sm:h-[14px] text-primary" />
                        </button>
                      </div>
                    </div>
                  )}

                  {renderReplies(cmt.replies, cmt)}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
