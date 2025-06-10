import type { GitHubUser } from "@/types/github";
import type { GitHubContributions } from "@/types/github-contributions";
import { getRarityFromActiveDays, calculateActiveDays } from "@/lib/contribution-utils";
import { getLightColor, getLanguageData } from "@/lib/language-utils";
import { LanguageIcon } from "@/components/LanguageIcon";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useEffect, useRef, useState } from "react";
import VanillaTilt from "vanilla-tilt";
import GitHubIcon from "@/assets/github-icon.svg";

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

  const languageData = contributions ? getLanguageData(contributions, selectedYear) : null;
  const lightColor = getLightColor(languageData?.color || '#4a5568', 0.8);
  const mediumColor = getLightColor(languageData?.color || '#4a5568', 0.6);

  const activeDays = contributions ? calculateActiveDays(contributions) : 0;
  const rarity = getRarityFromActiveDays(activeDays, selectedYear);
  
  // Tilt effects
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

  return (
    <div className="relative" ref={cardRef}>
      <div ref={tiltRef} onClick={() => setIsFlipped(!isFlipped)} className="relative">
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
              className="rounded-xl p-2 shadow-lg border-8 hover:shadow-xl transition-all"
              style={{
                background: `linear-gradient(to bottom, ${lightColor}, ${mediumColor})`,
                borderColor: rarity.color,
              }}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-xl font-bold text-black">
                        {user.login}
                      </h2>
                      <span className="text-sm font-medium text-gray-600">
                        {selectedYear}
                      </span>
                    </div>
                    <span 
                      className="text-sm font-semibold text-black"
                    >
                      {rarity.name.toUpperCase()}{' '}
                    </span>
                  </div>
                  {contributions && <LanguageIcon contributions={contributions} year={selectedYear} />}
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

                <div className="grid grid-cols-3 gap-2">
                  {/* Stats boxes with glowing border based on rarity */}
                  <div className="flex flex-col items-center bg-gray-800 p-2 rounded-lg"
                       style={{ boxShadow: `0 0 8px ${rarity.color}33` }}>
                    <span className="text-lg font-bold text-white">
                      {contributions?.data.user.contributionsCollection.totalCommitContributions ?? "-"}
                    </span>
                    <span className="text-xs text-gray-400">Commits</span>
                  </div>
                  
                  <div className="flex flex-col items-center bg-gray-800 p-2 rounded-lg"
                       style={{ boxShadow: `0 0 8px ${rarity.color}33` }}>
                    <span className="text-lg font-bold text-white">
                      {contributions?.data.user.contributionsCollection.totalPullRequestContributions ?? "-"}
                    </span>
                    <span className="text-xs text-gray-400">PRs</span>
                  </div>

                  <div className="flex flex-col items-center bg-gray-800 p-2 rounded-lg"
                       style={{ boxShadow: `0 0 8px ${rarity.color}33` }}>
                    <span className="text-lg font-bold text-white">
                      {contributions?.data.user.contributionsCollection.totalIssueContributions ?? "-"}
                    </span>
                    <span className="text-xs text-gray-400">Issues</span>
                  </div>

                  <div className="flex flex-col items-center bg-gray-800 p-2 rounded-lg"
                       style={{ boxShadow: `0 0 8px ${rarity.color}33` }}>
                    <span className="text-lg font-bold text-white">
                      {contributions?.data.user.contributionsCollection.totalPullRequestReviewContributions ?? "-"}
                    </span>
                    <span className="text-xs text-gray-400">Reviews</span>
                  </div>

                  <div className="flex flex-col items-center bg-gray-800 p-2 rounded-lg"
                       style={{ boxShadow: `0 0 8px ${rarity.color}33` }}>
                    <span className="text-lg font-bold text-white">
                      {activeDays}
                    </span>
                    <span className="text-xs text-gray-400">Active Days</span>
                  </div>

                  <div className="flex flex-col items-center bg-gray-800 p-2 rounded-lg"
                       style={{ boxShadow: `0 0 8px ${rarity.color}33` }}>
                    <span className="text-lg font-bold text-white">
                      {contributions?.data.user.contributionsCollection.contributionCalendar.totalContributions ?? "-"}
                    </span>
                    <span className="text-xs text-gray-400">Total</span>
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
