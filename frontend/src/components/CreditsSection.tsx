import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import {
  ART_CREDITS,
  type ArtCredit,
  CONTRIBUTORS,
  type Contributor,
} from "@/data/credits";

function ArtCreditRow({ credit }: { credit: ArtCredit }) {
  return (
    <li className="text-sm">
      <HoverCard openDelay={100} closeDelay={100}>
        <div className="flex items-center gap-3 rounded px-1 py-1">
          <HoverCardTrigger className="font-medium underline-offset-2 hover:underline cursor-pointer">
            {credit.name}
          </HoverCardTrigger>
          <span className="text-muted-foreground">{credit.discs}</span>
        </div>
        <HoverCardContent className="w-auto p-2" align="start">
          <ul className="flex flex-col gap-1">
            {credit.links.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </HoverCardContent>
      </HoverCard>
    </li>
  );
}

function ContributorRow({ contributor }: { contributor: Contributor }) {
  return (
    <li className="text-sm">
      <div className="flex items-center gap-3 rounded px-1 py-1">
        <span className="font-medium">{contributor.name}</span>
        {contributor.discord && (
          <span className="text-muted-foreground">{contributor.discord}</span>
        )}
      </div>
    </li>
  );
}

export function CreditsSection() {
  return (
    <section className="mx-auto w-full max-w-4xl space-y-10 px-6 py-16">
      <Separator />

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Art Credits</h2>
        <ul className="space-y-1">
          {ART_CREDITS.map((credit) => (
            <ArtCreditRow key={credit.name} credit={credit} />
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Contributors</h2>
        <ul className="space-y-1">
          {CONTRIBUTORS.map((contributor) => (
            <ContributorRow key={contributor.name} contributor={contributor} />
          ))}
        </ul>
      </div>

      <Separator />

      <p className="text-center text-xs text-muted-foreground">
        Unofficial Neuro KAR Downloader is not affiliated with Vedal or
        Neurosama.
      </p>
    </section>
  );
}
