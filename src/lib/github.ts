import type { GitHubContributions } from '../types/github-contributions';

export function calculateActiveDays(contributions: GitHubContributions): number {
    return contributions.data.user.contributionsCollection.contributionCalendar.weeks
        .flatMap((week: { contributionDays: any }) => week.contributionDays)
        .filter((day: { contributionCount: number }) => day.contributionCount > 0).length;
}

export async function fetchGitHubContributions(
    username: string,
    token: string,
    year: number = new Date().getFullYear()
): Promise<GitHubContributions> {
    const startDate = `${year}-01-01T00:00:00`;
    const endDate = `${year}-12-31T23:59:59`;

    const query = `
    query {
      user(login: "${username}") {
        contributionsCollection(from: "${startDate}", to: "${endDate}") {
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
          totalPullRequestReviewContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
          commitContributionsByRepository {
            repository {
              nameWithOwner
              languages(first: 1, orderBy: {field: SIZE, direction: DESC}) {
                nodes {
                  name
                  color
                }
              }
            }
          }
        }
      }
    }
  `;

    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (data.errors) {
        throw new Error(data.errors[0]?.message || 'Failed to fetch GitHub contributions');
    }

    return data;
}
