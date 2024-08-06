"use client";

import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Tick } from "./icons";

const copyButtonVariants = cva(
  "relative group rounded-full p-1.5 transition-all duration-75",
  {
    variants: {
      variant: {
        default:
          "bg-black hover:scale-105 hover:bg-custom-black-100 active:scale-95 text-white hover:text-custom-white-100",
        neutral: "bg-transparent hover:bg-gray-100 active:bg-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function CopyButton({
  variant = "default",
  value,
  className,
  icon,
}: {
  value: string;
  className?: string;
  icon?: LucideIcon;
} & VariantProps<typeof copyButtonVariants>) {
  const [copied, setCopied] = useState(false);
  const Comp = icon || Copy;
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setCopied(true);
        navigator.clipboard.writeText(value).then(() => {
          toast.success("Copied to clipboard!");
        });
        setTimeout(() => setCopied(false), 3000);
      }}
      className={cn(copyButtonVariants({ variant }), className)}
    >
      <span className="sr-only">Copy</span>
      {copied ? (
        <Tick className="h-3.5 w-3.5" />
      ) : (
        <Comp className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
