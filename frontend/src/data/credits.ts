export interface CreditLink {
  label: string;
  href: string;
}

export interface ArtCredit {
  name: string;
  discs: string;
  links: CreditLink[];
}

export interface Contributor {
  name: string;
  discord?: string;
  links?: CreditLink[];
}

export const ART_CREDITS: ArtCredit[] = [
  {
    name: "paccha",
    discs: "DISC 1, 3 & 5",
    links: [
      { label: "Twitter/X", href: "https://twitter.com/paccha_7" },
      { label: "Pixiv", href: "https://www.pixiv.net/en/users/96121842" },
      { label: "Linktree", href: "https://linktr.ee/paccha_" },
      {
        label: "Artwork (DISC 1)",
        href: "https://drive.google.com/file/d/18nQELCYAKFgssm2REsYMsO-MqnDXQ4v7/view",
      },
      {
        label: "Artwork (DISC 3)",
        href: "https://twitter.com/paccha_7/status/1828697805008834639",
      },
      {
        label: "Artwork (DISC 5)",
        href: "https://drive.google.com/file/d/16jm9PahG5O672oiz0osJVrroeeqxD989/view",
      },
    ],
  },
  {
    name: "kapxapius",
    discs: "DISC 2",
    links: [
      { label: "Twitter/X", href: "https://twitter.com/kapxapius" },
      { label: "Instagram", href: "https://www.instagram.com/kapxapius/" },
      { label: "Pixiv", href: "https://www.pixiv.net/en/users/85622115" },
      {
        label: "Artwork (DISC 2)",
        href: "https://www.pixiv.net/en/artworks/111021253",
      },
    ],
  },
  {
    name: "ppchan",
    discs: "DISC 4",
    links: [
      { label: "Twitter/X", href: "https://twitter.com/pinkpink939" },
      { label: "Bilibili", href: "https://space.bilibili.com/179061053" },
      {
        label: "Artwork (DISC 4)",
        href: "https://discord.com/channels/574720535888396288/1186300734262755348/1186300734262755348",
      },
    ],
  },
  {
    name: "koilccc",
    discs: "DISC 6",
    links: [
      { label: "Twitter/X", href: "https://twitter.com/koilccc" },
      {
        label: "Bluesky",
        href: "https://bsky.app/profile/koilccc.bsky.social",
      },
      {
        label: "Artwork (DISC 6)",
        href: "https://twitter.com/koilccc/status/1866019791376658504",
      },
    ],
  },
  {
    name: "copper1ion",
    discs: "DISC 6 (Song 73)",
    links: [
      { label: "Twitter/X", href: "https://twitter.com/Cooper1ion" },
      { label: "YouTube", href: "https://www.youtube.com/@Copper1ion-k8h" },
      { label: "Bilibili", href: "https://space.bilibili.com/288988154" },
      {
        label: "Artwork (DISC 6, Song 73)",
        href: "https://www.youtube.com/watch?v=fkBe1omx2JE",
      },
    ],
  },
  {
    name: "nostyx",
    discs: "DISC 7",
    links: [
      { label: "Twitter/X", href: "https://twitter.com/nostyx_x" },
      { label: "Linktree", href: "https://linktr.ee/nostyx_x" },
      {
        label: "Artwork (DISC 7)",
        href: "https://twitter.com/nostyx_x/status/1925937141307093273",
      },
    ],
  },
  {
    name: "lukuwo",
    discs: "DISC 8",
    links: [
      { label: "Twitter/X", href: "https://twitter.com/lukuwo2333" },
      { label: "Bilibili", href: "https://space.bilibili.com/626079830" },
      {
        label: "Artwork (DISC 8)",
        href: "https://twitter.com/lukuwo2333/status/1959998256127365505",
      },
    ],
  },
  {
    name: "tanhuluu",
    discs: "DISC 66",
    links: [
      { label: "Twitter/X", href: "https://twitter.com/tanhuluu" },
      { label: "YouTube", href: "https://www.youtube.com/@Tanhuluu" },
      {
        label: "Artwork (DISC 66)",
        href: "https://twitter.com/tanhuluu/status/1853270685168394616",
      },
    ],
  },
];

export const CONTRIBUTORS: Contributor[] = [
  { name: "mm2wood", discord: "@ninjakai03" },
  { name: "Nyss7", discord: "@nyss_7" },
  { name: "TuruuMGL", discord: "@turuumgl" },
  { name: "Inforno", discord: "@inforno_fire" },
];
