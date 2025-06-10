import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { GitHubUser } from '@/types/github';

interface CardCustomizationFormProps {
    user: GitHubUser;
    availableYears: number[];
    onGenerate: (year: number, token?: string) => void;
    isLoading: boolean;
    onBack: () => void;
}

export function CardCustomizationForm({
    user,
    availableYears,
    onGenerate,
    isLoading,
    onBack,
}: CardCustomizationFormProps) {
    const [selectedYear, setSelectedYear] = useState(availableYears[0]);
    const [personalToken, setPersonalToken] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(selectedYear, personalToken || undefined);
    };

    return (
        <div className="w-full max-w-md">
            <div className="mb-6 bg-[#161b22] p-4 rounded-lg border border-[#30363d]">
                <div className="flex items-center gap-4 mb-4">
                    <img
                        src={user.avatar_url}
                        alt={user.login}
                        className="w-16 h-16 rounded-full"
                    />
                    <div>
                        <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                        <p className="text-sm text-gray-400">@{user.login}</p>
                    </div>
                </div>
                {user.bio && <p className="text-sm text-gray-300">{user.bio}</p>}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Year
                    </label>
                    <select
                        value={selectedYear}
                        onChange={e => setSelectedYear(Number(e.target.value))}
                        className="w-full px-4 py-2 rounded-lg bg-[#161b22] border border-[#30363d] text-white focus:outline-none focus:border-[#58a6ff] transition-colors"
                    >
                        {availableYears.map(year => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Personal Access Token (optional)
                    </label>
                    <Input
                        type="password"
                        value={personalToken}
                        onChange={e => setPersonalToken(e.target.value)}
                        placeholder="For including private repository stats"
                        className="w-full px-4 py-2 rounded-lg bg-[#161b22] border border-[#30363d] text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] transition-colors"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                        Leave empty to use the default token (public repositories only)
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button
                        type="button"
                        onClick={onBack}
                        variant="outline"
                        className="px-4 py-2 bg-transparent border border-[#30363d] text-white hover:bg-[#161b22] transition-colors"
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 px-6 py-2 bg-[#238636] text-white rounded-lg hover:bg-[#2ea043] transition-colors disabled:bg-[#1b1f23] disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Generating...' : 'Generate Card'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
