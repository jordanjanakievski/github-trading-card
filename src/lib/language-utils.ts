import type { GitHubContributions } from "../types/github-contributions";
import { languageIconMap } from "../types/language-icon-map";
import * as simpleIcons from 'simple-icons';

// Helper function to find the best matching icon
export const findBestMatchingIcon = (languageName: string): string | null => {
  // Check for special case in the language icon map
  const specialCase = languageIconMap[languageName.toLowerCase()];
  if (specialCase) {
    console.log(specialCase)
    const iconKey = `si${specialCase.charAt(0).toUpperCase()}${specialCase.slice(1)}`;
    console.log(iconKey)
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

// Get language data for a specific year
export const getLanguageData = (contributions: GitHubContributions, year: number) => {
  // Filter repositories by year
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

  // Sort by frequency then alphabetically
  const topLanguage = Object.entries(languageCounts)
    .sort(([langA, a], [langB, b]) => {
      if (b !== a) return b - a;
      return langA.localeCompare(langB);
    })[0]?.[0];

  if (!topLanguage) return null;

  const color = languages.find(l => l?.name === topLanguage)?.color || '#000000';

  return {
    name: topLanguage,
    color,
    isJava: topLanguage.toLowerCase() === 'java'
  };
};

// Helper function to create lighter versions of colors
export const getLightColor = (hexColor: string, factor: number = 0.8): string => {
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


