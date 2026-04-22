import { Calendar, Check } from "lucide-react";

interface EditorialBylineProps {
  datePublished: string;
  dateModified: string;
  reviewer?: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function EditorialByline({
  datePublished,
  dateModified,
  reviewer = "Sleep Stack Editorial Team",
}: EditorialBylineProps) {
  const updated = dateModified && dateModified !== datePublished;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant mb-8">
      <span className="inline-flex items-center gap-1.5">
        <Check className="w-3.5 h-3.5 text-[#46eae5]" aria-hidden />
        Reviewed by{" "}
        <span className="font-semibold text-on-surface">{reviewer}</span>
      </span>
      <span aria-hidden className="text-outline-variant/50">
        •
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5" aria-hidden />
        Published{" "}
        <time dateTime={datePublished} className="font-medium text-on-surface">
          {formatDate(datePublished)}
        </time>
      </span>
      {updated && (
        <>
          <span aria-hidden className="text-outline-variant/50">
            •
          </span>
          <span className="inline-flex items-center gap-1.5">
            Updated{" "}
            <time dateTime={dateModified} className="font-medium text-on-surface">
              {formatDate(dateModified)}
            </time>
          </span>
        </>
      )}
    </div>
  );
}
