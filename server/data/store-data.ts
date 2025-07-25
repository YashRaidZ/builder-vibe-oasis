import {
  StoreItemData,
  RankData,
  DeliveryCommand,
} from "../../shared/database";

// Comprehensive Rank System
export const ranksData: RankData[] = [
  {
    id: "default",
    name: "Default",
    displayName: "Player",
    color: "#9CA3AF",
    prefix: "",
    price: 0,
    description: "Default player rank with basic permissions",
    features: [
      {
        id: "basic_commands",
        name: "Basic Commands",
        description: "Access to essential commands",
        type: "permission",
      },
      {
        id: "chat",
        name: "Chat Access",
        description: "Ability to chat with other players",
        type: "permission",
      },
    ],
    permissions: ["essentials.spawn", "essentials.help", "essentials.list"],
    inheritance: [],
    order: 0,
    isStaff: false,
    isPurchasable: false,
  },
  {
    id: "helper",
    name: "Helper",
    displayName: "Helper",
    color: "#10B981",
    prefix: "[Helper]",
    price: 0,
    description: "Community helper with moderation tools",
    features: [
      {
        id: "kick_players",
        name: "Kick Players",
        description: "Ability to kick disruptive players",
        type: "command",
      },
      {
        id: "mute_players",
        name: "Mute Players",
        description: "Temporarily mute players",
        type: "command",
      },
      {
        id: "staff_chat",
        name: "Staff Chat",
        description: "Access to staff communication",
        type: "permission",
      },
    ],
    permissions: ["essentials.kick", "essentials.mute", "staff.chat"],
    inheritance: ["default"],
    order: 1,
    isStaff: true,
    isPurchasable: false,
  },
  {
    id: "vip",
    name: "VIP",
    displayName: "VIP",
    color: "#F59E0B",
    prefix: "[VIP]",
    suffix: "✦",
    price: 199,
    description: "VIP access with exclusive perks and commands",
    features: [
      {
        id: "fly",
        name: "Flight",
        description: "Ability to fly in survival",
        type: "command",
        value: "/fly",
      },
      {
        id: "heal",
        name: "Heal",
        description: "Restore health and hunger",
        type: "command",
        value: "/heal",
      },
      {
        id: "feed",
        name: "Feed",
        description: "Restore hunger",
        type: "command",
        value: "/feed",
      },
      {
        id: "homes",
        name: "Extra Homes",
        description: "Set up to 3 homes",
        type: "limit",
        value: 3,
      },
      {
        id: "xp_boost",
        name: "XP Boost",
        description: "25% extra experience",
        type: "bonus",
        value: 1.25,
      },
    ],
    permissions: [
      "essentials.fly",
      "essentials.heal",
      "essentials.feed",
      "essentials.sethome.multiple.vip",
      "vip.chat.color",
    ],
    inheritance: ["default"],
    order: 2,
    isStaff: false,
    isPurchasable: true,
  },
  {
    id: "vip+",
    name: "VIP+",
    displayName: "VIP+",
    color: "#FCD34D",
    prefix: "[VIP+]",
    suffix: "✦✦",
    price: 349,
    description: "Enhanced VIP with additional features",
    features: [
      {
        id: "fly",
        name: "Flight",
        description: "Ability to fly in survival",
        type: "command",
      },
      {
        id: "heal",
        name: "Heal",
        description: "Restore health and hunger",
        type: "command",
      },
      {
        id: "feed",
        name: "Feed",
        description: "Restore hunger",
        type: "command",
      },
      {
        id: "god",
        name: "God Mode",
        description: "Temporary invincibility",
        type: "command",
        value: "/god",
      },
      {
        id: "homes",
        name: "Extra Homes",
        description: "Set up to 5 homes",
        type: "limit",
        value: 5,
      },
      {
        id: "warps",
        name: "Private Warps",
        description: "Create personal warps",
        type: "limit",
        value: 2,
      },
      {
        id: "xp_boost",
        name: "XP Boost",
        description: "50% extra experience",
        type: "bonus",
        value: 1.5,
      },
    ],
    permissions: [
      "essentials.fly",
      "essentials.heal",
      "essentials.feed",
      "essentials.god",
      "essentials.sethome.multiple.vipplus",
      "essentials.setwarp",
      "vip.chat.format",
    ],
    inheritance: ["vip"],
    order: 3,
    isStaff: false,
    isPurchasable: true,
  },
  {
    id: "mvp",
    name: "MVP",
    displayName: "MVP",
    color: "#06B6D4",
    prefix: "[MVP]",
    suffix: "◆",
    price: 599,
    description: "Most Valuable Player with premium features",
    features: [
      {
        id: "fly",
        name: "Flight",
        description: "Unlimited flight",
        type: "command",
      },
      {
        id: "heal",
        name: "Heal",
        description: "Instant healing",
        type: "command",
      },
      {
        id: "feed",
        name: "Feed",
        description: "Never hungry",
        type: "command",
      },
      {
        id: "god",
        name: "God Mode",
        description: "Extended invincibility",
        type: "command",
      },
      {
        id: "speed",
        name: "Speed",
        description: "Increased movement speed",
        type: "command",
        value: "/speed",
      },
      {
        id: "homes",
        name: "Extra Homes",
        description: "Set up to 8 homes",
        type: "limit",
        value: 8,
      },
      {
        id: "warps",
        name: "Private Warps",
        description: "Create personal warps",
        type: "limit",
        value: 5,
      },
      {
        id: "xp_boost",
        name: "XP Boost",
        description: "75% extra experience",
        type: "bonus",
        value: 1.75,
      },
      {
        id: "money_boost",
        name: "Money Boost",
        description: "50% extra money",
        type: "bonus",
        value: 1.5,
      },
    ],
    permissions: [
      "essentials.fly",
      "essentials.heal",
      "essentials.feed",
      "essentials.god",
      "essentials.speed",
      "essentials.sethome.multiple.mvp",
      "essentials.setwarp",
      "mvp.chat.format",
      "mvp.nick",
    ],
    inheritance: ["vip+"],
    order: 4,
    isStaff: false,
    isPurchasable: true,
  },
  {
    id: "mvp+",
    name: "MVP+",
    displayName: "MVP+",
    color: "#0891B2",
    prefix: "[MVP+]",
    suffix: "◆◆",
    price: 899,
    description: "Enhanced MVP with exclusive privileges",
    features: [
      {
        id: "all_mvp",
        name: "All MVP Features",
        description: "Includes all MVP features",
        type: "permission",
      },
      {
        id: "gamemode",
        name: "Gamemode",
        description: "Change gamemode",
        type: "command",
        value: "/gamemode",
      },
      {
        id: "time",
        name: "Time Control",
        description: "Change personal time",
        type: "command",
        value: "/ptime",
      },
      {
        id: "weather",
        name: "Weather Control",
        description: "Change personal weather",
        type: "command",
        value: "/pweather",
      },
      {
        id: "homes",
        name: "Unlimited Homes",
        description: "Set unlimited homes",
        type: "limit",
        value: -1,
      },
      {
        id: "warps",
        name: "Private Warps",
        description: "Create personal warps",
        type: "limit",
        value: 10,
      },
      {
        id: "xp_boost",
        name: "XP Boost",
        description: "100% extra experience",
        type: "bonus",
        value: 2.0,
      },
      {
        id: "money_boost",
        name: "Money Boost",
        description: "75% extra money",
        type: "bonus",
        value: 1.75,
      },
    ],
    permissions: [
      "essentials.gamemode",
      "essentials.time",
      "essentials.weather",
      "essentials.sethome.multiple.mvpplus",
      "mvpplus.all",
    ],
    inheritance: ["mvp"],
    order: 5,
    isStaff: false,
    isPurchasable: true,
  },
  {
    id: "legend",
    name: "Legend",
    displayName: "Legend",
    color: "#10B981",
    prefix: "[LEGEND]",
    suffix: "★",
    price: 1299,
    description: "Legendary status with ultimate features",
    features: [
      {
        id: "all_mvpplus",
        name: "All MVP+ Features",
        description: "Includes all MVP+ features",
        type: "permission",
      },
      {
        id: "creative",
        name: "Creative Access",
        description: "Access to creative world",
        type: "permission",
      },
      {
        id: "worldedit",
        name: "WorldEdit",
        description: "Advanced building tools",
        type: "permission",
      },
      {
        id: "disguise",
        name: "Disguise",
        description: "Disguise as other players/mobs",
        type: "command",
        value: "/disguise",
      },
      {
        id: "trail",
        name: "Particle Trails",
        description: "Custom particle effects",
        type: "cosmetic",
      },
      {
        id: "xp_boost",
        name: "XP Boost",
        description: "150% extra experience",
        type: "bonus",
        value: 2.5,
      },
      {
        id: "money_boost",
        name: "Money Boost",
        description: "100% extra money",
        type: "bonus",
        value: 2.0,
      },
    ],
    permissions: ["worldedit.*", "disguise.player.*", "trail.*", "legend.all"],
    inheritance: ["mvp+"],
    order: 6,
    isStaff: false,
    isPurchasable: true,
  },
  {
    id: "legend+",
    name: "Legend+",
    displayName: "Legend+",
    color: "#059669",
    prefix: "[LEGEND+]",
    suffix: "★★",
    price: 1799,
    description: "Enhanced Legend with exclusive benefits",
    features: [
      {
        id: "all_legend",
        name: "All Legend Features",
        description: "Includes all Legend features",
        type: "permission",
      },
      {
        id: "fly_speed",
        name: "Unlimited Flight Speed",
        description: "Maximum flight speed",
        type: "command",
      },
      {
        id: "item_spawning",
        name: "Item Spawning",
        description: "Spawn any item",
        type: "command",
        value: "/give",
      },
      {
        id: "enchanting",
        name: "Custom Enchanting",
        description: "Apply any enchantment",
        type: "command",
      },
      {
        id: "xp_boost",
        name: "XP Boost",
        description: "200% extra experience",
        type: "bonus",
        value: 3.0,
      },
      {
        id: "money_boost",
        name: "Money Boost",
        description: "150% extra money",
        type: "bonus",
        value: 2.5,
      },
    ],
    permissions: ["essentials.give", "essentials.enchant", "legendplus.all"],
    inheritance: ["legend"],
    order: 7,
    isStaff: false,
    isPurchasable: true,
  },
  {
    id: "ultimate",
    name: "Ultimate",
    displayName: "Ultimate",
    color: "#7C3AED",
    prefix: "[ULTIMATE]",
    suffix: "♦",
    price: 2499,
    description: "The ultimate rank with all possible features",
    features: [
      {
        id: "all_features",
        name: "All Features",
        description: "Access to everything",
        type: "permission",
      },
      {
        id: "custom_prefix",
        name: "Custom Prefix",
        description: "Create your own prefix",
        type: "cosmetic",
      },
      {
        id: "exclusive_worlds",
        name: "Exclusive Worlds",
        description: "Access to VIP-only worlds",
        type: "permission",
      },
      {
        id: "priority_support",
        name: "Priority Support",
        description: "Skip support queues",
        type: "bonus",
      },
      {
        id: "xp_boost",
        name: "XP Boost",
        description: "300% extra experience",
        type: "bonus",
        value: 4.0,
      },
      {
        id: "money_boost",
        name: "Money Boost",
        description: "200% extra money",
        type: "bonus",
        value: 3.0,
      },
    ],
    permissions: ["*"],
    inheritance: ["legend+"],
    order: 8,
    isStaff: false,
    isPurchasable: true,
  },
];

