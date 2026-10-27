import { Flag, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const optionList = [
  { icon: Heart, name: "Yêu thích" },
  { icon: Plus, name: "Thêm vào" },
];

const PlayerLineConfig = () => {
  return (
    <div className="xl:px-8 xl:py-4 md:px-4 md:py-3 px-3 py-2 bg-zinc-950 text-foreground flex items-center justify-between lg:text-sm text-xs">
      <div className="flex items-center gap-6">
        {optionList.map((item, index) => {
          const Icon = item.icon;
          return (
            <Button
              key={index}
              variant={"ghost"}
              className={cn(
                "flex gap-2 items-center font-semibold cursor-pointer hover:bg-background/80 hover:text-foreground",
                "hover:shadow-2xs shadow-zinc-400"
              )}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Button>
          );
        })}
      </div>
      <Button
        variant={"ghost"}
        className={cn(
          "flex gap-2 items-center font-semibold cursor-pointer hover:bg-background/80 hover:text-foreground",
          "hover:shadow-2xs shadow-zinc-400"
        )}
      >
        <Flag size={20} />
        <span>Báo lỗi</span>
      </Button>
    </div>
  );
};
export default PlayerLineConfig;
