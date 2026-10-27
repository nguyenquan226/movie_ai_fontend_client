"use client";

import Ratings from "./Ratings";
import Comments from "./Comment";
import { useCommentStore } from "@/stores/comentStore";
import { useEffect } from "react";
import { eventBus } from "@/lib/eventBus";
import { flushSync } from "react-dom";


export default function CommentRatingTabs() {
  const { activeTab, setActiveTab } = useCommentStore();

  useEffect(() => {
    const handleSwitchTab = (tab: "comments" | "ratings") => {
      flushSync(() => { setActiveTab(tab) });
    };
    eventBus.on("switchTab", handleSwitchTab);
    return () => {
      eventBus.off("switchTab", handleSwitchTab);
    };
  }, []);

  return (

    <div className="mt-3 min-[400px]:mt-4 sm:mt-10 bg-gradient-to-b from-[#1A1B23] to-[#111217] rounded-lg min-[400px]:rounded-xl sm:rounded-2xl border border-border/70 p-2 min-[400px]:p-3 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.45)] text-foreground transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 ease-in-out">

      <div className="flex justify-center mb-3 min-[400px]:mb-4 sm:mb-6 border-b border-border/70 pb-1.5 min-[400px]:pb-2 sm:pb-3 gap-1.5 min-[400px]:gap-2 sm:gap-3">
        <button
          onClick={() => { setActiveTab("comments") }}
          className={`relative px-3 min-[400px]:px-4 sm:px-6 py-1.5 min-[400px]:py-2 sm:py-2.5 text-[10px] min-[400px]:text-xs sm:text-sm font-semibold rounded-t-lg sm:rounded-t-xl transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300
                    ${activeTab === "comments"
              ? "bg-primary text-black shadow-[0_0_20px_rgba(250,204,21,0.4)]"
              : "bg-background/70 text-muted-foreground hover:text-primary hover:bg-secondary/80"
            }`}
        >
          Bình luận
        </button>
        <button
          onClick={() => { setActiveTab("ratings") }}
          className={`relative px-3 min-[400px]:px-4 sm:px-6 py-1.5 min-[400px]:py-2 sm:py-2.5 text-[10px] min-[400px]:text-xs sm:text-sm font-semibold rounded-t-lg sm:rounded-t-xl transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300
                    ${activeTab === "ratings"
              ? "bg-primary text-black shadow-[0_0_20px_rgba(250,204,21,0.4)]"
              : "bg-background/70 text-muted-foreground hover:text-primary hover:bg-secondary/80"
            }`}>
          Đánh giá
        </button>
      </div>

      <div className="bg-background border border-border/70 rounded-lg sm:rounded-xl p-2 min-[400px]:p-3 sm:p-5 shadow-[inset_0_0_25px_rgba(0,0,0,0.3)] transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300">
        {activeTab === "comments" ? <Comments /> : <Ratings />}
      </div>
    </div>
  );
}
