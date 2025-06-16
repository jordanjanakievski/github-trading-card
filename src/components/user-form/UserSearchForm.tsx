import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { GitHubUser } from '@/types/github';

interface UserSearchFormProps {
    onUserFound: (user: GitHubUser, availableYears: number[]) => void;
    isLoading: boolean;
}

export function UserSearchForm({ onUserFound, isLoading }: UserSearchFormProps) {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;

        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            if (!response.ok) {
                throw new Error('User not found');
            }
            const user = await response.json();

            // Calculate available years from account creation date
            const createdAt = new Date(user.created_at);
            const currentYear = new Date().getFullYear();
            const availableYears = Array.from(
                { length: currentYear - createdAt.getFullYear() + 1 },
                (_, i) => currentYear - i
            );

            onUserFound(user, availableYears);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch user');
        }
    };

    return (
        <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <Input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Enter GitHub username"
                        className="flex-1 px-4 py-2 rounded-lg bg-[#161b22] border border-[#30363d] text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] transition-colors"
                    />
                    <p className="mt-2 text-sm text-[#8b949e]">
                        Here are some examples to try: torvalds, mitchellh, yyx990803
                    </p>
                </div>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-[#238636] text-white rounded-lg hover:bg-[#2ea043] transition-colors disabled:bg-[#1b1f23] disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Loading...' : 'Search User'}
                </Button>
                {error && <p className="text-[#f85149] text-sm">{error}</p>}
            </form>
        </div>
    );
}
