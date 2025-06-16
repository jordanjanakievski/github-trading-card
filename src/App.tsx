import { useState, useRef } from 'react';
import type { GitHubUser } from '@/types/github';
import { GitBranch } from 'lucide-react';
import { PokemonCard } from '@/components/trading-card/PokemonCard';
import { UserSearchForm } from '@/components/user-form/UserSearchForm';
import { CardCustomizationForm } from '@/components/user-form/CardCustomizationForm';
import { fetchGitHubContributions } from '@/lib/github';
import type { GitHubContributions } from '@/types/github-contributions';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas-pro';

function App() {
    const [user, setUser] = useState<GitHubUser | null>(null);
    const [availableYears, setAvailableYears] = useState<number[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [contributions, setContributions] = useState<GitHubContributions | null>(null);
    const [showCard, setShowCard] = useState(false);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const cardRef = useRef<HTMLDivElement>(null);

    const handleUserFound = (foundUser: GitHubUser, years: number[]) => {
        setUser(foundUser);
        setAvailableYears(years);
        setShowCard(false);
    };

    const handleGenerateCard = async (year: number, personalToken?: string) => {
        if (!user) return;

        setIsLoading(true);
        setError('');
        try {
            const token = personalToken || import.meta.env.VITE_GITHUB_TOKEN || '';
            const contributionsData = await fetchGitHubContributions(user.login, token, year);
            setContributions(contributionsData);
            setSelectedYear(year);
            setShowCard(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch contributions');
            setShowCard(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = async () => {
        if (!cardRef.current || !user) return;

        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2,
                logging: false,
                useCORS: true,
            });

            const link = document.createElement('a');
            link.download = `${user.login}-github-card.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Failed to export card:', error);
            setError('Failed to export card');
        }
    };

    const resetForm = () => {
        setUser(null);
        setAvailableYears([]);
        setError('');
        setContributions(null);
        setShowCard(false);
    };

    return (
        <div className="min-h-screen bg-[#0d1117] py-12 px-4">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
                <div className="flex items-center gap-4 mb-8">
                    <h1 className="text-4xl font-bold text-[#ffffff]">
                        GitHub Trading Card Generator
                    </h1>
                </div>

                <p className="leading-7 [&:not(:first-child)]:mt-6 text-[#c9d1d9] mb-4">
                    Inspired by the GitHub Graduation cards from{' '}
                    <a
                        href="https://github.com/github-education-resources/GitHubGraduation-2021"
                        className="text-[#58a6ff] hover:underline"
                    >
                        2021
                    </a>{' '}
                    and{' '}
                    <a
                        href="https://github.com/github-education-resources/GitHubGraduation-2022"
                        className="text-[#58a6ff] hover:underline"
                    >
                        2022
                    </a>
                    , this site allows you to generate your own with a fun twist. The more active
                    you are, the rarer your card becomes!
                </p>
                <p className="leading-7 text-[#c9d1d9] mb-8">
                    Whether you are fixing bugs, writing docs, or starting new projects, every
                    contribution counts. Hopefully this inspires you to keep coding, contribute to
                    open source, and watch your GitHub activity grow, one day at a time.
                </p>

                {!user && <UserSearchForm onUserFound={handleUserFound} isLoading={isLoading} />}

                {user && !showCard && (
                    <CardCustomizationForm
                        user={user}
                        availableYears={availableYears}
                        onGenerate={handleGenerateCard}
                        isLoading={isLoading}
                        onBack={resetForm}
                    />
                )}

                {error && <p className="text-[#f85149] mb-4">{error}</p>}

                {showCard && user && (
                    <div className="w-full flex flex-col items-center gap-6 mt-8">
                        <>
                            <div className="relative" ref={cardRef}>
                                <PokemonCard
                                    user={user}
                                    contributions={contributions ?? undefined}
                                    selectedYear={selectedYear}
                                />
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => setShowCard(false)}
                                    variant="outline"
                                    className="px-4 py-2 bg-transparent border border-[#30363d] text-white hover:bg-[#161b22] transition-colors"
                                >
                                    Customize
                                </Button>
                                <Button
                                    onClick={handleExport}
                                    className="px-6 py-2 bg-[#238636] text-white rounded-lg hover:bg-[#2ea043] transition-colors"
                                >
                                    Export
                                </Button>
                            </div>
                        </>
                    </div>
                )}
                <footer className="mt-8 flex flex-col items-center gap-4 text-[#8b949e]">
                    <p className="leading-7 [&:not(:first-child)]:mt-2 text-[#c9d1d9] mb-2">
                        Disclaimer: This is not an official GitHub project.
                    </p>
                    <div className="flex flex-col items-center gap-2">
                        <a
                            href="https://github.com/jordanjanakievski/github-trading-card"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-[#c9d1d9] transition-colors"
                        >
                            <GitBranch className="w-4 h-4" />
                            <span className="text-sm">View on GitHub</span>
                        </a>
                        <p className="text-sm">
                            Brought to you by{' '}
                            <a
                                href="https://janakievski.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#c9d1d9] transition-colors"
                            >
                                janakievski.dev
                            </a>
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default App;
