import type { GitHubUser } from '../types/github';

interface TradingCardProps {
  user: GitHubUser;
}

export const TradingCard = ({ user }: TradingCardProps) => {
  const joinedDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="bg-[#161b22] rounded-xl p-6 shadow-lg max-w-xl w-full border border-[#30363d] hover:border-[#58a6ff] transition-colors">
      <div className="flex items-center gap-4 mb-6">
        <img 
          src={user.avatar_url} 
          alt={user.login} 
          className="w-24 h-24 rounded-full border-2 border-[#30363d]"
        />
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-white">{user.name || user.login}</h2>
          <p className="text-[#8b949e]">@{user.login}</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {user.bio && (
          <p className="text-[#c9d1d9] text-sm">{user.bio}</p>
        )}
        
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center bg-[#21262d] rounded-lg p-3">
            <span className="text-xl font-bold text-white">{user.public_repos}</span>
            <span className="text-sm text-[#8b949e]">Repositories</span>
          </div>
          <div className="flex flex-col items-center bg-[#21262d] rounded-lg p-3">
            <span className="text-xl font-bold text-white">{user.followers}</span>
            <span className="text-sm text-[#8b949e]">Followers</span>
          </div>
          <div className="flex flex-col items-center bg-[#21262d] rounded-lg p-3">
            <span className="text-xl font-bold text-white">{user.following}</span>
            <span className="text-sm text-[#8b949e]">Following</span>
          </div>
        </div>

        <div className="space-y-2 text-sm text-[#8b949e]">
          {user.location && (
            <p className="flex items-center gap-2">
              <span>📍</span> {user.location}
            </p>
          )}
          {user.company && (
            <p className="flex items-center gap-2">
              <span>🏢</span> {user.company}
            </p>
          )}
          <p className="flex items-center gap-2">
            <span>🗓️</span> Joined {joinedDate}
          </p>
        </div>
      </div>
    </div>
  );
};
