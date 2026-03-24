import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sleep Stack — Free Sleep Calculators & Tools",
    template: "%s | Sleep Stack",
  },
  description:
    "Free sleep calculators to find your ideal bedtime, wake-up time, and sleep schedule. Science-backed tools including sleep cycle, nap, caffeine, and sleep debt calculators.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://sleepstackapp.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Sleep Stack",
    url: "https://sleepstackapp.com",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
