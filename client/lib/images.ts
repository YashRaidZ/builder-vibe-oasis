// Image path utilities for IndusNetwork

export const images = {
  // Logos
  logos: {
    main: '/images/logos/indusnetwork-logo.svg',
    favicon: '/images/logos/favicon.png',
  },

  // Rank badges
  ranks: {
    vip: '/images/ranks/vip-badge.svg',
    mvp: '/images/ranks/mvp-badge.svg',
    legend: '/images/ranks/legend-badge.svg',
    default: '/images/ranks/default-badge.svg',
  },

  // Pack images
  packs: {
    starter: '/images/packs/starter-kit.svg',
    builder: '/images/packs/builder-kit.svg',
    combat: '/images/packs/combat-kit.svg',
    premium: '/images/packs/premium-kit.svg',
  },

  // UI elements
  ui: {
    coins: '/images/ui/coins.svg',
    gems: '/images/ui/gems.svg',
    loading: '/images/ui/loading.svg',
    error: '/images/ui/error.svg',
  },

  // Achievement badges
  achievements: {
    firstKill: '/images/achievements/first-kill.svg',
    masterBuilder: '/images/achievements/master-builder.svg',
    richPlayer: '/images/achievements/rich-player.svg',
    longPlayer: '/images/achievements/long-player.svg',
  },

  // Player avatars
  players: {
    default: '/images/players/default-avatar.svg',
    male: '/images/players/male-avatar.svg',
    female: '/images/players/female-avatar.svg',
  },

  // Backgrounds
  backgrounds: {
    pattern: '/images/backgrounds/pattern.svg',
    hero: '/images/backgrounds/hero-bg.jpg',
    gaming: '/images/backgrounds/gaming-bg.jpg',
  },

  // Icons (for fallback)
  icons: {
    sword: '/images/icons/sword.svg',
    shield: '/images/icons/shield.svg',
    crown: '/images/icons/crown.svg',
    star: '/images/icons/star.svg',
  },
};

// Helper functions
export const getRankImage = (rank: string): string => {
  const rankLower = rank.toLowerCase();
  switch (rankLower) {
    case 'vip':
      return images.ranks.vip;
    case 'mvp':
      return images.ranks.mvp;
    case 'legend':
      return images.ranks.legend;
    default:
      return images.ranks.default;
  }
};

export const getPackImage = (packId: string): string => {
  switch (packId) {
    case 'starter-kit':
      return images.packs.starter;
    case 'builder-kit':
      return images.packs.builder;
    case 'combat-kit':
      return images.packs.combat;
    case 'premium-kit':
      return images.packs.premium;
    default:
      return images.packs.starter;
  }
};

export const getAchievementImage = (achievementId: string): string => {
  switch (achievementId) {
    case '1':
    case 'first-kill':
    case 'first_blood':
      return images.achievements.firstKill;
    case '2':
    case 'master-builder':
    case 'master_builder':
      return images.achievements.masterBuilder;
    case 'rich-player':
      return images.achievements.richPlayer;
    case 'long-player':
      return images.achievements.longPlayer;
    default:
      return images.achievements.firstKill;
  }
};

export const getPlayerAvatar = (gender?: string): string => {
  switch (gender) {
    case 'male':
      return images.players.male;
    case 'female':
      return images.players.female;
    default:
      return images.players.default;
  }
};

// Image preloader utility
export const preloadImages = (imagePaths: string[]): Promise<void[]> => {
  return Promise.all(
    imagePaths.map((path) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = path;
      });
    })
  );
};

// Critical images to preload
export const criticalImages = [
  images.logos.main,
  images.ranks.vip,
  images.ranks.mvp,
  images.ranks.legend,
  images.ui.coins,
  images.players.default,
];

export default images;
