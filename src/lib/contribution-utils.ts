import type { GitHubContributions } from '../types/github-contributions';
import type { RarityTier } from '../types/rarity';
import { rarityTiers } from '../types/rarity';

export function calculateActiveDays(contributions: GitHubContributions): number {
    const { contributionCalendar } = contributions.data.user.contributionsCollection;
    return contributionCalendar.weeks
        .flatMap(week => week.contributionDays)
        .filter(day => day.contributionCount > 0).length;
}

export function getRarityFromActiveDays(activeDays: number, year: number): RarityTier {
    const daysInYear = new Date(year, 1, 29).getDate() === 29 ? 366 : 365;
    const percent = (activeDays / daysInYear) * 100;
    return (
        rarityTiers.find(tier => percent >= tier.minPercent) || rarityTiers[rarityTiers.length - 1]
    );
}
