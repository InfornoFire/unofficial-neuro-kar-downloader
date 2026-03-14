import { ChevronDown } from "lucide-react";
import { CreditsSection } from "@/components/CreditsSection";
import { DownloadPanel } from "@/components/DownloadPanel";
import { SiteHeader } from "@/components/SiteHeader";

export function App() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6 py-16">
          <DownloadPanel />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground/50">
            <ChevronDown size={20} />
          </div>
        </section>
        <CreditsSection />
      </main>
    </div>
  );
}
