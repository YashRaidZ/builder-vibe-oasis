-- IndusNetwork Database Schema - SQLite Version
-- This is a simplified SQLite version for development and testing
-- For production, use the MySQL version (indusnetwork_schema.sql)

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- ============================================================================
-- USER MANAGEMENT TABLES
-- ============================================================================

-- Users table for website authentication
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email_verified BOOLEAN DEFAULT 0,
    email_verification_token TEXT,
    email_verification_expires DATETIME,
    password_reset_token TEXT,
    password_reset_expires DATETIME,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT 1,
    is_admin BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token TEXT NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================================
-- MINECRAFT PLAYER TABLES
-- ============================================================================

-- Minecraft players
CREATE TABLE IF NOT EXISTS minecraft_players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    minecraft_uuid TEXT NOT NULL UNIQUE,
    minecraft_username TEXT NOT NULL,
    current_rank TEXT DEFAULT 'default',
    coins INTEGER DEFAULT 0,
    total_playtime INTEGER DEFAULT 0,
    last_seen DATETIME,
    is_online BOOLEAN DEFAULT 0,
    first_join DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT 0,
    verification_code TEXT,
    verification_expires DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Player statistics
CREATE TABLE IF NOT EXISTS player_statistics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL UNIQUE,
    kills INTEGER DEFAULT 0,
    deaths INTEGER DEFAULT 0,
    blocks_broken INTEGER DEFAULT 0,
    blocks_placed INTEGER DEFAULT 0,
    distance_walked INTEGER DEFAULT 0,
    playtime_minutes INTEGER DEFAULT 0,
    login_count INTEGER DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES minecraft_players(id) ON DELETE CASCADE
);

-- Player login history
CREATE TABLE IF NOT EXISTS player_login_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    logout_time DATETIME,
    session_duration INTEGER,
    ip_address TEXT,
    FOREIGN KEY (player_id) REFERENCES minecraft_players(id) ON DELETE CASCADE
);

-- ============================================================================
-- RANK SYSTEM TABLES
-- ============================================================================

-- Available ranks
CREATE TABLE IF NOT EXISTS ranks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rank_name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    permission_group TEXT NOT NULL,
    coins_multiplier REAL DEFAULT 1.0,
    price_inr REAL DEFAULT 0.0,
    priority INTEGER DEFAULT 0,
    color_code TEXT DEFAULT '&7',
    is_purchasable BOOLEAN DEFAULT 1,
    is_active BOOLEAN DEFAULT 1,
    description TEXT,
    permissions TEXT, -- JSON as TEXT in SQLite
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default ranks
INSERT OR IGNORE INTO ranks (rank_name, display_name, permission_group, coins_multiplier, price_inr, priority, color_code, description) VALUES
('default', '&7Default', 'default', 1.0, 0.0, 0, '&7', 'Basic player rank'),
('vip', '&a&lVIP', 'vip', 1.5, 199.0, 1, '&a', 'VIP rank with exclusive perks'),
('mvp', '&b&lMVP', 'mvp', 2.0, 499.0, 2, '&b', 'MVP rank with premium features'),
('legend', '&6&lLEGEND', 'legend', 2.5, 999.0, 3, '&6', 'Legendary rank with special abilities'),
('champion', '&c&lCHAMPION', 'champion', 3.0, 1499.0, 4, '&c', 'Champion rank for elite players'),
('master', '&4&lMASTER', 'master', 3.5, 1799.0, 5, '&4', 'Master rank with advanced privileges'),
('grandmaster', '&5&lGRANDMASTER', 'grandmaster', 4.0, 1999.0, 6, '&5', 'Grandmaster rank for veteran players'),
('elite', '&d&lELITE', 'elite', 4.5, 2199.0, 7, '&d', 'Elite rank with exclusive content'),
('supreme', '&e&lSUPREME', 'supreme', 5.0, 2349.0, 8, '&e', 'Supreme rank with ultimate perks'),
('ultimate', '&f&lULTIMATE', 'ultimate', 6.0, 2499.0, 9, '&f', 'Ultimate rank - the highest tier');

-- Rank history
CREATE TABLE IF NOT EXISTS player_rank_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    from_rank TEXT,
    to_rank TEXT NOT NULL,
    changed_by TEXT DEFAULT 'SYSTEM',
    change_reason TEXT,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES minecraft_players(id) ON DELETE CASCADE
);

