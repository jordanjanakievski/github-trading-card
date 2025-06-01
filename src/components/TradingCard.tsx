import type { GitHubUser } from '../types/github';
import { AspectRatio } from './ui/aspect-ratio';

interface TradingCardProps {
  user: GitHubUser;
}

export const TradingCard = ({ user }: TradingCardProps) => {
  const joinedDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="w-[350px]">
      <AspectRatio ratio={63 / 88} className="bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-xl p-4 shadow-lg border-8 border-yellow-400 hover:shadow-xl transition-all">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{user.name || user.login}</h2>
            <span className="text-sm font-medium text-gray-600">@{user.login}</span>
          </div>

          <div className="relative mb-4 bg-white rounded-lg p-2">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-full h-full object-cover rounded-md"
            />
          </div>

          <div className="flex-1 space-y-4">
            {user.bio && <p className="text-sm text-gray-700 italic">{user.bio}</p>}

            <div className="grid grid-cols-3 gap-2 bg-yellow-50 p-2 rounded-lg">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-gray-900">{user.public_repos}</span>
                <span className="text-xs text-gray-600">Repos</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-gray-900">{user.followers}</span>
                <span className="text-xs text-gray-600">Followers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-gray-900">{user.following}</span>
                <span className="text-xs text-gray-600">Following</span>
              </div>
            </div>

            <div className="text-xs space-y-1 text-gray-600 bg-yellow-50 p-2 rounded-lg">
              {user.location && (
                <p className="flex items-center gap-1">
                  <span>📍</span> {user.location}
                </p>
              )}
              {user.company && (
                <p className="flex items-center gap-1">
                  <span>🏢</span> {user.company}
                </p>
              )}
              <p className="flex items-center gap-1">
                <span>🗓️</span> Joined {joinedDate}
              </p>
            </div>
          </div>
        </div>
      </AspectRatio>
    </div>
  );
};
