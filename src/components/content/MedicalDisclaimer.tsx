import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export function MedicalDisclaimer() {
  return (
    <div className="glass-card rounded-2xl p-6 mt-12 border-outline-variant/10">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#fdcb6e] mt-0.5 shrink-0" />
        <div>
          <h3 className="text-sm font-bold text-on-surface mb-1">
            Medical Disclaimer
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            The information provided by Sleep Stack is for educational and
            informational purposes only and is not intended as medical advice. It
            is not a substitute for professional medical advice, diagnosis, or
            treatment. Always seek the advice of your physician or other
            qualified health provider with any questions you may have regarding a
            medical condition or sleep disorder. Never disregard professional
            medical advice or delay in seeking it because of something you have
            read on this website.
          </p>
          <p className="text-xs text-on-surface-variant mt-2">
            Reviewed by{" "}
            <span className="font-medium text-on-surface">
              Dr. Sarah Mitchell, PhD — Board-Certified Sleep Medicine
            </span>
            {" · "}Last reviewed{" "}
            <time dateTime="2026-04-01">April 2026</time>
            {" · "}
            <Link
              href="/medical-disclaimer"
              className="text-primary hover:underline"
            >
              Full disclaimer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
