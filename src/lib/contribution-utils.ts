import type { GitHubContributions } from "../types/github-contributions";
import type { RarityTier } from "../types/rarity";
import { rarityTiers } from "../types/rarity";

export function calculateActiveDays(contributions: GitHubContributions): number {
  const { contributionCalendar } = contributions.data.user.contributionsCollection;
  return contributionCalendar.weeks
    .flatMap(week => week.contributionDays)
    .filter(day => day.contributionCount > 0)
    .length;
}

export function getRarityFromActiveDays(activeDays: number, year: number): RarityTier {
  const daysInYear = (new Date(year, 1, 29).getDate() === 29) ? 366 : 365;
  const percent = (activeDays / daysInYear) * 100;
  return rarityTiers.find(tier => percent >= tier.minPercent) || rarityTiers[rarityTiers.length - 1];
}

export function getTopLanguageColor(contributions: GitHubContributions, year: number): string {
  const reposInYear = contributions.data.user.repositories.nodes
    .filter(repo => {
      const pushedDate = new Date(repo.pushedAt);
      return pushedDate.getFullYear() === year;
    });

  const languages = reposInYear
    .map(repo => repo.languages.nodes[0])
    .filter(Boolean);

  if (!languages.length) return '#4a5568'; // default gray

  const languageCounts = languages.reduce((acc, lang) => {
    if (!lang) return acc;
    acc[lang.name] = (acc[lang.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topLanguage = Object.entries(languageCounts)
    .sort(([langA, a], [langB, b]) => {
      if (b !== a) return b - a;
      return langA.localeCompare(langB);
    })[0]?.[0];

  if (!topLanguage) return '#4a5568';

  return languages.find(l => l?.name === topLanguage)?.color || '#4a5568';
}
