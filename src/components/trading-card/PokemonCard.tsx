import type { GitHubUser } from "../../types/github";
import type { GitHubContributions } from "../../types/github-contributions";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useEffect, useRef, useState } from "react";
import VanillaTilt from "vanilla-tilt";
import GitHubIcon from "@/assets/github-icon.svg";
import * as simpleIcons from 'simple-icons';

const getLanguageIcon = (contributions: GitHubContributions, year: number) => {
  // Filter repositories by year and get most used language
  const reposInYear = contributions.data.user.repositories.nodes
    .filter(repo => {
      const pushedDate = new Date(repo.pushedAt);
      return pushedDate.getFullYear() === year;
    });

  const languages = reposInYear
    .map(repo => repo.languages.nodes[0])
    .filter(Boolean);

  if (!languages.length) return null;

  // Count occurrences of each language
  const languageCounts = languages.reduce((acc, lang) => {
    if (!lang) return acc;
    acc[lang.name] = (acc[lang.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get the most frequent language
  const topLanguage = Object.entries(languageCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0];

  if (!topLanguage) return null;

  // Convert language name to match simple-icons format
  const iconName = topLanguage.toLowerCase().replace(/\s+/g, '');
  const icon = (simpleIcons as any)[`si${iconName.charAt(0).toUpperCase()}${iconName.slice(1)}`];

  if (!icon) return null;

  const color = languages.find(l => l?.name === topLanguage)?.color || '#000000';

  return (
    <div 
      className="w-6 h-6"
      title={`Most used language: ${topLanguage}`}
    >
      <svg 
        role="img" 
        viewBox="0 0 24 24"
        fill={color}
        className="w-full h-full"
      >
        <path d={icon.path} />
      </svg>
    </div>
  );
};

interface TradingCardProps {
  user: GitHubUser;
  contributions?: GitHubContributions;
  selectedYear: number;
}

interface TiltElement extends HTMLDivElement {
  vanillaTilt: {
    destroy: () => void;
  };
}

export const PokemonCard = ({ user, contributions, selectedYear }: TradingCardProps) => {
  const tiltRef = useRef<TiltElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<TiltElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const tiltNode = tiltRef.current;
    if (tiltNode) {
      VanillaTilt.init(tiltNode, {
        max: 35,
        speed: 400,
        scale: 1.0,
      });

      return () => tiltNode.vanillaTilt.destroy();
    }
  }, []);

  useEffect(() => {
    const imageNode = imageContainerRef.current;
    if (imageNode && !isFlipped) {
      VanillaTilt.init(imageNode, {
        max: 0,
        speed: 400,
        glare: true,
        "max-glare": 1.0,
      });

      return () => imageNode.vanillaTilt.destroy();
    }
  }, [isFlipped]);



  const calculateActiveDays = (contributions: GitHubContributions) => {
    const { contributionCalendar } = contributions.data.user.contributionsCollection;
    return contributionCalendar.weeks
      .flatMap(week => week.contributionDays)
      .filter(day => day.contributionCount > 0)
      .length;
  };

  return (
    <div
      className="relative"
      ref={cardRef}
    >
      <div
        ref={tiltRef}
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative"
      >
        <div
          className={`w-[350px] transform-gpu transition-transform duration-700 ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front of card */}
          <div
            style={{ backfaceVisibility: "hidden" }}
            className={isFlipped ? "invisible" : ""}
          >
            <AspectRatio
              ratio={2.5 / 3.5}
              className="bg-gradient-to-b from-gray-300 to-gray-400 rounded-xl p-2 shadow-lg border-8 border-white hover:shadow-xl transition-all"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-black">
                    {user.login}
                  </h2>
                  {contributions && getLanguageIcon(contributions, selectedYear)}
                </div>

                <div
                  ref={imageContainerRef}
                  className="relative mb-2 bg-white rounded-lg p-2 transform-gpu"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="w-full h-60 object-cover rounded-md"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  {user.bio && (
                    <p className="text-sm text-gray-700 italic">{user.bio}</p>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center bg-gray-800 p-2 rounded-lg">
                      <span className="text-lg font-bold text-white">
                        {contributions?.data.user.contributionsCollection.totalCommitContributions ?? "-"}
                      </span>
                      <span className="text-xs text-gray-400">Commits</span>
                    </div>
                    
                    <div className="flex flex-col items-center bg-gray-800 p-2 rounded-lg">
                      <span className="text-lg font-bold text-white">
                        {contributions?.data.user.contributionsCollection.totalPullRequestContributions ?? "-"}
                      </span>
                      <span className="text-xs text-gray-400">PRs</span>
                    </div>

                    <div className="flex flex-col items-center bg-gray-800 p-2 rounded-lg">
                      <span className="text-lg font-bold text-white">
                        {contributions?.data.user.contributionsCollection.totalIssueContributions ?? "-"}
                      </span>
                      <span className="text-xs text-gray-400">Issues</span>
                    </div>

                    <div className="flex flex-col items-center bg-gray-800 p-2 rounded-lg">
                      <span className="text-lg font-bold text-white">
                        {contributions?.data.user.contributionsCollection.totalPullRequestReviewContributions ?? "-"}
                      </span>
                      <span className="text-xs text-gray-400">Reviews</span>
                    </div>

                    <div className="flex flex-col items-center bg-gray-800 p-2 rounded-lg">
                      <span className="text-lg font-bold text-white">
                        {contributions ? calculateActiveDays(contributions) : "-"}
                      </span>
                      <span className="text-xs text-gray-400">Active Days</span>
                    </div>

                    <div className="flex flex-col items-center bg-gray-800 p-2 rounded-lg">
                      <span className="text-lg font-bold text-white">
                        {contributions?.data.user.contributionsCollection.contributionCalendar.totalContributions ?? "-"}
                      </span>
                      <span className="text-xs text-gray-400">Total</span>
                    </div>
                  </div>
                </div>
              </div>
            </AspectRatio>
          </div>

          {/* Back of card */}
          <div
            style={{ backfaceVisibility: !isFlipped ? "hidden" : undefined }}
            className={`absolute inset-0 [transform:rotateY(180deg)] ${
              !isFlipped ? "invisible" : ""
            }`}
          >
            <AspectRatio
              ratio={2.5 / 3.5}
              className="bg-black rounded-xl p-4 shadow-lg border-8 border-white transition-all"
            >
              <div className="flex items-center justify-center h-full">
                <img
                  src={GitHubIcon}
                  alt="GitHub Logo"
                  className="w-48 h-48 invert brightness-0"
                />
              </div>
            </AspectRatio>
          </div>
        </div>
      </div>
    </div>
  );
};
