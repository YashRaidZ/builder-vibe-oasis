// Database schemas and data management for IndusNetwork

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

// Enhanced Player schema
export interface PlayerData {
  id: string;
  uuid: string;
  username: string;
  email?: string;
  rank: PlayerRank;
  balance: number;
  gems: number; // Premium currency
  level: number;
  experience: number;
  totalPlaytime: number; // in seconds
  lastSeen: Date;
  joinDate: Date;
  ipAddress?: string;

  // Statistics
  stats: PlayerStats;

  // Preferences
  preferences: PlayerPreferences;

  // Verification
  isVerified: boolean;
  verificationCode?: string;
  verificationExpiry?: Date;

  // Status
  isOnline: boolean;
  currentWorld?: string;
  location?: PlayerLocation;

  // Moderation
  isBanned: boolean;
  banReason?: string;
  banExpiry?: Date;
  warnings: Warning[];
}

export interface PlayerStats {
  // Combat
  kills: number;
  deaths: number;
  mobKills: number;
  playerKills: number;

  // Building
  blocksPlaced: number;
  blocksBroken: number;

  // Economy
  moneyEarned: number;
  moneySpent: number;

  // Achievements
  achievementsUnlocked: number;

  // Social
  friendsCount: number;
  guildId?: string;
}

export interface PlayerPreferences {
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    discord: boolean;
    inGame: boolean;
  };
  privacy: {
    showStats: boolean;
    showOnlineStatus: boolean;
    allowFriendRequests: boolean;
  };
}

export interface PlayerLocation {
  world: string;
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
}

export interface Warning {
  id: string;
  reason: string;
  issuedBy: string;
  issuedAt: Date;
  severity: "low" | "medium" | "high";
}

// Enhanced Rank system
export type PlayerRank =
  | "default"
  | "helper"
  | "vip"
  | "vip+"
  | "mvp"
  | "mvp+"
  | "legend"
  | "legend+"
  | "ultimate"
  | "moderator"
  | "admin"
  | "owner";

export interface RankData {
  id: PlayerRank;
  name: string;
  displayName: string;
  color: string;
  prefix: string;
  suffix?: string;
  price: number;
  description: string;
  features: RankFeature[];
  permissions: string[];
  inheritance: PlayerRank[];
  order: number;
  isStaff: boolean;
  isPurchasable: boolean;
}

export interface RankFeature {
  id: string;
  name: string;
  description: string;
  type: "command" | "permission" | "limit" | "bonus";
  value?: string | number;
}

// Enhanced Store Items
export interface StoreItemData {
  id: string;
  name: string;
  displayName: string;
  description: string;
  longDescription?: string;
  category: StoreCategory;
  type: ItemType;
  price: number;
  originalPrice?: number; // For discounts
  currency: "money" | "gems";

  // Availability
  isAvailable: boolean;
  isPermanent: boolean;
  isLimited: boolean;
  stock?: number;
  maxPurchases?: number;

  // Metadata
  tags: string[];
  featured: boolean;
  popular: boolean;
  isNew: boolean;
  discount?: number; // Percentage

  // Delivery
  deliveryCommands: DeliveryCommand[];
  deliveryMessage?: string;

  // Requirements
  requirements: ItemRequirement[];

  // Visual
  icon: string;
  image?: string;
  preview?: string[];

  // Analytics
  totalSales: number;
  rating: number;
  reviews: number;

  createdAt: Date;
  updatedAt: Date;
}

export type StoreCategory =
  | "ranks"
  | "kits"
  | "items"
  | "currency"
  | "cosmetics"
  | "tools"
  | "weapons"
  | "armor"
  | "boosters"
  | "access"
  | "special";

export interface DeliveryCommand {
  command: string;
  args: string[];
  delay?: number; // seconds
  condition?: string;
  retryOnFail?: boolean;
}

