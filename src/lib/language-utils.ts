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
  const { contributionsCollection } = contributions.data.user;
  
  // Get languages from all repos where the user made commits
  const languages = contributionsCollection.commitContributionsByRepository
    .map(({ repository }) => repository.languages.nodes[0])
    .filter((lang): lang is { name: string; color: string } => Boolean(lang));

  if (!languages.length) return null;

  // Count occurrences of each language
  const languageCounts = languages.reduce<Record<string, number>>((acc, lang) => {
    acc[lang.name] = (acc[lang.name] || 0) + 1;
    return acc;
  }, {});

  // Sort by frequency then alphabetically
  const topLanguage = Object.entries(languageCounts)
    .sort(([langA, countA], [langB, countB]) => {
      if (countB !== countA) {
        return countB - countA;
      }
      return langA.localeCompare(langB);
    })[0]?.[0];

  if (!topLanguage) return null;

  const languageInfo = languages.find(l => l.name === topLanguage);
  if (!languageInfo) return null;

  return {
    name: topLanguage,
    color: languageInfo.color,
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


