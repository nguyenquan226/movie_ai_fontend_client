import { ListProps } from "@/components/co_watching/list";
import privateAxios from "@/lib/privateAxios";
import publicAxios from "@/lib/publicAxios";
import { IBackendRes } from "@/types/backend.type";
import { getAllStreamRes, roomData, roomPayload, roomRes } from "@/types/co_watching.type";

const roomServices = {
  createRoom: (payload: roomPayload): Promise<IBackendRes<roomData>> => {
    return privateAxios.post("/co-watching", payload);
  },

  getAllStream: (
    current: number,
    pageSize: number,
    query: ListProps['query'],
  ): Promise<IBackendRes<getAllStreamRes>> => {
    return publicAxios.get(`/co-watching`, {
      params: {
        current,
        pageSize,
        ...(query.isLive !== undefined && { isLive: query.isLive }),
        ...(query.hostId !== undefined && { hostId: query.hostId }),
        ...(query.isMain !== undefined && { isMain: query.isMain }),
      }
    });
  },

  getRoomData: (roomId: string): Promise<IBackendRes<roomData>> => {
    return privateAxios.get(`/co-watching/${roomId}`);
  },

  updateRoom: (
    roomId: string,
    data: Partial<roomRes>
  ): Promise<IBackendRes<roomRes>> => {
    return privateAxios.patch(`/co-watching/${roomId}`, data)
  },
}

export default roomServices;