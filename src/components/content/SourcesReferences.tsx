import { ExternalLink, BookMarked } from "lucide-react";

export interface Reference {
  publisher: string;
  title: string;
  url: string;
}

/**
 * Core authoritative sleep-science references. URLs verified May 2026.
 * Citing public-health and sleep-medicine authorities is an E-E-A-T
 * signal expected on health (YMYL) content.
 */
export const CORE_SLEEP_REFERENCES: Reference[] = [
  {
    publisher: "Centers for Disease Control and Prevention",
    title: "About Sleep",
    url: "https://www.cdc.gov/sleep/about/index.html",
  },
  {
    publisher: "National Heart, Lung, and Blood Institute (NIH)",
    title: "Sleep Deprivation and Deficiency",
    url: "https://www.nhlbi.nih.gov/health/sleep-deprivation",
  },
  {
    publisher: "National Institute of Neurological Disorders and Stroke (NIH)",
    title: "Brain Basics: Understanding Sleep",
    url: "https://www.ninds.nih.gov/health-information/public-education/brain-basics/brain-basics-understanding-sleep",
  },
  {
    publisher: "American Academy of Sleep Medicine",
    title: "Healthy Sleep",
    url: "https://sleepeducation.org/healthy-sleep/",
  },
];

interface SourcesReferencesProps {
  references?: Reference[];
}

export function SourcesReferences({
  references = CORE_SLEEP_REFERENCES,
}: SourcesReferencesProps) {
  if (references.length === 0) return null;

  return (
    <section className="py-8" aria-labelledby="sources-heading">
      <div className="flex items-center gap-2 mb-3">
        <BookMarked className="w-5 h-5 text-[#c6bfff]" />
        <h2
          id="sources-heading"
          className="font-headline text-2xl font-bold text-on-surface"
        >
          Sources &amp; References
        </h2>
      </div>
      <p className="text-xs text-on-surface-variant mb-5 max-w-2xl">
        Sleep guidance on this page is grounded in recommendations from the
        following public-health and sleep-medicine authorities.
      </p>
      <ul className="space-y-2">
        {references.map((ref) => (
          <li key={ref.url}>
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-xl px-4 py-3 flex items-start gap-2.5 hover:bg-surface-container-high/50 transition-all group"
            >
              <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0 text-on-surface-variant group-hover:text-[#46eae5] transition-colors" />
              <span>
                <span className="block text-sm font-medium text-on-surface group-hover:text-[#46eae5] transition-colors">
                  {ref.title}
                </span>
                <span className="block text-xs text-on-surface-variant">
                  {ref.publisher}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
