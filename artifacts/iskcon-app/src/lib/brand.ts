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
  mauve: "hsl(332 15% 56%)",
  mauveDark: "hsl(334 13% 48%)",
  plum: "hsl(347 33% 27%)",
  sage: "hsl(82 35% 67%)",
  indigo: "hsl(241 39% 31%)",
  pink: "hsl(335 43% 84%)",
} as const;

export const purposeColorById: Record<number, string> = {
  1: brandTheme.sage,
  2: brandTheme.indigo,
  3: brandTheme.goldDark,
  4: brandTheme.pink,
  5: brandTheme.burgundy,
  6: brandTheme.mauve,
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
