import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Header from "@/components/layout/header";
import LoginModal from "@/components/modals/loginModal";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./providers/AuthProvider";
import RegisterModal from "@/components/modals/registerModal";
import FlixAIChatDrawer from "@/components/chat/FlixAIChatDrawer";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: {
    default: "ChillFlix",
    template: "%s | ChillFlix",
  },
  description: "Khám phá và xem phim cùng ChillFlix",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
          <LoginModal />
          <RegisterModal />
          <Toaster />
          <FlixAIChatDrawer />
        </AuthProvider>
      </body>
    </html>
  );
}
