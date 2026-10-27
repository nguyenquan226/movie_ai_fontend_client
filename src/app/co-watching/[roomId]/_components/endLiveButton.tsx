import { useState } from "react"
import { Unplug } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface EndLiveButtonProps {
  handleEnd: () => void;
}

export const EndLiveButton = ({ handleEnd }: EndLiveButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleConfirmEnd = () => {
    handleEnd();
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="hover:bg-red-500 hover:text-foreground"
          >
            <Unplug className="md:size-4 size-3" />
            <span className="md:text-sm text-xs">Dừng Live</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#212a56] border-0">
          <DialogHeader>
            <DialogTitle className="text-primary text-xl">
              Bạn chắc chắn muốn dừng phiên live?
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Khi chọn dừng thì phiên live lập tức dừng và các thành viên trong phòng sẽ bị chuyển về trang danh sách live.
          </DialogDescription>
          <div className="flex items-center gap-2 justify-end">
            <Button
              variant={"destructive"}
              onClick={handleConfirmEnd}
              className="cursor-pointer"
            >
              Dừng
            </Button>
            <Button
              className="bg-white text-black hover:bg-white hover:opacity-90 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
