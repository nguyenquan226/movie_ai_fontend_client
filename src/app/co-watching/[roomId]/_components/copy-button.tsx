"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { CheckCheck, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

export const CopyButton = () => {
  const pathname = usePathname();
  const [isCopied, setIsCopied] = useState(false);


  const onCopy = () => {
    if (!pathname) return;

    setIsCopied(true);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    navigator.clipboard.writeText(new URL(pathname, baseUrl).toString());
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }

  const Icon = isCopied ? CheckCheck : Copy;

  return (
    <Button
      onClick={onCopy}
      disabled={!pathname || isCopied}
      variant={"ghost"}
      size={"sm"}
      className="hover:bg-amber-400 hover:text-black"
    >
      <Icon className="md:size-4 size-3" />
      <span className="md:text-sm text-xs">Chia sẻ</span>
    </Button>
  )
}
