import type { GitHubUser } from "../../types/github";
import type { GitHubContributions } from "../../types/github-contributions";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useEffect, useRef, useState } from "react";
import VanillaTilt from "vanilla-tilt";
import GitHubIcon from "@/assets/github-icon.svg";
import JavaIcon from "@/assets/java-icon.svg";
import * as simpleIcons from 'simple-icons';

// Helper function to create lighter versions of colors
const getLightColor = (hexColor: string, factor: number = 0.8): string => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Mix with white (255, 255, 255)
  const lightR = Math.round(r + (255 - r) * factor);
  const lightG = Math.round(g + (255 - g) * factor);
  const lightB = Math.round(b + (255 - b) * factor);
  
  return `rgb(${lightR}, ${lightG}, ${lightB})`;
};

const getTopLanguageColor = (contributions: GitHubContributions, year: number): string => {
  const reposInYear = contributions.data.user.repositories.nodes
    .filter(repo => {
      const pushedDate = new Date(repo.pushedAt);
      return pushedDate.getFullYear() === year;
    });

  const languages = reposInYear
    .map(repo => repo.languages.nodes[0])
    .filter(Boolean);

  if (!languages.length) return '#4a5568'; // default gray

  const languageCounts = languages.reduce((acc, lang) => {
    if (!lang) return acc;
    acc[lang.name] = (acc[lang.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topLanguage = Object.entries(languageCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0];

  if (!topLanguage) return '#4a5568';

  return languages.find(l => l?.name === topLanguage)?.color || '#4a5568';
};

// Helper function to find the best matching icon
const findBestMatchingIcon = (languageName: string): string | null => {
  // Special cases where language name doesn't match icon name
  const specialCases: Record<string, string> = {
    'assembly': 'assemblyscript',
    'shell': 'gnu',
    'makefile': 'gnu',
    'c++': 'cplusplus',
    'objective-c': 'objectivec',
    'objective-c++': 'objectivec',
  };

  // Check special cases first
  const specialCase = specialCases[languageName.toLowerCase()];
  if (specialCase) {
    const iconKey = `si${specialCase.charAt(0).toUpperCase()}${specialCase.slice(1)}`;
    if ((simpleIcons as any)[iconKey]) {
      return iconKey;
    }
  }

  // Create variations of the name to try
  const variations: string[] = [
    // Original full name lowercase without spaces
    languageName.toLowerCase().replace(/\s+/g, ''),
    // Just the first word
    languageName.split(' ')[0].toLowerCase(),
  ];

  // Add last word if it exists
  const words = languageName.split(' ');
  if (words.length > 1) {
    variations.push(words[words.length - 1].toLowerCase());
    // Add first letter of first word + second word
    variations.push((languageName.charAt(0) + words[1]).toLowerCase());
  }

  // Try each variation
  for (const name of variations) {
    const iconKey = `si${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    if ((simpleIcons as any)[iconKey]) {
      return iconKey;
    }
  }

  return null;
};

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
  // Tie -breaker: sort alphabetically
  const topLanguage = Object.entries(languageCounts)
    .sort(([langA, a], [langB, b]) => {
      if (b !== a) return b - a;
      return langA.localeCompare(langB);
    })[0]?.[0];
    

  if (!topLanguage) return null;
  console.log(`Top language for year ${year}: ${topLanguage}`);

  // Special handling for Java since it's not in simple-icons
  if (topLanguage.toLowerCase() === 'java') {
    return (
      <div 
        className="w-6 h-6"
        title={`Most used language: ${topLanguage}`}
      >
        <img 
          src={JavaIcon}
          alt="Java"
          className="w-full h-full"
          style={{ filter: 'invert(71%) sepia(98%) saturate(1791%) hue-rotate(339deg) brightness(102%) contrast(98%)' }}
        />
      </div>
    );
  }

  // Try to find the best matching icon
  const iconKey = findBestMatchingIcon(topLanguage);
  const icon = iconKey ? (simpleIcons as any)[iconKey] : null;

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

  const languageColor = contributions ? getTopLanguageColor(contributions, selectedYear) : '#4a5568';
  const lightColor = getLightColor(languageColor, 0.9); // Very light version
  const mediumColor = getLightColor(languageColor, 0.8); // Light version

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
              className="rounded-xl p-2 shadow-lg border-8 border-white hover:shadow-xl transition-all"
              style={{
                background: `linear-gradient(to bottom, ${lightColor}, ${mediumColor})`
              }}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-xl font-bold text-black">
                      {user.login}
                    </h2>
                    <span className="text-sm font-medium text-gray-600">
                      {selectedYear}
                    </span>
                  </div>
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
