import { AllCodeRow } from "./allcode.type";

export interface IPlans {
  plans: plan[];
}

export interface plan {
  planId: number;
  durationInfo: AllCodeRow;
  isActive: boolean;
  planDuration: number;
  planName: string;
  price: string;
}
