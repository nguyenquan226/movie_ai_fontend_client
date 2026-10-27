"use client";

import { cn } from "@/lib/utils";
import { PartDetail } from "@/types/part.type";
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface partEpisodeDialogProps {
  partData: PartDetail[];
  open: boolean;
  part: string;
  episode: string;
  setOpen: (open: boolean) => void;
  setPart: (part: string) => void;
  setEpisode: (part: string) => void;
}

export const PartEpisodeDialog = ({
  partData,
  open,
  part,
  episode,
  setOpen,
  setPart,
  setEpisode,
}: partEpisodeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="lg:max-w-2xl md:max-w-xl max-w-md bg-[#282b3a] border-0 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-sm md:text-lg">Chọn thông tin phim</DialogTitle>
          <DialogDescription className="text-sx md:text-sm">
            Xin vui lòng chọn <strong className="text-primary">phần</strong> và <strong className="text-primary">tập</strong> để bắt đầu tạo phòng xem chung!
          </DialogDescription>
        </DialogHeader>
        <div>
          <Select value={part} onValueChange={setPart}>
            <SelectTrigger className="lg:w-[120px] md:w-[100px] w-[90px] border-amber-300">
              <SelectValue placeholder="Chọn phần" />
            </SelectTrigger>
            <SelectContent className="z-10000 bg-[#282b3a]/50 backdrop-blur-sm  border-0 text-foreground ring-1 ring-amber-400/50">
              <SelectGroup>
                {partData.map((p, index) => (
                  <SelectItem
                    key={index}
                    value={(p.partNumber).toString()}
                    className="focus:bg-amber-400"
                  >
                    {p.partNumber}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>


          <div className="flex items-center flex-wrap md:gap-4 gap-2 md:mt-4 mt-3 md:pt-4 pt-3 border-t border-zinc-100">
            {partData[+part - 1].episodes.map((ep, i) => {
              const isSelected = ep.episodeNumber === +episode;
              // console.log(">>>>> Check: ", isSelected, episode.episodeNumber === +episode, isActive)
              return (
                <div
                  key={i}
                  onClick={() => setEpisode((i + 1).toString())}
                  className={cn(
                    "w-18 h-8 flex items-center justify-center rounded-md bg-zinc-500 text-foreground font-normal text-xs cursor-pointer",
                    "hover:bg-amber-400 hover:text-black transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-200 ease",
                    isSelected && "bg-amber-400 text-black"
                  )}
                >
                  {ep.title !== "" ? ep.title : `Tập ${ep.episodeNumber}`}
                </div>
              )
            })}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              size={"sm"}
              className="text-black hover:shadow-[0px_0px_10px_0px_#d4d4d8] transition-[color,background-color,border-color,opacity,transform,box-shadow] ease duration-200 text-xs md:text-sm"
            >
              Đóng
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}
