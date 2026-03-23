import Link from "next/link";

const calculatorLinks = [
  { label: "Sleep Calculator", href: "/" },
  { label: "Sleep Debt", href: "/calculators/sleep-debt" },
  { label: "Nap Calculator", href: "/calculators/nap-calculator" },
  { label: "Caffeine Cutoff", href: "/calculators/caffeine-cutoff" },
  { label: "Shift Worker", href: "/calculators/shift-worker" },
  { label: "Baby Sleep", href: "/calculators/baby-sleep" },
  { label: "Chronotype Quiz", href: "/calculators/chronotype-quiz" },
];

const resourceLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Sleep Statistics 2026", href: "/statistics" },
  { label: "All Calculators", href: "/calculators" },
  { label: "Baby Sleep Schedules", href: "/baby-sleep-schedule/newborn-sleep-schedule" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Pricing", href: "/signup" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Medical Disclaimer", href: "/medical-disclaimer" },
];

export function Footer() {
  return (
    <footer className="w-full py-12 px-6 md:px-8 border-t border-outline-variant/15 bg-[#121222]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="text-xl font-bold text-on-surface font-headline mb-4">
            Drift Sleep
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed font-body max-w-xs">
            Built for better sleep. Science-backed tools to help you wake up
            refreshed every morning.
          </p>
        </div>

        {/* Calculators */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-[#46eae5]">
            Calculators
          </h4>
          {calculatorLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-2"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-[#46eae5]">
            Resources
          </h4>
          {resourceLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-2"
            >
              {link.label}
            </Link>
          ))}
          <h4 className="text-xs font-bold uppercase tracking-widest mb-4 mt-6 text-[#46eae5]">
            Company
          </h4>
          {companyLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-2"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-[#46eae5]">
            Legal
          </h4>
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-2"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-outline-variant/10 text-center max-w-7xl mx-auto">
        <p className="text-sm text-on-surface-variant">
          &copy; {new Date().getFullYear()} Drift Sleep. Built for better sleep.
        </p>
      </div>
    </footer>
  );
}
