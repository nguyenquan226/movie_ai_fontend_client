import { Action } from "@/components/co_watching/action";
import { Background } from "@/components/co_watching/background";

interface homeCo_WatchingLayoutProps {
  children: React.ReactNode;
}

const homeCo_WatchingLayout = ({ children }: homeCo_WatchingLayoutProps) => {
  return (
    <div className="relative w-full lg:min-h-[calc(100vh-400px)] min-h-[calc(100vh-600px)]">
      <Background />
      <div className="relative z-10 pt-[230px]">
        <Action />
        {children}
      </div>
    </div>
  )
}
export default homeCo_WatchingLayout
