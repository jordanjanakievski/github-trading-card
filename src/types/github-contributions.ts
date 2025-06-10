export interface GitHubContributions {
    data: {
        user: {
            contributionsCollection: {
                totalCommitContributions: number;
                totalPullRequestContributions: number;
                totalIssueContributions: number;
                totalPullRequestReviewContributions: number;
                contributionCalendar: {
                    totalContributions: number;
                    weeks: Array<{
                        contributionDays: Array<{
                            date: string;
                            contributionCount: number;
                        }>;
                    }>;
                };
                commitContributionsByRepository: {
                    repository: {
                        nameWithOwner: string;
                        languages: {
                            nodes: Array<{
                                name: string;
                                color: string;
                            }>;
                        };
                    };
                }[];
            };
        };
    };
}
