import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
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
  verification: {
    google: "QpylYLOm8El8MURIHk_O_YQb5wdHMmmniPWBXB0zGh0",
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
      <head>
        <meta name="google-site-verification" content="QpylYLOm8El8MURIHk_O_YQb5wdHMmmniPWBXB0zGh0" />
      </head>
      <body className="min-h-screen">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EGD46MYNEE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EGD46MYNEE');
          `}
        </Script>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
