"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";

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

type AdsbyGoogleWindow = Window & { adsbygoogle?: unknown[] };

export function AdSlot({ slot, format, className }: AdSlotProps) {
  const { profile } = useUser();
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Pro users never see ads
  if (profile?.subscription_tier === "pro") return null;

  useEffect(() => {
    if (!ref.current) return;

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
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    try {
      const w = window as AdsbyGoogleWindow;
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch (_) {}
  }, [isVisible]);

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
        <ins
          className="adsbygoogle"
          style={{ display: "block", width, height }}
          data-ad-client="ca-pub-5441531660664467"
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
