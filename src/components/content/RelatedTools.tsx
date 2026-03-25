import Link from "next/link";
import { Calculator, Moon, Coffee, Clock, Baby, Brain, CloudSun, Plane, Star, Sun, BookOpen, Zap } from "lucide-react";

const tools = [
  {
    label: "Sleep Calculator",
    href: "/",
    icon: Moon,
    description: "Find your ideal bedtime",
  },
  {
    label: "Sleep Debt",
    href: "/calculators/sleep-debt",
    icon: Calculator,
    description: "Track your sleep deficit",
  },
  {
    label: "Nap Calculator",
    href: "/calculators/nap-calculator",
    icon: Clock,
    description: "Optimize your naps",
  },
  {
    label: "Caffeine Cutoff",
    href: "/calculators/caffeine-cutoff",
    icon: Coffee,
    description: "Know when to stop caffeine",
  },
  {
    label: "Baby Sleep",
    href: "/calculators/baby-sleep",
    icon: Baby,
    description: "Age-based sleep schedules",
  },
  {
    label: "Chronotype Quiz",
    href: "/calculators/chronotype-quiz",
    icon: Brain,
    description: "Discover your sleep type",
  },
  {
    label: "Tonight's Forecast",
    href: "/tonight",
    icon: CloudSun,
    description: "Live sleep environment score",
  },
  {
    label: "Circadian Light Guide",
    href: "/tools/circadian-guide",
    icon: Sun,
    description: "Personalised light schedule",
  },
  {
    label: "Jet Lag Calculator",
    href: "/tools/jet-lag-calculator",
    icon: Plane,
    description: "Day-by-day recovery plan",
  },
  {
    label: "Sleep Score",
    href: "/tools/sleep-score",
    icon: Zap,
    description: "Rate last night's sleep",
  },
  {
    label: "Moon & Sleep",
    href: "/tools/moon-sleep",
    icon: Star,
    description: "Lunar phase sleep tracker",
  },
  {
    label: "Sleep Journal",
    href: "/tools/sleep-journal",
    icon: BookOpen,
    description: "Track your sleep over time",
  },
];

interface RelatedToolsProps {
  exclude?: string;
}

export function RelatedTools({ exclude }: RelatedToolsProps) {
  const filtered = tools.filter((tool) => tool.href !== exclude);

  return (
    <section className="py-12">
      <h2 className="font-headline text-2xl font-bold mb-6 text-on-surface">
        More Sleep Tools
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="glass-card rounded-2xl p-5 hover:bg-surface-container-high/50 transition-all group"
          >
            <tool.icon className="w-5 h-5 text-[#c6bfff] mb-3 group-hover:text-[#46eae5] transition-colors" />
            <h3 className="font-headline font-bold text-sm text-on-surface mb-1">
              {tool.label}
            </h3>
            <p className="text-xs text-on-surface-variant">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
