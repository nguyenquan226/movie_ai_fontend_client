import privateAxios from "@/lib/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { IPlans } from "@/types/subcsciptionPlan.type";

const baseURL = process.env.NEXT_PUBLIC_API_BACKEND_URL;
export const subsciptionPlanService = {
  getSubscriptionsPlanList: (): Promise<IBackendRes<IPlans>> => {
    return privateAxios.get(`${baseURL}/subscription-plans`);
  },
  getUserVipPlanInfor: () => {
    return privateAxios.get(`${baseURL}/subscriptions/get-by-id`);
  },
};
