"use client";

import { useEffect, useRef, useState } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { cn } from "@/lib/utils";

const AD_DIMENSIONS = {
  leaderboard: { width: 728, height: 90 },
  rectangle: { width: 300, height: 250 },
  mobile: { width: 320, height: 100 },
} as const;

type AdFormat = keyof typeof AD_DIMENSIONS;

interface AdSlotProps {
  slot: string;
  format: AdFormat;
  className?: string;
}

export function AdSlot({ slot, format, className }: AdSlotProps) {
  const { isPro } = useSubscription();
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isPro || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isPro]);

  if (isPro) return null;

  const { width, height } = AD_DIMENSIONS[format];

  return (
    <div
      ref={ref}
      className={cn(
        "w-full flex flex-col items-center justify-center",
        "bg-surface-container-lowest/30 rounded-2xl",
        "border border-outline-variant/5",
        className
      )}
      style={{ minHeight: height }}
    >
      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/30 py-1">
        Advertisement
      </p>
      {isVisible && (
        <div
          data-ad-slot={slot}
          style={{ minHeight: height, minWidth: width }}
        />
      )}
    </div>
  );
}
