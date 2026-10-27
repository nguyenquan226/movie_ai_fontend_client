"use client"
import { useState } from "react"
import { Heart, Send } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { useProducerStore } from "@/stores/producerStore"

export default function ProducerInfo() {
    const [liked, setLiked] = useState(false)
    const { producer } = useProducerStore()
    if (!producer) {
        return <div className=" py-20">Không có thông tin nhà sản xuất.</div>
    }
    return (
        <div className="w-full max-w-[320px] rounded-2xl p-2 flex flex-col ">
            <h3 className="text-xl font-semibold text-foreground mb-2">{producer?.producerName || "Chưa rõ tên"}</h3>
        </div>
    )
}