// Comprehensive Store Items
export const storeItemsData: StoreItemData[] = [
  // RANKS
  ...ranksData
    .filter((rank) => rank.isPurchasable)
    .map((rank) => ({
      id: `${rank.id}-rank`,
      name: `${rank.displayName} Rank`,
      displayName: `${rank.displayName} Rank`,
      description: rank.description,
      longDescription: `Upgrade to ${rank.displayName} rank and unlock: ${rank.features.map((f) => f.name).join(", ")}`,
      category: "ranks" as const,
      type: "rank" as const,
      price: rank.price,
      currency: "money" as const,
      isAvailable: true,
      isPermanent: true,
      isLimited: false,
      tags: ["rank", "permanent", "popular"],
      featured: ["vip", "mvp", "legend"].includes(rank.id),
      popular: ["vip", "mvp"].includes(rank.id),
      isNew: false,
      deliveryCommands: [
        {
          command: "lp",
          args: ["user", "{username}", "parent", "set", rank.id],
          delay: 0,
          retryOnFail: true,
        },
        {
          command: "broadcast",
          args: [
            "{username}",
            "has",
            "been",
            "promoted",
            "to",
            rank.displayName + "!",
          ],
          delay: 1,
        },
      ],
      deliveryMessage: `Congratulations! You are now a ${rank.displayName}!`,
      requirements: [],
      icon: "crown",
      image: `/images/ranks/${rank.id}-badge.svg`,
      totalSales: Math.floor(Math.random() * 1000),
      rating: 4.5 + Math.random() * 0.5,
      reviews: Math.floor(Math.random() * 100),
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date(),
    })),

  // KITS
  {
    id: "starter-kit",
    name: "Starter Kit",
    displayName: "Starter Survival Kit",
    description: "Essential items for new players to get started",
    longDescription:
      "Perfect for beginners! Includes diamond armor, tools, food, and building materials to kickstart your adventure.",
    category: "kits",
    type: "kit",
    price: 99,
    currency: "money",
    isAvailable: true,
    isPermanent: false,
    isLimited: false,
    tags: ["beginner", "survival", "popular"],
    featured: true,
    popular: true,
    isNew: false,
    deliveryCommands: [
      {
        command: "give",
        args: ["{username}", "diamond_helmet", "1"],
        delay: 0,
      },
      {
        command: "give",
        args: ["{username}", "diamond_chestplate", "1"],
        delay: 0,
      },
      {
        command: "give",
        args: ["{username}", "diamond_leggings", "1"],
        delay: 0,
      },
      { command: "give", args: ["{username}", "diamond_boots", "1"], delay: 0 },
      { command: "give", args: ["{username}", "diamond_sword", "1"], delay: 0 },
      {
        command: "give",
        args: ["{username}", "diamond_pickaxe", "1"],
        delay: 0,
      },
      { command: "give", args: ["{username}", "diamond_axe", "1"], delay: 0 },
      {
        command: "give",
        args: ["{username}", "diamond_shovel", "1"],
        delay: 0,
      },
      { command: "give", args: ["{username}", "golden_apple", "16"], delay: 0 },
      { command: "give", args: ["{username}", "bread", "32"], delay: 0 },
      { command: "give", args: ["{username}", "oak_planks", "64"], delay: 0 },
    ],
    deliveryMessage:
      "Your Starter Kit has been delivered! Check your inventory.",
    requirements: [],
    icon: "package",
    image: "/images/packs/starter-kit.svg",
    totalSales: 1250,
    rating: 4.7,
    reviews: 89,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
  },
  {
    id: "builder-kit",
    name: "Builder Kit",
    displayName: "Master Builder Kit",
    description: "Everything a master builder needs for epic constructions",
    longDescription:
      "Unleash your creativity! Includes various building blocks, tools, and WorldEdit access for ultimate building power.",
    category: "kits",
    type: "kit",
    price: 149,
    currency: "money",
    isAvailable: true,
    isPermanent: false,
    isLimited: false,
    tags: ["building", "creative", "worldedit"],
    featured: false,
    popular: true,
    isNew: false,
    deliveryCommands: [
      { command: "give", args: ["{username}", "stone", "320"], delay: 0 },
      { command: "give", args: ["{username}", "oak_planks", "320"], delay: 0 },
      { command: "give", args: ["{username}", "glass", "128"], delay: 0 },
      { command: "give", args: ["{username}", "white_wool", "64"], delay: 0 },
      { command: "give", args: ["{username}", "bricks", "64"], delay: 0 },
      {
        command: "give",
        args: [
          "{username}",
          "netherite_pickaxe",
          "1",
          '{Enchantments:[{id:"efficiency",lvl:5},{id:"unbreaking",lvl:3}]}',
        ],
        delay: 0,
      },
      {
        command: "give",
        args: [
          "{username}",
          "netherite_axe",
          "1",
          '{Enchantments:[{id:"efficiency",lvl:5},{id:"unbreaking",lvl:3}]}',
        ],
        delay: 0,
      },
      {
        command: "lp",
        args: [
          "user",
          "{username}",
          "permission",
          "set",
          "worldedit.wand",
          "true",
        ],
        delay: 1,
      },
    ],
    deliveryMessage:
      "Your Builder Kit has been delivered! Start creating amazing builds!",
    requirements: [],
    icon: "hammer",
    image: "/images/packs/builder-kit.svg",
    totalSales: 890,
    rating: 4.6,
    reviews: 67,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
  },
  {
    id: "combat-kit",
    name: "Combat Kit",
    displayName: "PvP Master Kit",
    description: "Dominate in combat with professional PvP gear",
    longDescription:
      "Gear up for battle! Includes enchanted netherite armor, weapons, potions, and everything needed for PvP dominance.",
    category: "kits",
    type: "kit",
    price: 199,
    currency: "money",
    isAvailable: true,
    isPermanent: false,
    isLimited: false,
    tags: ["pvp", "combat", "enchanted"],
    featured: true,
    popular: true,
    isNew: true,
    deliveryCommands: [
      {
        command: "give",
        args: [
          "{username}",
          "netherite_helmet",
          "1",
          '{Enchantments:[{id:"protection",lvl:4},{id:"unbreaking",lvl:3}]}',
        ],
        delay: 0,
      },
      {
        command: "give",
        args: [
          "{username}",
          "netherite_chestplate",
          "1",
          '{Enchantments:[{id:"protection",lvl:4},{id:"unbreaking",lvl:3}]}',
        ],
        delay: 0,
      },
      {
        command: "give",
        args: [
          "{username}",
          "netherite_leggings",
          "1",
          '{Enchantments:[{id:"protection",lvl:4},{id:"unbreaking",lvl:3}]}',
        ],
        delay: 0,
      },
      {
        command: "give",
        args: [
          "{username}",
          "netherite_boots",
          "1",
          '{Enchantments:[{id:"protection",lvl:4},{id:"unbreaking",lvl:3}]}',
        ],
        delay: 0,
      },
      {
        command: "give",
        args: [
          "{username}",
          "netherite_sword",
          "1",
          '{Enchantments:[{id:"sharpness",lvl:5},{id:"unbreaking",lvl:3}]}',
        ],
        delay: 0,
      },
      {
        command: "give",
        args: [
          "{username}",
          "bow",
          "1",
          '{Enchantments:[{id:"power",lvl:5},{id:"unbreaking",lvl:3}]}',
        ],
        delay: 0,
      },
      { command: "give", args: ["{username}", "arrow", "64"], delay: 0 },
      {
        command: "give",
        args: ["{username}", "potion", "8", '{Potion:"strong_strength"}'],
        delay: 0,
      },
      {
        command: "give",
        args: ["{username}", "potion", "8", '{Potion:"strong_swiftness"}'],
        delay: 0,
      },
      { command: "give", args: ["{username}", "golden_apple", "8"], delay: 0 },
    ],
    deliveryMessage: "Your Combat Kit has been delivered! Prepare for battle!",
    requirements: [{ type: "level", value: 10, operator: "gte" }],
    icon: "sword",
    image: "/images/packs/combat-kit.svg",
    totalSales: 567,
    rating: 4.8,
    reviews: 45,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
  },

  // CURRENCY
  {
    id: "coins-1000",
    name: "1,000 Coins",
    displayName: "1,000 Server Coins",
    description: "Boost your in-game wealth with 1,000 coins",
    longDescription:
      "Server coins can be used to trade with other players, buy from player shops, and participate in the server economy.",
    category: "currency",
    type: "currency",
    price: 149,
    currency: "money",
    isAvailable: true,
    isPermanent: false,
    isLimited: false,
    tags: ["currency", "popular", "economy"],
    featured: true,
    popular: true,
    isNew: false,
    deliveryCommands: [
      { command: "eco", args: ["give", "{username}", "1000"], delay: 0 },
    ],
    deliveryMessage: "1,000 coins have been added to your account!",
    requirements: [],
    icon: "coins",
    image: "/images/ui/coins.svg",
    totalSales: 2341,
    rating: 4.9,
    reviews: 156,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
  },
  {
    id: "coins-5000",
    name: "5,000 Coins",
    displayName: "5,000 Server Coins",
    description: "Massive coin boost for serious traders",
    longDescription:
      "Perfect for high-value transactions and investments. Become a wealthy player with this substantial coin package.",
    category: "currency",
    type: "currency",
    price: 599,
    originalPrice: 745,
    currency: "money",
    discount: 20,
    isAvailable: true,
    isPermanent: false,
    isLimited: false,
    tags: ["currency", "bulk", "discount"],
    featured: false,
    popular: true,
    isNew: false,
    deliveryCommands: [
      { command: "eco", args: ["give", "{username}", "5000"], delay: 0 },
    ],
    deliveryMessage: "5,000 coins have been added to your account!",
    requirements: [],
    icon: "coins",
    image: "/images/ui/coins.svg",
    totalSales: 1123,
    rating: 4.8,
    reviews: 89,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
  },
  {
    id: "gems-100",
    name: "100 Gems",
    displayName: "100 Premium Gems",
    description: "Premium currency for exclusive items",
    longDescription:
      "Gems are our premium currency used for special cosmetics, exclusive items, and unique server features.",
    category: "currency",
    type: "currency",
    price: 299,
    currency: "money",
    isAvailable: true,
    isPermanent: false,
    isLimited: false,
    tags: ["premium", "gems", "exclusive"],
    featured: true,
    popular: false,
    isNew: true,
    deliveryCommands: [
      { command: "gems", args: ["give", "{username}", "100"], delay: 0 },
    ],
    deliveryMessage: "100 gems have been added to your account!",
    requirements: [],
    icon: "gem",
    image: "/images/ui/gems.svg",
    totalSales: 445,
    rating: 4.6,
    reviews: 34,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date(),
  },

  // COSMETICS
  {
    id: "rainbow-trail",
    name: "Rainbow Trail",
    displayName: "Rainbow Particle Trail",
    description: "Leave a beautiful rainbow trail wherever you go",
    longDescription:
      "Stand out from the crowd with this stunning rainbow particle effect that follows you around the server.",
    category: "cosmetics",
    type: "cosmetic",
    price: 199,
    currency: "money",
    isAvailable: true,
    isPermanent: true,
    isLimited: false,
    tags: ["cosmetic", "particles", "rainbow"],
    featured: false,
    popular: true,
    isNew: false,
    deliveryCommands: [
      { command: "trails", args: ["give", "{username}", "rainbow"], delay: 0 },
    ],
    deliveryMessage: "Rainbow trail unlocked! Use /trails to activate.",
    requirements: [{ type: "rank", value: "vip", operator: "gte" }],
    icon: "sparkles",
    image: "/images/cosmetics/rainbow-trail.svg",
    totalSales: 678,
    rating: 4.7,
    reviews: 45,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
  },

  // TOOLS & WEAPONS
  {
    id: "enchanted-pickaxe",
    name: "Enchanted Pickaxe",
    displayName: "Legendary Mining Pickaxe",
    description: "Ultimate mining tool with maximum enchantments",
    longDescription:
      "This legendary pickaxe features Efficiency V, Unbreaking III, Fortune III, and Mending for the ultimate mining experience.",
    category: "tools",
    type: "tool",
    price: 249,
    currency: "money",
    isAvailable: true,
    isPermanent: false,
    isLimited: false,
    tags: ["tool", "enchanted", "mining"],
    featured: false,
    popular: true,
    isNew: false,
    deliveryCommands: [
      {
        command: "give",
        args: [
          "{username}",
          "netherite_pickaxe",
          "1",
          '{display:{Name:\'{"text":"Legendary Pickaxe","color":"gold","bold":true}\'},Enchantments:[{id:"efficiency",lvl:5},{id:"unbreaking",lvl:3},{id:"fortune",lvl:3},{id:"mending",lvl:1}]}',
        ],
        delay: 0,
      },
    ],
    deliveryMessage: "Your Legendary Mining Pickaxe has been delivered!",
    requirements: [{ type: "level", value: 15, operator: "gte" }],
    icon: "pickaxe",
    image: "/images/tools/legendary-pickaxe.svg",
    totalSales: 334,
    rating: 4.9,
    reviews: 28,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date(),
  },
];

