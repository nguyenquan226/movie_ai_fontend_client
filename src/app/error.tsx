"use client";

import { useRouter } from "next/navigation";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-background px-4 pt-20 text-center">
      <div className="max-w-lg rounded-2xl border border-border bg-card p-8 sm:p-10">
        <h1 className="text-2xl font-semibold text-foreground">Đã xảy ra lỗi</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Không thể tải nội dung này. Bạn có thể thử lại hoặc quay về trang chủ.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="min-h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Thử lại
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="min-h-11 rounded-lg border border-border bg-secondary px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </main>
  );
}