-- ============================================================================
-- STORE SYSTEM TABLES
-- ============================================================================

-- Store categories
CREATE TABLE IF NOT EXISTS store_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT OR IGNORE INTO store_categories (name, slug, description, icon, sort_order) VALUES
('Ranks', 'ranks', 'Premium server ranks with exclusive perks', 'crown', 1),
('Kits', 'kits', 'Starter kits and equipment packages', 'package', 2),
('Currency', 'currency', 'Server coins and in-game currency', 'coins', 3),
('Cosmetics', 'cosmetics', 'Cosmetic items and customizations', 'palette', 4),
('Tools', 'tools', 'Special tools and equipment', 'wrench', 5);

-- Store items
CREATE TABLE IF NOT EXISTS store_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    price_inr REAL NOT NULL,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    stock_quantity INTEGER,
    max_per_user INTEGER,
    commands TEXT NOT NULL, -- JSON as TEXT
    requirements TEXT, -- JSON as TEXT
    metadata TEXT, -- JSON as TEXT
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES store_categories(id) ON DELETE CASCADE
);

-- Insert sample store items
INSERT OR IGNORE INTO store_items (category_id, name, slug, description, price_inr, commands, is_featured) VALUES
(1, 'VIP Rank', 'vip-rank', 'Upgrade to VIP rank with exclusive perks', 199.0, '[{"command": "lp", "args": ["user", "{username}", "parent", "set", "vip"], "delay": 0}]', 1),
(2, 'Starter Kit', 'starter-kit', 'Complete starter kit with armor and tools', 99.0, '[{"command": "give", "args": ["{username}", "diamond_sword", "1"], "delay": 0}, {"command": "give", "args": ["{username}", "diamond_helmet", "1"], "delay": 1}]', 1),
(3, '1000 Coins', '1000-coins', 'Get 1000 server coins instantly', 149.0, '[{"command": "eco", "args": ["give", "{username}", "1000"], "delay": 0}]', 1);

-- ============================================================================
-- TRANSACTION TABLES
-- ============================================================================

-- Purchase transactions
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    player_id INTEGER,
    item_id INTEGER NOT NULL,
    transaction_id TEXT NOT NULL UNIQUE,
    payment_gateway TEXT NOT NULL DEFAULT 'razorpay',
    amount_inr REAL NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
    payment_data TEXT, -- JSON as TEXT
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (player_id) REFERENCES minecraft_players(id) ON DELETE SET NULL,
    FOREIGN KEY (item_id) REFERENCES store_items(id) ON DELETE CASCADE
);

-- ============================================================================
-- DELIVERY SYSTEM TABLES
-- ============================================================================

-- Delivery queue
CREATE TABLE IF NOT EXISTS delivery_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    delivery_commands TEXT NOT NULL, -- JSON as TEXT
    priority INTEGER DEFAULT 1,
    status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    next_attempt DATETIME,
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    processed_at DATETIME,
    completed_at DATETIME,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES minecraft_players(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES store_items(id) ON DELETE CASCADE
);

-- Delivery attempts log
CREATE TABLE IF NOT EXISTS delivery_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    delivery_id INTEGER NOT NULL,
    attempt_number INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
    error_message TEXT,
    executed_commands TEXT, -- JSON as TEXT
    attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (delivery_id) REFERENCES delivery_queue(id) ON DELETE CASCADE
);

-- ============================================================================
-- LEADERBOARD TABLES
-- ============================================================================

-- Leaderboard types
CREATE TABLE IF NOT EXISTS leaderboard_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    stat_column TEXT NOT NULL,
    sort_order TEXT DEFAULT 'DESC' CHECK (sort_order IN ('ASC', 'DESC')),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default leaderboard types
INSERT OR IGNORE INTO leaderboard_types (name, display_name, description, stat_column, sort_order) VALUES
('kills', 'Top Killers', 'Players with the most kills', 'kills', 'DESC'),
('playtime', 'Most Active', 'Players with the most playtime', 'playtime_minutes', 'DESC'),
('blocks_broken', 'Block Breakers', 'Players who broke the most blocks', 'blocks_broken', 'DESC');

-- Leaderboard cache
CREATE TABLE IF NOT EXISTS leaderboard_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    leaderboard_type TEXT NOT NULL,
    player_id INTEGER NOT NULL,
    rank_position INTEGER NOT NULL,
    score REAL NOT NULL,
    additional_data TEXT, -- JSON as TEXT
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES minecraft_players(id) ON DELETE CASCADE,
    UNIQUE(leaderboard_type, player_id)
);