// Delivery command templates
export const deliveryTemplates = {
  rankUpgrade: (rank: string): DeliveryCommand[] => [
    {
      command: "lp",
      args: ["user", "{username}", "parent", "set", rank],
      delay: 0,
      retryOnFail: true,
    },
    {
      command: "broadcast",
      args: [
        "{username}",
        "has",
        "been",
        "promoted",
        "to",
        rank.toUpperCase() + "!",
      ],
      delay: 1,
    },
    {
      command: "title",
      args: [
        "{username}",
        "title",
        `{"text":"RANK UP!","color":"gold","bold":true}`,
      ],
      delay: 2,
    },
    {
      command: "title",
      args: [
        "{username}",
        "subtitle",
        `{"text":"Welcome to ${rank.toUpperCase()}","color":"yellow"}`,
      ],
      delay: 2,
    },
  ],

  giveCoins: (amount: number): DeliveryCommand[] => [
    {
      command: "eco",
      args: ["give", "{username}", amount.toString()],
      delay: 0,
      retryOnFail: true,
    },
    {
      command: "tellraw",
      args: [
        "{username}",
        `{"text":"${amount} coins have been added to your account!","color":"green"}`,
      ],
      delay: 1,
    },
  ],

  giveItem: (
    item: string,
    quantity: number,
    enchantments?: string,
  ): DeliveryCommand[] => [
    {
      command: "give",
      args: [
        "{username}",
        item,
        quantity.toString(),
        ...(enchantments ? [enchantments] : []),
      ],
      delay: 0,
      retryOnFail: true,
    },
  ],

  kitDelivery: (
    items: Array<{ item: string; quantity: number; enchantments?: string }>,
  ): DeliveryCommand[] => [
    ...items.map((item, index) => ({
      command: "give",
      args: [
        "{username}",
        item.item,
        item.quantity.toString(),
        ...(item.enchantments ? [item.enchantments] : []),
      ],
      delay: index * 0.1,
      retryOnFail: true,
    })),
    {
      command: "tellraw",
      args: [
        "{username}",
        '{"text":"Kit delivered! Check your inventory.","color":"green"}',
      ],
      delay: items.length * 0.1 + 1,
    },
  ],
};
