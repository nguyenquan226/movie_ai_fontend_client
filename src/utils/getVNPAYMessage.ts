import { VNPAY_ERROR_MESSAGES } from "@/constants/messages/vnpayErrorMessages";

export function getVnpayMessage(code: string): string {
  return VNPAY_ERROR_MESSAGES[code] || "Lỗi không xác định.";
}
