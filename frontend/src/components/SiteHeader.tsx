import discordIcon from "@/assets/discord_icon.svg";
import githubIcon from "@/assets/github_invertocat_white_clearspace.svg";
import googleDriveIcon from "@/assets/google_drive_icon.png";
import swarmtunesIcon from "@/assets/swarmtunes_icon.webp";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </a>
  );
}

function IconHoverCard({
  label,
  icon,
  links,
}: {
  label: string;
  icon: React.ReactNode;
  links: { label: string; href: string }[];
}) {
  return (
    <Popover>
      <PopoverTrigger
        aria-label={label}
        className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
      >
        {icon}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="center">
        <ul className="flex flex-col gap-1">
          {links.map(({ label: linkLabel, href }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                {linkLabel}
              </a>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-3">
        <span className="font-semibold tracking-tight">
          Unofficial Neuro Karaoke Downloader
        </span>
        <nav className="flex items-center gap-4">
          <IconHoverCard
            label="GitHub"
            icon={<img src={githubIcon} alt="GitHub" className="h-5 w-5" />}
            links={[
              {
                label: "Downloader",
                href: "https://github.com/InfornoFire/unofficial-neuro-kar-downloader",
              },
              {
                label: "Archive Metadata",
                href: "https://github.com/Nyss777/Neuro-Karaoke-Archive-Metadata",
              },
            ]}
          />
          <IconHoverCard
            label="Discord"
            icon={<img src={discordIcon} alt="" className="h-5 w-5" />}
            links={[
              {
                label: "Discord Server",
                href: "https://discord.gg/MZPyedT",
              },
              {
                label: "Project Discussion",
                href: "https://discord.com/channels/574720535888396288/1337588612845539349",
              },
            ]}
          />
          <IconLink
            href="https://drive.google.com/drive/folders/1B1VaWp-mCKk15_7XpFnImsTdBJPOGx7a"
            label="Archive on Google Drive"
          >
            <img src={googleDriveIcon} alt="" className="h-5 w-5" />
          </IconLink>
          <IconLink href="https://swarmtunes.com/" label="SwarmTunes">
            <img src={swarmtunesIcon} alt="SwarmTunes" className="h-5 w-5" />
          </IconLink>
        </nav>
      </div>
    </header>
  );
}
