import { TooltipProvider } from "@/components/ui/tooltip";
import "./_components/artplayer-custom.css";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider>
      <div>{children}</div>
    </TooltipProvider>
  )
}
export default layout;