export interface ItemRequirement {
  type: "rank" | "level" | "playtime" | "achievement" | "permission";
  value: string | number;
  operator: "eq" | "gt" | "gte" | "lt" | "lte";
}

// Purchase and Transaction system
export interface Transaction {
  id: string;
  playerId: string;
  itemId: string;
  quantity: number;
  totalPrice: number;
  currency: "money" | "gems";

  // Payment
  paymentMethod: "razorpay" | "paypal" | "stripe" | "ingame";
  paymentId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;

  // Status
  status: TransactionStatus;
  deliveryStatus: DeliveryStatus;

  // Timestamps
  createdAt: Date;
  paidAt?: Date;
  deliveredAt?: Date;
  failedAt?: Date;

  // Delivery
  deliveryAttempts: DeliveryAttempt[];
  deliveryError?: string;

  // Metadata
  ipAddress?: string;
  userAgent?: string;
  discount?: number;
  couponCode?: string;

  // Refund
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: Date;
}

export type TransactionStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";

export type DeliveryStatus =
  | "pending"
  | "processing"
  | "delivered"
  | "failed"
  | "partial";

export interface DeliveryAttempt {
  id: string;
  attemptNumber: number;
  timestamp: Date;
  success: boolean;
  error?: string;
  commandsExecuted: string[];
  rconResponse?: string;
}

// Delivery Queue system
export interface DeliveryQueue {
  id: string;
  transactionId: string;
  playerId: string;
  playerUsername: string;
  itemId: string;
  commands: DeliveryCommand[];
  priority: number; // Higher = more important
  status: "queued" | "processing" | "completed" | "failed";
  attempts: number;
  maxAttempts: number;
  nextAttempt?: Date;
  createdAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  error?: string;
}

// RCON Management
export interface RconConnection {
  id: string;
  host: string;
  port: number;
  password: string;
  isConnected: boolean;
  lastPing?: Date;
  connectionAttempts: number;
  maxConnectionAttempts: number;
}

export interface RconCommand {
  id: string;
  command: string;
  args: string[];
  playerTarget?: string;
  priority: number;
  timestamp: Date;
  executed: boolean;
  response?: string;
  error?: string;
  executedAt?: Date;
}

// Analytics and Reporting
export interface SalesAnalytics {
  date: Date;
  itemId: string;
  quantity: number;
  revenue: number;
  currency: "money" | "gems";
}

export interface PlayerAnalytics {
  playerId: string;
  date: Date;
  playtime: number;
  moneyEarned: number;
  moneySpent: number;
  blocksPlaced: number;
  blocksBroken: number;
}

// Server Status
export interface ServerStatus {
  isOnline: boolean;
  playerCount: number;
  maxPlayers: number;
  tps: number;
  memoryUsed: number;
  memoryMax: number;
  cpuUsage: number;
  uptime: number;
  version: string;
  plugins: PluginStatus[];
  lastUpdated: Date;
}

export interface PluginStatus {
  name: string;
  version: string;
  enabled: boolean;
  loaded: boolean;
}

// Notification system
export interface Notification {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
  readAt?: Date;
}

export type NotificationType =
  | "purchase_success"
  | "purchase_failed"
  | "delivery_success"
  | "delivery_failed"
  | "rank_upgrade"
  | "achievement_unlock"
  | "friend_request"
  | "system_announcement";

// Configuration
export interface SystemConfig {
  maintenance: {
    enabled: boolean;
    message: string;
    allowedRoles: PlayerRank[];
  };
  store: {
    enabled: boolean;
    taxRate: number;
    currencies: {
      money: {
        name: string;
        symbol: string;
        decimals: number;
      };
      gems: {
        name: string;
        symbol: string;
        decimals: number;
      };
    };
  };
  delivery: {
    enabled: boolean;
    maxAttempts: number;
    retryDelay: number; // seconds
    batchSize: number;
    processingInterval: number; // seconds
  };
  rcon: {
    enabled: boolean;
    timeout: number; // seconds
    maxConnections: number;
  };
}
