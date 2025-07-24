// Player and Server Types
export interface Player {
  id: string;
  uuid: string;
  username: string;
  rank: string;
  balance: number;
  level: number;
  experience: number;
  playtime: number;
  lastSeen: string;
  joinDate: string;
  kills: number;
  deaths: number;
  blocksPlaced: number;
  blocksBroken: number;
  achievements: Achievement[];
  isOnline: boolean;
  location?: {
    world: string;
    x: number;
    y: number;
    z: number;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface ServerStats {
  onlinePlayers: number;
  maxPlayers: number;
  tps: number;
  memoryUsed: number;
  memoryMax: number;
  uptime: number;
  version: string;
  motd: string;
  players: OnlinePlayer[];
}

export interface OnlinePlayer {
  username: string;
  uuid: string;
  rank: string;
  world: string;
  ping: number;
}

// Store and Payment Types
export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: StoreCategory;
  type: ItemType;
  icon: string;
  popular: boolean;
  commands: string[];
  metadata: Record<string, any>;
}

export type StoreCategory = 'ranks' | 'items' | 'currency' | 'cosmetics' | 'kits';
export type ItemType = 'rank' | 'item_bundle' | 'currency' | 'cosmetic' | 'kit';

export interface Purchase {
  id: string;
  playerId: string;
  itemId: string;
  price: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentId: string;
  createdAt: string;
  deliveredAt?: string;
  failureReason?: string;
}

// RCON and Server Management Types
export interface RconCommand {
  command: string;
  args?: string[];
}

export interface RconResponse {
  success: boolean;
  output: string;
  timestamp: string;
}

export interface ServerAction {
  id: string;
  type: 'restart' | 'stop' | 'backup' | 'update' | 'command';
  status: 'pending' | 'running' | 'completed' | 'failed';
  initiatedBy: string;
  createdAt: string;
  completedAt?: string;
  output?: string;
}

// Plugin Management Types
export interface Plugin {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  description: string;
  author: string;
  dependencies: string[];
  commands: PluginCommand[];
  permissions: PluginPermission[];
}

export interface PluginCommand {
  name: string;
  description: string;
  usage: string;
  permission?: string;
}

export interface PluginPermission {
  name: string;
  description: string;
  default: boolean;
}

// Leaderboard Types
export interface Leaderboard {
  type: 'kills' | 'deaths' | 'playtime' | 'level' | 'balance' | 'blocks_placed' | 'blocks_broken';
  title: string;
  entries: LeaderboardEntry[];
  lastUpdated: string;
}

export interface LeaderboardEntry {
  rank: number;
  player: {
    username: string;
    uuid: string;
    rank: string;
  };
  value: number;
  change: number; // Position change from last update
}

// Webhook and Event Types
export interface WebhookEvent {
  type: 'player_join' | 'player_leave' | 'purchase_delivery' | 'achievement_unlock' | 'server_start' | 'server_stop';
  data: any;
  timestamp: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
