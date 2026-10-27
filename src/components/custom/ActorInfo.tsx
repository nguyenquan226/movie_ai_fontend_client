"use client";
import { useState } from "react";
import { Heart, Send } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { formatDate } from "@/lib/dateFomat";
import { useActorStore } from "@/stores/actorStore";

export default function ActorInfo() {
    const [liked, setLiked] = useState(false);
    const { actor } = useActorStore();

    if (!actor) {
        return <div className="text-center py-20">Không có thông tin diễn viên.</div>;
    }

    return (
        <div className="w-full max-w-[320px] mx-auto rounded-2xl p-5 flex flex-col items-center">
            <div className="w-44 h-44 rounded-2xl overflow-hidden mb-4 shadow-md">
                <img
                    src={actor?.avatarUrl || "/images/small.jpg"}
                    alt={actor?.actorName || "Diễn viên"}
                    className="w-full h-full object-cover"
                />
            </div>

            <h3 className="text-xl font-semibold text-foreground text-center mb-4">
                {actor?.actorName || "Chưa rõ tên"}
            </h3>
            {/* <div className="flex items-center justify-center gap-3 mb-6">
                <button
                    onClick={() => {
                        setLiked(!liked);
                    }}
                    className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-full
                                bg-transparent border border-border text-zinc-200 text-xs font-medium
                                hover:bg-secondary hover:text-primary transition-[color,background-color,border-color,opacity,transform,box-shadow]"
                >
                    <Heart size={14} className={liked ? "fill-yellow-400 text-primary" : "fill-none"} />
                    <span className={liked ? "text-primary" : ""} >Yêu thích</span>
                </button>

                <Popover>
                    <PopoverTrigger asChild>
                        <button
                            className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-full
                                        bg-transparent border border-border text-zinc-200 text-xs font-medium
                                        hover:bg-secondary hover:text-primary transition-[color,background-color,border-color,opacity,transform,box-shadow]">
                            <Send size={14} />
                            <span>Chia sẻ</span>
                        </button>
                    </PopoverTrigger>

                    <PopoverContent
                        align="center"
                        side="bottom"
                        sideOffset={10}
                        className="w-auto bg-background text-foreground rounded-2xl border border-border p-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col items-center" >
                        <h2 className="text-center text-base font-semibold mb-3">Chia sẻ</h2>
                        <div className="flex justify-center gap-2">
                            <button className="bg-blue-600 hover:bg-blue-700 rounded-full w-9 h-9 flex items-center justify-center transition-transform hover:scale-110">
                                <i className="fa-brands fa-facebook-f text-foreground text-sm" />
                            </button>
                            <button className="bg-black hover:bg-gray-800 rounded-full w-9 h-9 flex items-center justify-center transition-transform hover:scale-110">
                                <i className="fa-brands fa-x-twitter text-foreground text-sm" />
                            </button>
                            <button className="bg-sky-500 hover:bg-sky-600 rounded-full w-9 h-9 flex items-center justify-center transition-transform hover:scale-110">
                                <i className="fa-brands fa-telegram text-foreground text-sm" />
                            </button>
                            <button className="bg-orange-600 hover:bg-orange-700 rounded-full w-9 h-9 flex items-center justify-center transition-transform hover:scale-110">
                                <i className="fa-brands fa-reddit-alien text-foreground text-sm" />
                            </button>
                            <button className="bg-green-500 hover:bg-green-600 rounded-full w-9 h-9 flex items-center justify-center transition-transform hover:scale-110">
                                <i className="fa-solid fa-share-nodes text-foreground text-sm" />
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div> */}


            <div className="w-full flex flex-col gap-3">
                <div className="text-left">
                    <h3 className="text-base font-semibold text-foreground mb-1">Giới thiệu:</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                        {actor?.shortBio || "Chưa rõ"}
                    </p>
                </div>

                <div className="w-full flex flex-col gap-1 text-sm">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">Giới tính:</h4>
                        <span className="text-muted-foreground hover:text-primary transition">
                            {actor?.genderActor?.valueVi || "Chưa rõ"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">Ngày sinh:</h4>
                        <span className="text-muted-foreground hover:text-primary transition">
                            {formatDate(actor?.birthDate || "") || "Chưa rõ"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