-- ============================================================================
-- SYSTEM TABLES
-- ============================================================================

-- System configuration
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    config_key TEXT NOT NULL UNIQUE,
    config_value TEXT,
    description TEXT,
    is_public BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default configuration
INSERT OR IGNORE INTO system_config (config_key, config_value, description, is_public) VALUES
('server_ip', 'indusnetwork.highms.pro', 'Server IP address', 1),
('server_port', '25826', 'Server port', 1),
('discord_invite', '', 'Discord server invite link', 1),
('store_enabled', 'true', 'Whether the store is enabled', 1),
('maintenance_mode', 'false', 'Server maintenance mode', 1),
('max_players', '100', 'Maximum player count', 1),
('motd', 'Welcome to IndusNetwork!', 'Server message of the day', 1),
('website_title', 'IndusNetwork - Premium Minecraft Server', 'Website title', 1),
('default_coins', '100', 'Starting coins for new players', 0);

-- Audit log
CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action_type TEXT NOT NULL,
    table_name TEXT,
    record_id INTEGER,
    old_values TEXT, -- JSON as TEXT
    new_values TEXT, -- JSON as TEXT
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_players_uuid ON minecraft_players(minecraft_uuid);
CREATE INDEX IF NOT EXISTS idx_players_username ON minecraft_players(minecraft_username);
CREATE INDEX IF NOT EXISTS idx_players_rank ON minecraft_players(current_rank);
CREATE INDEX IF NOT EXISTS idx_players_online ON minecraft_players(is_online);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_delivery_status ON delivery_queue(status);
CREATE INDEX IF NOT EXISTS idx_delivery_priority ON delivery_queue(priority);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Player overview view
CREATE VIEW IF NOT EXISTS player_overview AS
SELECT 
    mp.id,
    mp.minecraft_uuid,
    mp.minecraft_username,
    mp.current_rank,
    mp.coins,
    mp.total_playtime,
    mp.last_seen,
    mp.is_online,
    mp.is_verified,
    u.username as website_username,
    u.email,
    ps.kills,
    ps.deaths,
    CASE 
        WHEN ps.deaths > 0 THEN ROUND(CAST(ps.kills AS REAL) / ps.deaths, 2)
        ELSE ps.kills
    END as kdr,
    ps.blocks_broken,
    ps.blocks_placed,
    r.display_name as rank_display_name,
    r.color_code as rank_color
FROM minecraft_players mp
LEFT JOIN users u ON mp.user_id = u.id
LEFT JOIN player_statistics ps ON mp.id = ps.player_id
LEFT JOIN ranks r ON mp.current_rank = r.rank_name;

-- Transaction overview view
CREATE VIEW IF NOT EXISTS transaction_overview AS
SELECT 
    t.id,
    t.transaction_id,
    t.amount_inr,
    t.status,
    t.created_at,
    t.completed_at,
    u.username,
    mp.minecraft_username,
    si.name as item_name,
    sc.name as category_name
FROM transactions t
LEFT JOIN users u ON t.user_id = u.id
LEFT JOIN minecraft_players mp ON t.player_id = mp.id
JOIN store_items si ON t.item_id = si.id
JOIN store_categories sc ON si.category_id = sc.id;

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Create sample admin user (password: admin123 - change in production!)
INSERT OR IGNORE INTO users (username, email, password_hash, is_admin, email_verified) VALUES
('admin', 'admin@indusnetwork.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4wpa6PALKu', 1, 1);

-- Sample player data
INSERT OR IGNORE INTO minecraft_players (minecraft_uuid, minecraft_username, current_rank, coins, is_verified) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'TestPlayer1', 'vip', 500, 1),
('550e8400-e29b-41d4-a716-446655440001', 'TestPlayer2', 'default', 150, 0);

-- Sample player statistics
INSERT OR IGNORE INTO player_statistics (player_id, kills, deaths, blocks_broken, blocks_placed, playtime_minutes) VALUES
(1, 25, 10, 1500, 800, 120),
(2, 5, 15, 200, 300, 45);

PRAGMA optimize;

-- End of SQLite schema
SELECT 'IndusNetwork SQLite database schema created successfully!' as status;
