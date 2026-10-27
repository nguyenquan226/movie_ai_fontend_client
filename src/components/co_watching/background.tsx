import { cn } from "@/lib/utils"
import Image from "next/image"

export const Background = () => {
  return (
    <div className={cn(
      "absolute top-0 left-0 right-0 h-[500px] w-full [mask-image:linear-gradient(0deg,transparent_0,black_80%)] [-webkit - mask - image: linear - gradient(0deg, transparent_0, black_80%)]",
      "before:content-[''] before:absolute  before:inset-0 before:bg-[url('/common/dotted.png')]  before:bg-repeat  before:opacity-50  before:z-[2] -mt-[20px]"
    )}>
      <div className="absolute left-1/2 -top-[180px] translate-x-[-50%] w-full h-[350px] bg-[#fff8] blur-[100px] rounded-full animate-light-blur"></div>
      < Image
        fill
        src={"/co-watching/co-watching.png"}
        alt="background-co_watching"
        className=" object-cover opacity-100 z-[1] [mask-image:linear-gradient(0deg,transparent_0,black)] [-webkit-mask-image:linear-gradient(0deg,transparent_0,black)]"
      />
    </div >
  )
}
