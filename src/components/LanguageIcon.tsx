import type { GitHubContributions } from "@/types/github-contributions";
import { findBestMatchingIcon, getLanguageData } from "@/lib/language-utils";
import JavaIcon from "@/assets/java-icon.svg";
import * as simpleIcons from "simple-icons";

interface LanguageIconProps {
  contributions: GitHubContributions;
  year: number;
  className?: string;
}

export const LanguageIcon = ({
  contributions,
  year,
  className = "w-6 h-6",
}: LanguageIconProps) => {
  const langData = getLanguageData(contributions, year);

  // If no language data, show GitHub icon as fallback
  if (!langData) {
    return githubIcon();
  }

  const { name, color, isJava } = langData;

  // Special handling for Java since it's not in simple-icons
  if (isJava) {
    return (
      <div
        className={className}
        title={`Most used language: Java`}
      >
        <img
          src={JavaIcon}
          alt="Java"
          className="w-full h-full"
          style={{
            filter:
              "invert(71%) sepia(98%) saturate(1791%) hue-rotate(339deg) brightness(102%) contrast(98%)",
          }}
        />
      </div>
    );
  }

  // Try to find the best matching icon
  const iconKey = findBestMatchingIcon(name);
  const icon = iconKey ? (simpleIcons as any)[iconKey] : null;

  // If no matching icon found, use GitHub icon as fallback
  if (!icon) {
    return githubIcon();
  }

  return (
    <div
      className={className}
      title={`Most used language: ${name}`}
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

function githubIcon() {
  const icon = (simpleIcons as any).siGithub;
  return (
    <div
      className="w-6 h-6"
      title="GitHub"
    >
      <svg
        role="img"
        viewBox="0 0 24 24"
        fill="#24292e"
        className="w-full h-full"
      >
        <path d={icon.path} />
      </svg>
    </div>
  );
}
