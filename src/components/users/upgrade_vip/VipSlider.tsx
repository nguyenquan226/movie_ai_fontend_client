"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { plan } from "@/types/subcsciptionPlan.type";
import { VIPFeatures } from "@/data/vipFeaturesData";
import { Check } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { Button } from "@/components/ui/button";

export default function VipSilder({
  planList,
  selectedPackage,
  setSelectedPackage,
}: {
  planList: plan[];
  selectedPackage: number;
  setSelectedPackage: (pkgId: number) => void;
}) {
  return (
    <>
      <section className="py-10 px-4 !overflow-visible m-auto">
        <Swiper
          modules={[Pagination]}
          pagination={{ enabled: false }}
          spaceBetween={24}
          slidesPerView={1.3}
          centeredSlides={true}
          centeredSlidesBounds={true} // Quan trọng
          loop={true}
          loopAdditionalSlides={planList.length} //Fix lệch khi loop
          initialSlide={planList.findIndex((p) => p.planId === selectedPackage)} //Đặt đúng slide giữa
          breakpoints={{
            640: { slidesPerView: 2.1 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12 !overflow-visible"
        >
          {planList.map((pkg) => (
            <SwiperSlide key={pkg.planId}>
              <div
                onClick={() => setSelectedPackage(pkg.planId)}
                className={`relative rounded-3xl p-6 cursor-pointer transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300
                    backdrop-blur-xl border
                    ${
                      selectedPackage === pkg.planId
                        ? "border-primary shadow-[0_0_40px_rgba(255,215,0,0.55)] scale-[1.04] z-20"
                        : "border-border/70 hover:border-primary/40 hover:scale-[1.02]"
                    }
                    bg-gradient-to-b from-[#1b1f2a] to-[#0d0f14]
                  `}
              >
                <h3 className="text-foreground font-bold text-2xl mb-1 tracking-wide">
                  {`${
                    pkg.planDuration === 9999
                      ? "Vĩnh viễn"
                      : `${pkg.planDuration} ${pkg.durationInfo.valueVi}`
                  }`}
                </h3>

                {/* Price */}
                <div className="flex items-end gap-2 mb-3">
                  <p className="text-primary text-3xl font-extrabold leading-none">
                    {formatPrice(parseInt(pkg.price))} VNĐ
                  </p>
                </div>

                {/* VIPFeatures */}
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  {VIPFeatures.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Select Button */}
                <Button
                  size="sm"
                  className={`w-full font-bold py-2 rounded-xl transition-[color,background-color,border-color,opacity,transform,box-shadow] ${
                    selectedPackage === pkg.planId
                      ? "bg-primary text-black hover:bg-primary"
                      : "bg-card/70 text-foreground border border-white/20 hover:bg-white/20"
                  }`}
                >
                  {selectedPackage === pkg.planId ? "✓ Đã chọn" : "Chọn gói"}
                </Button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </>
  );
}
