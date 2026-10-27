"use client";

import { Check, StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { paymentService } from "@/services";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/layout/loadingSpinner";
import { useAuthStore } from "@/stores/authStore";

import { useAppRouter } from "@/hooks/useAppRouter";
import { plan } from "@/types/subcsciptionPlan.type";
import { VIPFeatures } from "@/data/vipFeaturesData";
import { UpgradeVipMessage } from "@/constants/messages/user.message";
import { VNPAY_ERROR_MESSAGES } from "@/constants/messages/vnpayErrorMessages";
import { toast } from "sonner";
import { getVnpayMessage } from "@/utils/getVNPAYMessage";
import VipBenifitBanner from "@/components/users/upgrade_vip/VIPBenefitsBanner";
import VipSilder from "@/components/users/upgrade_vip/VipSlider";
import UserStatusInfor from "@/components/users/upgrade_vip/UserStatusInfor";
import { IUser } from "@/types/user.type";
import { subsciptionPlanService } from "@/services/subscriptionPlanService";
import VipPlanInfo from "@/components/users/upgrade_vip/VipPlanIfor";

export default function VipUpgradeContent() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [planList, setPlanList] = useState<plan[]>([]);
  const [vipPlan, setVipPlan] = useState<plan>();
  const { replaceToHome } = useAppRouter();
  const { authUser, isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchPlanList();
    fetchUserPlanInfor();
  }, [authUser]);

  useEffect(() => {
    const statusResponse = searchParams.get("responseCode");
    const fromVNPay = Boolean(localStorage.getItem("from_VNPAY"));

    if (statusResponse === "00" && fromVNPay) {
      toast.success(getVnpayMessage(statusResponse));
      localStorage.removeItem("from_VNPAY");
      // replaceToHome();
    } else {
      if (statusResponse !== null && fromVNPay) {
        toast.error(getVnpayMessage(statusResponse));
      }
    }
  }, []);

  useEffect(() => {
    const isAuth = useAuthStore.getState().isAuthenticated;
    if (!isAuth) {
      replaceToHome();
    }
  });

  const fetchPlanList = async () => {
    const res = await subsciptionPlanService.getSubscriptionsPlanList();
    if (res && res.EC === 1) {
      setPlanList(res.data?.plans || []);
      setSelectedPackage(res.data?.plans[0].planId || 2);
    } else {
      setPlanList([]);
    }
  };

  const fetchUserPlanInfor = async () => {
    const res = await subsciptionPlanService.getUserVipPlanInfor();
    if (res && res.EC === 1) {
      setVipPlan(res.data.plan);
    }
  };

  const handleUpgrade = async () => {
    const selected = planList.find((pkg) => pkg.planId === selectedPackage);
    if (!selected) {
      toast.warning("Vui lòng chọn gói VIP trước khi nhấn thanh toán");
    }
    if (selected?.planId !== undefined) {
      const res = await paymentService.createPaymentURL(selected?.planId);
      if (res && res.EC === 1) {
        setIsLoading(true);
        const redirectURL = res.data?.metadata.redirectUrl;
        if (redirectURL) {
          localStorage.setItem("from_VNPAY", "true");
          router.push(redirectURL);
        } else {
          alert("Không lấy được link thanh toán");
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        toast.error("Hiện tại bạn đã đăng ký gói VIP");
      }
    }
  };

  console.log("check state", vipPlan);

  return (
    <div className="w-full pt-[80px]">
      {isLoading && <LoadingSpinner />}

      {/* Introduce */}
      {authUser.isVip === false ? (
        <>
          <section className="py-8 px-4 text-center ">
            <h1 className="text-4xl font-extrabold text-primary drop-shadow-[0_0_12px_rgba(255,215,0,0.7)]">
              Tài khoản ChillFlix VIP
            </h1>
            <p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto">
              Nâng cấp để mở khóa quyền lợi và trải nghiệm xem phim không giới
              hạn
            </p>
          </section>
        </>
      ) : (
        <></>
      )}
      <UserStatusInfor userInfor={authUser as IUser} />
      {authUser.isVip === true ? <VipPlanInfo vipPlanUser={vipPlan} /> : <></>}

      {/* Confirm Purchase */}
      {authUser.isVip === false || authUser.isVip === null ? (
        <>
          <VipBenifitBanner />
          <VipSilder
            planList={planList}
            setSelectedPackage={setSelectedPackage}
            selectedPackage={selectedPackage}
          />{" "}
          <div className="text-center pb-10">
            <Button
              onClick={handleUpgrade}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:scale-105 font-bold py-3 px-10 rounded-xl transition-[color,background-color,border-color,opacity,transform,box-shadow] cursor-pointer"
            >
              Thanh Toán Ngay
            </Button>
            <p className="text-muted-foreground/70 text-xs mt-3">
              Bạn có thể hủy bất kỳ lúc nào — không phí phát sinh.
            </p>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
