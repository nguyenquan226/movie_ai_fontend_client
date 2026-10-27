import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CardProps {
  thumbUrl: string;
  name: string;
  createdAt: string;
  filmTitle: string;
  view?: number;
  hostName: string;
  roomId: string;
  isLive: boolean;
}

export const Card = ({
  thumbUrl,
  name,
  createdAt,
  filmTitle,
  view = 0,
  hostName,
  roomId,
  isLive,
}: CardProps) => {

  const router = useRouter();

  const handleJoinRoom = () => {
    if (!isLive) {
      toast.warning("Phòng live đã dừng");
      return;
    }
    router.push(`/co-watching/${roomId}`)
  }

  return (
    <div
      onClick={handleJoinRoom}
      className="pt-4 group"
    >
      <div className="rounded-xl overflow-hidden group-hover:ring-1 group-hover:ring-amber-300 transition-[color,background-color,border-color,opacity,transform,box-shadow] ease-in duration-120">
        <div className=" relative bg-zinc-700 ">
          <div className="flex items-center justify-center">
            <img
              src={thumbUrl}
              alt="thumbURL"
              className="object-cover object-center max-h-[210px] w-auto"
            />
          </div>
          {isLive && (
            <div className="absolute top-0 right-0 lg:p-3 p-2">
              <Button
                variant={"ghost"}
                size={"sm"}
                className="bg-red-600/85 hover:bg-red-600/80 hover:text-foreground lg:text-[10px] text-[8px] leading-0 lg:h-6 h-5"
              >
                LIVE
              </Button>
            </div>
          )}
        </div>

      </div>
      <div className="pt-2 flex items-center gap-4">
        <div className="size-11 rounded-full overflow-hidden shrink-0">
          <img
            src="https://static.nutscdn.com/vimg/300-0/d551d3a7f93e4d6214a78456bc80cce9.jpg"
            alt="avatar"
            className="w-full h-auto object-cover object-center"
          />
        </div>
        <div>
          <h3
            className="lg:text-[16px] overflow-hidden text-sm"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
            }}
          >
            {name}
          </h3>
          <h3 className="text-xs lg:text-sm font-semibold text-foreground/50 italic">{filmTitle}</h3>
          <p className="text-foreground/50 text-xs">{hostName} • {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: vi })}</p>
        </div>
      </div>
    </div>
  )
}
