"use client";

import { useRouter } from "next/navigation";
import { CircleChevronLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCoWatchingStore } from "@/stores/co-watchingStore";

export function ExitButton({ onClick }: { onClick: () => void }) {
  const router = useRouter();
  const { resetDataRoom } = useCoWatchingStore();

  const handleExit = () => {
    onClick();
    resetDataRoom();
    router.push("/co-watching");
  };

  return (
    <button
      className="flex items-center gap-2 cursor-pointer"
      onClick={handleExit}
      type="button"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <CircleChevronLeft />
        </TooltipTrigger>
        <TooltipContent className="bg-amber-400 text-black">
          <p>Quay về trang danh sách live</p>
        </TooltipContent>
      </Tooltip>
    </button>
  );
}
