"use client";

import Image from "next/image";
import { Mail, Send, Gamepad2, Eye, Instagram } from "lucide-react";
import { footerDescriptionContent, partners } from "@/data/footerData";
import { useAppRouter } from "@/hooks/useAppRouter";

export default function Footer() {
  const { goHome } = useAppRouter();

  return (
    <footer className="bg-[#0f1419] border-t border-[#1a1f2e] left-0 w-full flex flex-col pt-4">
      {/* Vietnam Flag Banner */}
      <div className="px-4 py-3 flex items-center justify-center">
        <div className="relative backdrop-blur-md bg-[#d62828]/90 border border-[#ff4d4d]/40 shadow-[0_6px_25px_rgba(214,40,40,0.6)] rounded-[22px] px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 transform-gpu hover:scale-105 hover:shadow-[0_10px_35px_rgba(255,77,77,0.8)] hover:border-[#ff6666]/60">
          {/* Hiệu ứng ánh sáng nhẹ phía trên */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent rounded-[22px] pointer-events-none"></div>

          {/* Cờ Việt Nam */}
          <div className="flag-vn flex-shrink-0">
            <Image
              src="/images/vn_flag.svg"
              width={36}
              height={36}
              alt="Viet Nam"
              className="drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9"
            />
          </div>

          {/* Dòng chữ khẩu hiệu */}
          <span className="text-foreground font-bold tracking-wide drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)] select-none text-xs sm:text-sm md:text-base">
            Hoàng Sa & Trường Sa là của Việt Nam!
          </span>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12 px-4">
          {/* Brand Section */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <div className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-[#f5d547] rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-[#0f1419] rounded-full flex items-center justify-center">
                  <span
                    onClick={goHome}
                    className="text-[#d4af37] font-bold cursor-pointer"
                  >
                    ▶
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-foreground font-bold">ChillFlix</h3>
                <p className="text-muted-foreground text-xs">
                  Cảm xúc điện ảnh, chill từng phút giây
                </p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 pt-4 justify-center sm:justify-start">
              {[Send, Gamepad2, Eye, Mail, Eye, Instagram].map((Icon, i) => (
                <button
                  key={i}
                  className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-accent transition cursor-pointer"
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="space-y-3">
            <h4 className="text-foreground font-semibold">Hỗ Trợ</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition inline-block py-1"
                >
                  Hỏi Đáp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition inline-block py-1"
                >
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition inline-block py-1"
                >
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="space-y-3">
            <h4 className="text-foreground font-semibold">Về Chúng Tôi</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition inline-block py-1"
                >
                  Giới thiệu
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition inline-block py-1"
                >
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div className="space-y-3">
            <h4 className="text-foreground font-semibold">Đối Tác</h4>
            <ul className="space-y-2">
              {partners.map((partner, index) => {
                return (
                  <li key={index}>
                    <a
                      href={partner.href}
                      className="text-muted-foreground hover:text-primary transition inline-block py-1"
                    >
                      {partner.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Description */}
        <div className="border-t border-[#1a1f2e] pt-6 sm:pt-8 w-full px-4">
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
            {footerDescriptionContent}
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#1a1f2e] mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-muted-foreground/70 text-xs sm:text-sm">
            &copy; 2025 ChillFlix - Dự án chỉ cho mục đích học tập
          </p>
        </div>
      </div>
    </footer>
  );
}
