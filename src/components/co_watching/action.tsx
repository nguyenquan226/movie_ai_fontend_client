"use client";

import { Button } from "@/components/ui/button"
import { CirclePlus, DoorOpen, Radio } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation";

export const Action = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="flex mx-auto items-center justify-center gap-x-8">
        {
          pathname.endsWith("/manage") ? (
            <Link
              href={`/co-watching`}
            >
              <Button
                variant={"outline"}
                className="rounded-full lg:h-15 lg:w-40 h-10 w-34 px-7 cursor-pointer hover:bg-amber-400 hover:border-amber-400 transition-[color,background-color,border-color,opacity,transform,box-shadow] ease duration-150"
              >
                <DoorOpen className="lg:size-5 size-4" />
                <p className="lg:text-lg text-sm">Xem chung</p>
              </Button>
            </Link>
          ) : (
            <Link
              href={`${pathname}/manage`}
            >
              <Button
                variant={"outline"}
                className="rounded-full lg:h-15 lg:w-40 h-10 w-34 px-7 cursor-pointer hover:bg-amber-400 hover:border-amber-400 transition-[color,background-color,border-color,opacity,transform,box-shadow] ease duration-150"
              >
                <Radio className="lg:size-5 size-4" />
                <p className="lg:text-lg text-sm">Quản lý</p>
              </Button>
            </Link>
          )
        }

        <div
          onClick={() => router.push(`/co-watching/create`)}
        >
          <Button
            variant={"ghost"}
            className="rounded-full lg:h-15 lg:w-40 h-10 w-34 px-7 border border-white text-foreground cursor-pointer hover:bg-transparent hover:text-primary hover:border-amber-400 transition-[color,background-color,border-color,opacity,transform,box-shadow] ease duration-150"
          >
            <CirclePlus className="lg:size-5 size-4" />
            <p className="lg:text-lg text-sm">Tạo mới</p>
          </Button>
        </div>
      </div>
    </div>
  )
}
