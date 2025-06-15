import type { GitHubContributions } from '../types/github-contributions';
import { languageIconMap } from '../types/language-icon-map';
import * as simpleIcons from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';

export const findBestMatchingIcon = (languageName: string): string | null => {
    // Check for special case in the language icon map
    const specialCase = languageIconMap[languageName.toLowerCase()];
    if (specialCase) {
        const iconKey = `si${specialCase.charAt(0).toUpperCase()}${specialCase.slice(1)}`;
        if (
            iconKey in simpleIcons &&
            (simpleIcons[iconKey as keyof typeof simpleIcons] as SimpleIcon)
        ) {
            return iconKey;
        }
    }

    // Create variations of the name to try
    const variations: string[] = [
        languageName.toLowerCase().replace(/\s+/g, ''),
        languageName.split(' ')[0].toLowerCase(),
    ];

    const words = languageName.split(' ');
    if (words.length > 1) {
        variations.push(words[words.length - 1].toLowerCase());
        variations.push((languageName.charAt(0) + words[1]).toLowerCase());
    }

    // Try each variation
    for (const name of variations) {
        const iconKey = `si${name.charAt(0).toUpperCase()}${name.slice(1)}`;
        if (
            iconKey in simpleIcons &&
            (simpleIcons[iconKey as keyof typeof simpleIcons] as SimpleIcon)
        ) {
            return iconKey;
        }
    }

    return null;
};

export const getLanguageData = (contributions: GitHubContributions) => {
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
    const topLanguage = Object.entries(languageCounts).sort(([langA, countA], [langB, countB]) => {
        if (countB !== countA) {
            return countB - countA;
        }
        return langA.localeCompare(langB);
    })[0]?.[0];

    if (!topLanguage) return null;

    const languageInfo = languages.find(l => l.name === topLanguage);
    if (!languageInfo) return null;

    const isJava = topLanguage.toLowerCase() === 'java';
    const iconKey = !isJava ? findBestMatchingIcon(topLanguage) : null;
    const icon = iconKey ? (simpleIcons[iconKey as keyof typeof simpleIcons] as SimpleIcon) : null;

    // If we found an icon but not Java, use the icon's color instead
    const color = icon && !isJava ? `#${icon.hex}` : languageInfo.color;

    return {
        name: topLanguage,
        color,
        isJava,
        icon,
        iconKey,
    };
};

export const getLightColor = (hexColor: string, factor: number = 0.8): string => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    const lightR = Math.round(r + (255 - r) * factor);
    const lightG = Math.round(g + (255 - g) * factor);
    const lightB = Math.round(b + (255 - b) * factor);

    return `rgb(${lightR}, ${lightG}, ${lightB})`;
};
