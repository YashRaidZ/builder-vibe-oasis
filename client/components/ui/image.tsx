import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: React.ReactNode;
  className?: string;
}

export function Image({ src, alt, fallback, className, ...props }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          hasError && "hidden"
        )}
        {...props}
      />
    </div>
  );
}

interface RankImageProps {
  rank: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RankImage({ rank, size = "md", className }: RankImageProps) {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  const getRankImageSrc = (rank: string) => {
    const rankLower = rank.toLowerCase();
    switch (rankLower) {
      case 'vip':
        return '/images/ranks/vip-badge.svg';
      case 'mvp':
        return '/images/ranks/mvp-badge.svg';
      case 'legend':
        return '/images/ranks/legend-badge.svg';
      default:
        return '/images/ranks/default-badge.svg';
    }
  };

  return (
    <Image
      src={getRankImageSrc(rank)}
      alt={`${rank} rank`}
      className={cn(sizes[size], className)}
      fallback={
        <div className={cn(sizes[size], "bg-muted rounded-full flex items-center justify-center", className)}>
          <span className="text-xs font-bold">{rank.charAt(0).toUpperCase()}</span>
        </div>
      }
    />
  );
}

interface PackImageProps {
  packId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PackImage({ packId, size = "md", className }: PackImageProps) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-16 w-16",
    lg: "h-24 w-24"
  };

  const getPackImageSrc = (packId: string) => {
    switch (packId) {
      case 'starter-kit':
        return '/images/packs/starter-kit.svg';
      case 'builder-kit':
        return '/images/packs/builder-kit.svg';
      case 'combat-kit':
        return '/images/packs/combat-kit.svg';
      case 'premium-kit':
        return '/images/packs/premium-kit.svg';
      default:
        return '/images/packs/starter-kit.svg';
    }
  };

  return (
    <Image
      src={getPackImageSrc(packId)}
      alt={`${packId} pack`}
      className={cn(sizes[size], className)}
      fallback={
        <div className={cn(sizes[size], "bg-muted rounded flex items-center justify-center", className)}>
          <span className="text-xs">📦</span>
        </div>
      }
    />
  );
}

interface PlayerAvatarProps {
  username?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PlayerAvatar({ username, size = "md", className }: PlayerAvatarProps) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  return (
    <Image
      src="/images/players/default-avatar.svg"
      alt={`${username || 'Player'} avatar`}
      className={cn(sizes[size], "rounded", className)}
      fallback={
        <div className={cn(sizes[size], "bg-primary-blue rounded flex items-center justify-center text-white font-bold", className)}>
          {username ? username.charAt(0).toUpperCase() : '?'}
        </div>
      }
    />
  );
}
