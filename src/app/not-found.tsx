"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-background px-4 pt-20">
      <div className="flex w-full max-w-lg flex-col items-center gap-5 rounded-2xl border border-border bg-card p-8 text-center sm:p-10">
        <AlertTriangle aria-hidden="true" className="h-12 w-12 text-primary" />

        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Không tìm thấy trang
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Có vẻ như bạn đã đi lạc vào một góc tối nào đó của ChillFlix.
          </p>
        </div>

        <Button
          onClick={() => router.push("/")}
          className="min-h-11 bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Quay về trang chủ
        </Button>
      </div>
    </main>
  );
}
