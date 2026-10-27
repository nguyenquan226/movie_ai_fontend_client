import privateAxios from "@/lib/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { createURLPayment } from "@/types/payment.type";

const baseURL = process.env.NEXT_PUBLIC_API_BACKEND_URL;
export const paymentService = {
  createPaymentURL: (
    planId: number
  ): Promise<IBackendRes<createURLPayment>> => {
    return privateAxios.post(`${baseURL}/payments`, { planId });
  },
};
