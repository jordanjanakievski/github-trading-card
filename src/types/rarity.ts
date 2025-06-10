export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

export interface RarityTier {
  name: Rarity;
  color: string;
  minPercent: number;
}

export const rarityTiers: RarityTier[] = [
  { name: "Legendary", color: "#ffd700", minPercent: 75 },
  { name: "Epic", color: "#9b59b6", minPercent: 50 },
  { name: "Rare", color: "#3498db", minPercent: 25 },
  { name: "Uncommon", color: "#2ecc71", minPercent: 10 },
  { name: "Common", color: "#95a5a6", minPercent: 0 }
];
