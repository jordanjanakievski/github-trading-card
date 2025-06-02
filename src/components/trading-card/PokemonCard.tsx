import type { GitHubUser } from '../../types/github';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useEffect, useRef, useState } from 'react';
import VanillaTilt from 'vanilla-tilt';
import { Button } from '@/components/ui/button';
import GitHubIcon from '@/assets/github-icon.svg';
import html2canvas from 'html2canvas-pro';

interface TradingCardProps {
  user: GitHubUser;
}

interface TiltElement extends HTMLDivElement {
  vanillaTilt: {
    destroy: () => void;
  };
}

export const TradingCard = ({ user }: TradingCardProps) => {
  const tiltRef = useRef<TiltElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const tiltNode = tiltRef.current;
    if (tiltNode) {
      VanillaTilt.init(tiltNode, {
        max: 25,
        speed: 400,
        glare: true,
        'max-glare': 0.5,
        scale: 1.00,
      });

      return () => tiltNode.vanillaTilt.destroy();
    }
  }, []);

  const exportCard = async () => {
    if (!cardRef.current) return;
    
    // Temporarily remove tilt effect for capture
    if (tiltRef.current?.vanillaTilt) {
      tiltRef.current.vanillaTilt.destroy();
    }

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Better quality
        logging: false,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `${user.login}-github-card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to export card:', error);
    }

    // Reinitialize tilt effect
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 25,
        speed: 400,
        glare: true,
        'max-glare': 0.5,
        scale: 1.00,
      });
    }
  };

  return (
    <div className="relative">
      <div
        ref={cardRef}
        className="relative"
      >
        <div
          ref={tiltRef}
          className={`w-[350px] transform-gpu transition-transform duration-700 ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front of card */}
          <div
            style={{ backfaceVisibility: 'hidden' }}
            className={isFlipped ? 'invisible' : ''}
          >
            <AspectRatio
              ratio={63 / 88}
              className="bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-xl p-4 shadow-lg border-8 border-yellow-400 hover:shadow-xl transition-all"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">@{user.login}</h2>
                </div>

                <div className="relative mb-4 bg-white rounded-lg p-2">
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                <div className="flex-1 space-y-4">
                  {user.bio && (
                    <p className="text-sm text-gray-700 italic">{user.bio}</p>
                  )}

                  <div className="grid grid-cols-3 gap-1 bg-yellow-50 p-1 rounded-lg">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-gray-900">
                        {user.public_repos}
                      </span>
                      <span className="text-xs text-gray-600">Repos</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-gray-900">
                        {user.followers}
                      </span>
                      <span className="text-xs text-gray-600">Followers</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-gray-900">
                        {user.following}
                      </span>
                      <span className="text-xs text-gray-600">Following</span>
                    </div>
                  </div>
                </div>
              </div>
            </AspectRatio>
          </div>

          {/* Back of card */}
          <div
            style={{ backfaceVisibility: !isFlipped ? 'hidden' : undefined }}
            className={`absolute inset-0 [transform:rotateY(180deg)] ${
              !isFlipped ? 'invisible' : ''
            }`}
          >
            <AspectRatio
              ratio={63 / 88}
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

      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex gap-2">
        <Button
          onClick={() => setIsFlipped(!isFlipped)}
          className="bg-gray-400 hover:bg-gray-500 text-black"
        >
          Flip
        </Button>
        <Button
          onClick={exportCard}
          className="bg-green-400 hover:bg-green-500 text-black"
        >
          Export
        </Button>
      </div>
    </div>
  );
};
