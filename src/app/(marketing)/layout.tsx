import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSlot } from "@/components/layout/AdSlot";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex justify-center px-4 py-2">
        {/* TODO: replace with your AdSense leaderboard slot ID from adsense.google.com → Ads → Ad units */}
        <AdSlot slot="LEADERBOARD_SLOT_ID" format="leaderboard" />
      </div>
      <main className="pt-20 min-h-screen">{children}</main>
      <div className="flex justify-center px-4 py-4">
        {/* TODO: replace with your AdSense rectangle slot ID from adsense.google.com → Ads → Ad units */}
        <AdSlot slot="RECTANGLE_SLOT_ID" format="rectangle" />
      </div>
      <Footer />
    </>
  );
}
