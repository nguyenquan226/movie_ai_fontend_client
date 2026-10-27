"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useActorStore } from "@/stores/actorStore";
import ActorInfo from "@/components/custom/ActorInfo";
import FilmActor from "@/components/custom/FilmActor";

export default function ActorDetail() {
    const actorSlug = useParams().actorSlug as string;
    const {
        isLoadingActor,
        isLoadingFilmActor,
        fetchActorDetailBySlug,
        fetchFilmsByActorSlug,
        actor,
        filmActorData,
        error,
    } = useActorStore();

    useEffect(() => {
        if (!actorSlug) return;
        fetchActorDetailBySlug(actorSlug);
        fetchFilmsByActorSlug(actorSlug);
    }, [actorSlug]);

    if (isLoadingActor || isLoadingFilmActor)
        return <div className="text-center py-20">Đang tải thông tin diễn viên...</div>;

    if (error)
        return <div className="text-center py-20 text-red-500">{error}</div>;

    if (!actor)
        return <div className="text-center py-20">Không tìm thấy thông tin diễn viên.</div>;

    if (!filmActorData) {
        return (
            <div className="text-center py-20">Diễn viên này chưa tham gia bộ phim nào.</div>
        );
    }
    return (
        <main className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden pt-[72px]">
            <section className="relative flex-1 w-full">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-16 gap-8 lg:gap-12 items-start justify-center">
                        <div className="lg:col-span-4 flex justify-center border-b lg:border-b-0 lg:border-r border-border pb-6 lg:pb-0 lg:pr-6">
                            <ActorInfo />
                        </div>
                        <div className="lg:col-span-12 flex flex-col gap-8 mt-8 lg:mt-0">
                            <FilmActor />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
