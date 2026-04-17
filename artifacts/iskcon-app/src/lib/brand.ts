export const brandTheme = {
  burgundy: "hsl(343 51% 38%)",
  burgundyDark: "hsl(344 34% 27%)",
  burgundySoft: "hsl(343 39% 90%)",
  cream: "hsl(40 90% 78%)",
  creamSoft: "hsl(40 92% 88%)",
  creamSurface: "hsl(40 78% 91%)",
  gold: "hsl(41 96% 73%)",
  goldDark: "hsl(38 100% 39%)",
  orangeBadge: "hsl(29 100% 43%)",
  mauve: "hsl(338 14% 47%)",
  mauveDark: "hsl(336 22% 41%)",
  plum: "hsl(334 26% 31%)",
  sage: "hsl(84 79% 18%)",
  indigo: "hsl(240 39% 29%)",
  pink: "hsl(240 39% 29%)",
  peach: "hsl(27 81% 75%)",
  lavender: "hsl(241 54% 78%)",
  black: "hsl(0 0% 4%)",
} as const;

export const purposeColorById: Record<number, string> = {
  1: brandTheme.sage,
  2: brandTheme.lavender,
  3: brandTheme.black,
  4: brandTheme.pink,
  5: brandTheme.peach,
  6: brandTheme.orangeBadge,
  7: brandTheme.plum,
};

export const purposeColorByTitle: Record<string, string> = {
  "Simple Living": purposeColorById[1],
  "Community": purposeColorById[2],
  "Holy Place": purposeColorById[3],
  "Accessing": purposeColorById[4],
  "Learning": purposeColorById[5],
  "Applying": purposeColorById[6],
  "Sharing": purposeColorById[7],
};

export function withAlpha(color: string, alpha: number) {
  return color.replace("hsl(", "hsl(").replace(")", ` / ${alpha})`);
}
