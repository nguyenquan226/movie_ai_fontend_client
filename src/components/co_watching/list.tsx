"use client";

import { Card } from "./card"
import { useEffect, useRef, useState } from "react";
import roomServices from "@/services/co-watching/roomService";
import { roomPaginate } from "@/types/co_watching.type";

export interface ListProps {
  query: {
    isLive?: boolean;
    hostId?: number;
    isMain?: boolean;
  };
}

export const List = ({ query }: ListProps) => {
  const [list, setList] = useState<roomPaginate[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRef = useRef(null);

  const handleGetList = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const res = await roomServices.getAllStream(page, 8, query);
    if (res.EC === 0 && res.data) {
      const newList = res.data.list
      setList((prev) => [...prev, ...newList]);

      const metaData = res.data.meta;
      if (metaData.current === metaData.pages || newList.length === 0) {
        setHasMore(false);
      }

    } else {
      console.log(">>> Error get list stream: ", res.EM);
    }
    setLoading(false);
  }

  useEffect(() => {
    handleGetList();
  }, [page]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entities) => {
        if (entities[0].isIntersecting && !loading) {
          setPage((prev) => prev + 1);
        }
      }, { threshold: 1 }
    )

    const currentRef = loadMoreRef.current;
    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    }
  }, [loading, hasMore]);

  return (
    <div>
      {list.length === 0 && (
        <div className="flex flex-wrap items-center justify-center text-primary font-semibold text-sm lg:text-lg lg:mt-4 mt-8">
          Không có phòng live nào!
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 pb-20">
        {
          list.map((item, i) => (
            <Card
              key={i}
              thumbUrl={item.thumbUrl}
              name={item.name}
              createdAt={item.createdAt}
              filmTitle={item.film.title}
              view={100}
              hostName={item.host.fullName}
              roomId={item.roomId}
              isLive={item.isLive}
            />
          ))
        }

        <div ref={loadMoreRef} className=""></div>
        {loading && (
          <div>Đang tải</div>
        )}
      </div>
    </div>
  )
}
