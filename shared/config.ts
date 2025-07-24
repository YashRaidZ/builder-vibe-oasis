// Environment configuration for both client and server

export const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 8080,
    host: process.env.HOST || 'localhost',
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // API Configuration
  api: {
    baseUrl: typeof window !== 'undefined' 
      ? import.meta.env.VITE_API_BASE_URL || '/api'
      : process.env.API_BASE_URL || 'http://localhost:8080/api',
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/indusnetwork',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '27017'),
    name: process.env.DATABASE_NAME || 'indusnetwork',
  },

  // Redis Configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },

  // Authentication & Security
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    sessionSecret: process.env.SESSION_SECRET || 'fallback_session_secret',
    verificationCodeExpires: parseInt(process.env.VERIFICATION_CODE_EXPIRES || '600'),
  },

  // Minecraft Server Configuration
  minecraft: {
    server: {
      host: process.env.MINECRAFT_SERVER_HOST || 'indusnetwork.highms.pro',
      port: parseInt(process.env.MINECRAFT_SERVER_PORT || '25826'),
    },
    rcon: {
      host: process.env.MINECRAFT_RCON_HOST || 'indusnetwork.highms.pro',
      port: parseInt(process.env.MINECRAFT_RCON_PORT || '25575'),
      password: process.env.MINECRAFT_RCON_PASSWORD || '',
    },
  },

  // Payment Gateway Configuration
  payments: {
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID || '',
      keySecret: process.env.RAZORPAY_KEY_SECRET || '',
      webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
    },
  },

  // Email Configuration
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      user: process.env.SMTP_USER || '',
      password: process.env.SMTP_PASS || '',
    },
    from: process.env.FROM_EMAIL || 'noreply@indusnetwork.com',
  },

  // Discord Configuration
  discord: {
    botToken: process.env.DISCORD_BOT_TOKEN || '',
    guildId: process.env.DISCORD_GUILD_ID || '',
    webhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
  },

  // External APIs
  external: {
    mojangApi: process.env.MOJANG_API_URL || 'https://api.mojang.com',
    minecraftServicesApi: process.env.MINECRAFT_SERVICES_API || 'https://api.minecraftservices.com',
  },

  // File Storage
  storage: {
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['.jpg', '.jpeg', '.png', '.gif', '.pdf'],
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/indusnetwork.log',
  },

  // Feature Flags
  features: {
    enableRegistration: process.env.ENABLE_REGISTRATION === 'true',
    enablePayments: process.env.ENABLE_PAYMENTS === 'true',
    enableDiscordIntegration: process.env.ENABLE_DISCORD_INTEGRATION === 'true',
    enableRcon: process.env.ENABLE_RCON === 'true',
    enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
  },

  // Analytics
  analytics: {
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || '',
  },

  // Admin Configuration
  admin: {
    panelEnabled: process.env.ADMIN_PANEL_ENABLED === 'true',
    defaultUsername: process.env.ADMIN_DEFAULT_USERNAME || 'admin',
    defaultPassword: process.env.ADMIN_DEFAULT_PASSWORD || 'change_this_password',
  },

  // Backup Configuration
  backup: {
    enabled: process.env.BACKUP_ENABLED === 'true',
    interval: parseInt(process.env.BACKUP_INTERVAL || '24'), // hours
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30'),
    location: process.env.BACKUP_LOCATION || './backups',
  },

  // Development
  dev: {
    devServerUrl: process.env.VITE_DEV_SERVER_URL || 'http://localhost:8080',
    debug: process.env.DEBUG === 'true',
    enableCors: process.env.ENABLE_CORS === 'true',
  },
};

// Helper functions
export const isDevelopment = () => config.server.nodeEnv === 'development';
export const isProduction = () => config.server.nodeEnv === 'production';
export const isClient = () => typeof window !== 'undefined';
export const isServer = () => typeof window === 'undefined';

// API Endpoints
export const apiEndpoints = {
  // Authentication
  auth: {
    login: `${config.api.baseUrl}/auth/login`,
    logout: `${config.api.baseUrl}/auth/logout`,
    register: `${config.api.baseUrl}/auth/register`,
    requestVerification: `${config.api.baseUrl}/auth/request-verification`,
    verifyCode: `${config.api.baseUrl}/auth/verify-code`,
    status: `${config.api.baseUrl}/auth/status`,
  },

  // Players
  players: {
    list: `${config.api.baseUrl}/players`,
    online: `${config.api.baseUrl}/players/online`,
    get: (id: string) => `${config.api.baseUrl}/players/${id}`,
    updateRank: (id: string) => `${config.api.baseUrl}/players/${id}/rank`,
  },

  // Server
  server: {
    status: `${config.api.baseUrl}/server/status`,
    rcon: `${config.api.baseUrl}/server/rcon`,
    restart: `${config.api.baseUrl}/server/restart`,
    stop: `${config.api.baseUrl}/server/stop`,
    backup: `${config.api.baseUrl}/server/backup`,
    actions: `${config.api.baseUrl}/server/actions`,
  },

  // Store
  store: {
    items: `${config.api.baseUrl}/store/items`,
    item: (id: string) => `${config.api.baseUrl}/store/items/${id}`,
    purchase: `${config.api.baseUrl}/store/purchase`,
    purchases: `${config.api.baseUrl}/store/purchases`,
    retryDelivery: (id: string) => `${config.api.baseUrl}/store/purchases/${id}/retry`,
  },

  // Leaderboards
  leaderboards: {
    list: `${config.api.baseUrl}/leaderboards`,
    get: (type: string) => `${config.api.baseUrl}/leaderboards/${type}`,
    playerRanking: (type: string, playerId: string) => 
      `${config.api.baseUrl}/leaderboards/${type}/player/${playerId}`,
    update: (type: string) => `${config.api.baseUrl}/leaderboards/${type}`,
  },

  // Plugins
  plugins: {
    list: `${config.api.baseUrl}/plugins`,
    get: (id: string) => `${config.api.baseUrl}/plugins/${id}`,
    toggle: (id: string) => `${config.api.baseUrl}/plugins/${id}/toggle`,
    reload: (id: string) => `${config.api.baseUrl}/plugins/${id}/reload`,
    commands: (id: string) => `${config.api.baseUrl}/plugins/${id}/commands`,
    permissions: (id: string) => `${config.api.baseUrl}/plugins/${id}/permissions`,
  },
};

export default config;
