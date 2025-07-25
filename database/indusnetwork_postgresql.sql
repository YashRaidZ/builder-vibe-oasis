-- IndusNetwork Database Schema - PostgreSQL Version
-- Compatible with PostgreSQL 12+ (including Fly.dev deployments)
-- This schema supports both the website and Minecraft plugin integration

-- Create database (run separately if needed)
-- CREATE DATABASE indusnetwork;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- USER MANAGEMENT TABLES
-- ============================================================================

-- Users table for website authentication
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_expires TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for users
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(email_verification_token);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(password_reset_token);

-- User sessions for web authentication
CREATE TABLE IF NOT EXISTS user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for sessions
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON user_sessions(expires_at);

-- ============================================================================
-- MINECRAFT PLAYER TABLES
-- ============================================================================

-- Minecraft players (linked to users)
CREATE TABLE IF NOT EXISTS minecraft_players (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    minecraft_uuid UUID NOT NULL UNIQUE,
    minecraft_username VARCHAR(16) NOT NULL,
    current_rank VARCHAR(50) DEFAULT 'default',
    coins INTEGER DEFAULT 0,
    total_playtime BIGINT DEFAULT 0, -- in minutes
    last_seen TIMESTAMP,
    is_online BOOLEAN DEFAULT FALSE,
    first_join TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(10),
    verification_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for minecraft_players
CREATE INDEX IF NOT EXISTS idx_players_uuid ON minecraft_players(minecraft_uuid);
CREATE INDEX IF NOT EXISTS idx_players_username ON minecraft_players(minecraft_username);
CREATE INDEX IF NOT EXISTS idx_players_user_id ON minecraft_players(user_id);
CREATE INDEX IF NOT EXISTS idx_players_verification_code ON minecraft_players(verification_code);
CREATE INDEX IF NOT EXISTS idx_players_online ON minecraft_players(is_online);
CREATE INDEX IF NOT EXISTS idx_players_rank ON minecraft_players(current_rank);

-- Player statistics
CREATE TABLE IF NOT EXISTS player_statistics (
    id BIGSERIAL PRIMARY KEY,
    player_id BIGINT NOT NULL REFERENCES minecraft_players(id) ON DELETE CASCADE,
    kills INTEGER DEFAULT 0,
    deaths INTEGER DEFAULT 0,
    blocks_broken INTEGER DEFAULT 0,
    blocks_placed INTEGER DEFAULT 0,
    distance_walked BIGINT DEFAULT 0,
    playtime_minutes BIGINT DEFAULT 0,
    login_count INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id)
);

-- Player login history
CREATE TABLE IF NOT EXISTS player_login_history (
    id BIGSERIAL PRIMARY KEY,
    player_id BIGINT NOT NULL REFERENCES minecraft_players(id) ON DELETE CASCADE,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP,
    session_duration INTEGER, -- in minutes
    ip_address INET
);

CREATE INDEX IF NOT EXISTS idx_login_history_player_id ON player_login_history(player_id);
CREATE INDEX IF NOT EXISTS idx_login_history_login_time ON player_login_history(login_time);

-- ============================================================================
-- RANK SYSTEM TABLES
-- ============================================================================

-- Available ranks configuration
CREATE TABLE IF NOT EXISTS ranks (
    id SERIAL PRIMARY KEY,
    rank_name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    permission_group VARCHAR(50) NOT NULL,
    coins_multiplier DECIMAL(3,2) DEFAULT 1.00,
    price_inr DECIMAL(10,2) DEFAULT 0.00,
    priority INTEGER DEFAULT 0, -- Higher priority = higher rank
    color_code VARCHAR(10) DEFAULT '&7',
    is_purchasable BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    permissions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ranks_name ON ranks(rank_name);
CREATE INDEX IF NOT EXISTS idx_ranks_priority ON ranks(priority);
CREATE INDEX IF NOT EXISTS idx_ranks_purchasable ON ranks(is_purchasable);

-- Insert default ranks
INSERT INTO ranks (rank_name, display_name, permission_group, coins_multiplier, price_inr, priority, color_code, description) VALUES
('default', '&7Default', 'default', 1.00, 0.00, 0, '&7', 'Basic player rank'),
('vip', '&a&lVIP', 'vip', 1.50, 199.00, 1, '&a', 'VIP rank with exclusive perks'),
('mvp', '&b&lMVP', 'mvp', 2.00, 499.00, 2, '&b', 'MVP rank with premium features'),
('legend', '&6&lLEGEND', 'legend', 2.50, 999.00, 3, '&6', 'Legendary rank with special abilities'),
('champion', '&c&lCHAMPION', 'champion', 3.00, 1499.00, 4, '&c', 'Champion rank for elite players'),
('master', '&4&lMASTER', 'master', 3.50, 1799.00, 5, '&4', 'Master rank with advanced privileges'),
('grandmaster', '&5&lGRANDMASTER', 'grandmaster', 4.00, 1999.00, 6, '&5', 'Grandmaster rank for veteran players'),
('elite', '&d&lELITE', 'elite', 4.50, 2199.00, 7, '&d', 'Elite rank with exclusive content'),
('supreme', '&e&lSUPREME', 'supreme', 5.00, 2349.00, 8, '&e', 'Supreme rank with ultimate perks'),
('ultimate', '&f&lULTIMATE', 'ultimate', 6.00, 2499.00, 9, '&f', 'Ultimate rank - the highest tier')
ON CONFLICT (rank_name) DO NOTHING;

-- Rank history for players
CREATE TABLE IF NOT EXISTS player_rank_history (
    id BIGSERIAL PRIMARY KEY,
    player_id BIGINT NOT NULL REFERENCES minecraft_players(id) ON DELETE CASCADE,
    from_rank VARCHAR(50),
    to_rank VARCHAR(50) NOT NULL,
    changed_by VARCHAR(50) DEFAULT 'SYSTEM', -- 'SYSTEM', 'ADMIN', 'PURCHASE'
    change_reason VARCHAR(255),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rank_history_player_id ON player_rank_history(player_id);
CREATE INDEX IF NOT EXISTS idx_rank_history_changed_at ON player_rank_history(changed_at);

-- ============================================================================
-- STORE SYSTEM TABLES
-- ============================================================================

-- Store categories
CREATE TABLE IF NOT EXISTS store_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON store_categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON store_categories(sort_order);

-- Insert default categories
INSERT INTO store_categories (name, slug, description, icon, sort_order) VALUES
('Ranks', 'ranks', 'Premium server ranks with exclusive perks', 'crown', 1),
('Kits', 'kits', 'Starter kits and equipment packages', 'package', 2),
('Currency', 'currency', 'Server coins and in-game currency', 'coins', 3),
('Cosmetics', 'cosmetics', 'Cosmetic items and customizations', 'palette', 4),
('Tools', 'tools', 'Special tools and equipment', 'wrench', 5)
ON CONFLICT (slug) DO NOTHING;

-- Store items
CREATE TABLE IF NOT EXISTS store_items (
    id BIGSERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES store_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    price_inr DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    stock_quantity INTEGER, -- NULL = unlimited
    max_per_user INTEGER, -- NULL = unlimited
    commands JSONB NOT NULL, -- Delivery commands
    requirements JSONB, -- Purchase requirements
    metadata JSONB, -- Additional item data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_items_category_id ON store_items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_slug ON store_items(slug);
CREATE INDEX IF NOT EXISTS idx_items_featured ON store_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_items_active ON store_items(is_active);
CREATE INDEX IF NOT EXISTS idx_items_price ON store_items(price_inr);

-- Insert sample store items
INSERT INTO store_items (category_id, name, slug, description, price_inr, commands, is_featured) VALUES
(1, 'VIP Rank', 'vip-rank', 'Upgrade to VIP rank with exclusive perks', 199.00, '[{"command": "lp", "args": ["user", "{username}", "parent", "set", "vip"], "delay": 0}]'::jsonb, TRUE),
(2, 'Starter Kit', 'starter-kit', 'Complete starter kit with armor and tools', 99.00, '[{"command": "give", "args": ["{username}", "diamond_sword", "1"], "delay": 0}, {"command": "give", "args": ["{username}", "diamond_helmet", "1"], "delay": 1}]'::jsonb, TRUE),
(3, '1000 Coins', '1000-coins', 'Get 1000 server coins instantly', 149.00, '[{"command": "eco", "args": ["give", "{username}", "1000"], "delay": 0}]'::jsonb, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- TRANSACTION TABLES
-- ============================================================================

-- Transaction status enum
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled');

-- Purchase transactions
CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    player_id BIGINT REFERENCES minecraft_players(id) ON DELETE SET NULL,
    item_id BIGINT NOT NULL REFERENCES store_items(id) ON DELETE CASCADE,
    transaction_id VARCHAR(255) NOT NULL UNIQUE, -- External payment gateway ID
    payment_gateway VARCHAR(50) NOT NULL DEFAULT 'razorpay',
    amount_inr DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status transaction_status DEFAULT 'pending',
    payment_data JSONB, -- Payment gateway response data
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transactions_id ON transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_player_id ON transactions(player_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- ============================================================================
-- DELIVERY SYSTEM TABLES
-- ============================================================================

-- Delivery status enum
CREATE TYPE delivery_status AS ENUM ('queued', 'processing', 'completed', 'failed');

-- Delivery queue for purchased items
CREATE TABLE IF NOT EXISTS delivery_queue (
    id BIGSERIAL PRIMARY KEY,
    transaction_id BIGINT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    player_id BIGINT NOT NULL REFERENCES minecraft_players(id) ON DELETE CASCADE,
    item_id BIGINT NOT NULL REFERENCES store_items(id) ON DELETE CASCADE,
    delivery_commands JSONB NOT NULL,
    priority INTEGER DEFAULT 1,
    status delivery_status DEFAULT 'queued',
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    next_attempt TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_delivery_transaction_id ON delivery_queue(transaction_id);
CREATE INDEX IF NOT EXISTS idx_delivery_player_id ON delivery_queue(player_id);
CREATE INDEX IF NOT EXISTS idx_delivery_status ON delivery_queue(status);
CREATE INDEX IF NOT EXISTS idx_delivery_priority ON delivery_queue(priority);
CREATE INDEX IF NOT EXISTS idx_delivery_next_attempt ON delivery_queue(next_attempt);

-- Delivery attempt status enum
CREATE TYPE attempt_status AS ENUM ('success', 'failed');

-- Delivery attempts log
CREATE TABLE IF NOT EXISTS delivery_attempts (
    id BIGSERIAL PRIMARY KEY,
    delivery_id BIGINT NOT NULL REFERENCES delivery_queue(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL,
    status attempt_status NOT NULL,
    error_message TEXT,
    executed_commands JSONB,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attempts_delivery_id ON delivery_attempts(delivery_id);
CREATE INDEX IF NOT EXISTS idx_attempts_attempted_at ON delivery_attempts(attempted_at);

-- ============================================================================
-- LEADERBOARD TABLES
-- ============================================================================

-- Leaderboard sort order enum
CREATE TYPE sort_order_type AS ENUM ('ASC', 'DESC');

-- Leaderboard types
CREATE TABLE IF NOT EXISTS leaderboard_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    stat_column VARCHAR(100) NOT NULL, -- Column name in player_statistics
    sort_order sort_order_type DEFAULT 'DESC',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default leaderboard types
INSERT INTO leaderboard_types (name, display_name, description, stat_column, sort_order) VALUES
('kills', 'Top Killers', 'Players with the most kills', 'kills', 'DESC'),
('playtime', 'Most Active', 'Players with the most playtime', 'playtime_minutes', 'DESC'),
('blocks_broken', 'Block Breakers', 'Players who broke the most blocks', 'blocks_broken', 'DESC'),
('kdr', 'Best K/D Ratio', 'Players with the best kill/death ratio', 'kills', 'DESC')
ON CONFLICT (name) DO NOTHING;

-- Leaderboard cache (updated periodically)
CREATE TABLE IF NOT EXISTS leaderboard_cache (
    id BIGSERIAL PRIMARY KEY,
    leaderboard_type VARCHAR(100) NOT NULL,
    player_id BIGINT NOT NULL REFERENCES minecraft_players(id) ON DELETE CASCADE,
    rank_position INTEGER NOT NULL,
    score DECIMAL(15,2) NOT NULL,
    additional_data JSONB,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(leaderboard_type, player_id)
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_type ON leaderboard_cache(leaderboard_type);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON leaderboard_cache(rank_position);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard_cache(score);

-- ============================================================================
-- SYSTEM TABLES
-- ============================================================================

-- System configuration
CREATE TABLE IF NOT EXISTS system_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(255) NOT NULL UNIQUE,
    config_value TEXT,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- Can be accessed by non-admin users
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_config_key ON system_config(config_key);
CREATE INDEX IF NOT EXISTS idx_config_public ON system_config(is_public);

-- Insert default system configuration
INSERT INTO system_config (config_key, config_value, description, is_public) VALUES
('server_ip', 'indusnetwork.highms.pro', 'Server IP address', TRUE),
('server_port', '25826', 'Server port', TRUE),
('discord_invite', '', 'Discord server invite link', TRUE),
('store_enabled', 'true', 'Whether the store is enabled', TRUE),
('maintenance_mode', 'false', 'Server maintenance mode', TRUE),
('max_players', '100', 'Maximum player count', TRUE),
('motd', 'Welcome to IndusNetwork!', 'Server message of the day', TRUE),
('website_title', 'IndusNetwork - Premium Minecraft Server', 'Website title', TRUE),
('default_coins', '100', 'Starting coins for new players', FALSE)
ON CONFLICT (config_key) DO NOTHING;

-- Audit log for important actions
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id BIGINT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action_type ON audit_log(action_type);
CREATE INDEX IF NOT EXISTS idx_audit_table_name ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_log(created_at);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for player overview with stats
CREATE OR REPLACE VIEW player_overview AS
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
        WHEN ps.deaths > 0 THEN ROUND(ps.kills::DECIMAL / ps.deaths, 2)
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

-- View for transaction overview
CREATE OR REPLACE VIEW transaction_overview AS
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

-- View for pending deliveries
CREATE OR REPLACE VIEW pending_deliveries AS
SELECT 
    dq.id,
    dq.status,
    dq.attempts,
    dq.max_attempts,
    dq.next_attempt,
    dq.created_at,
    mp.minecraft_username,
    mp.is_online,
    si.name as item_name,
    t.transaction_id
FROM delivery_queue dq
JOIN minecraft_players mp ON dq.player_id = mp.id
JOIN store_items si ON dq.item_id = si.id
JOIN transactions t ON dq.transaction_id = t.id
WHERE dq.status IN ('queued', 'processing', 'failed');

-- ============================================================================
-- FUNCTIONS AND PROCEDURES
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON minecraft_players 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ranks_updated_at BEFORE UPDATE ON ranks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON store_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_config_updated_at BEFORE UPDATE ON system_config 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean expired sessions
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_sessions WHERE expires_at < CURRENT_TIMESTAMP;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update leaderboards
CREATE OR REPLACE FUNCTION update_leaderboards()
RETURNS TEXT AS $$
BEGIN
    -- Clear existing cache
    DELETE FROM leaderboard_cache;
    
    -- Update kills leaderboard
    INSERT INTO leaderboard_cache (leaderboard_type, player_id, rank_position, score)
    SELECT 'kills', player_id, ROW_NUMBER() OVER (ORDER BY kills DESC), kills
    FROM player_statistics WHERE kills > 0;
    
    -- Update playtime leaderboard
    INSERT INTO leaderboard_cache (leaderboard_type, player_id, rank_position, score)
    SELECT 'playtime', player_id, ROW_NUMBER() OVER (ORDER BY playtime_minutes DESC), playtime_minutes
    FROM player_statistics WHERE playtime_minutes > 0;
    
    -- Update blocks broken leaderboard
    INSERT INTO leaderboard_cache (leaderboard_type, player_id, rank_position, score)
    SELECT 'blocks_broken', player_id, ROW_NUMBER() OVER (ORDER BY blocks_broken DESC), blocks_broken
    FROM player_statistics WHERE blocks_broken > 0;
    
    RETURN 'Leaderboards updated successfully';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Create sample admin user (password: admin123 - change in production!)
INSERT INTO users (username, email, password_hash, is_admin, email_verified) VALUES
('admin', 'admin@indusnetwork.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4wpa6PALKu', TRUE, TRUE)
ON CONFLICT (username) DO NOTHING;

-- Sample player data
INSERT INTO minecraft_players (minecraft_uuid, minecraft_username, current_rank, coins, is_verified) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'TestPlayer1', 'vip', 500, TRUE),
('550e8400-e29b-41d4-a716-446655440001', 'TestPlayer2', 'default', 150, FALSE)
ON CONFLICT (minecraft_uuid) DO NOTHING;

-- Sample player statistics
INSERT INTO player_statistics (player_id, kills, deaths, blocks_broken, blocks_placed, playtime_minutes) 
SELECT id, 25, 10, 1500, 800, 120 FROM minecraft_players WHERE minecraft_username = 'TestPlayer1'
ON CONFLICT (player_id) DO NOTHING;

INSERT INTO player_statistics (player_id, kills, deaths, blocks_broken, blocks_placed, playtime_minutes) 
SELECT id, 5, 15, 200, 300, 45 FROM minecraft_players WHERE minecraft_username = 'TestPlayer2'
ON CONFLICT (player_id) DO NOTHING;

-- ============================================================================
-- GRANTS AND SECURITY
-- ============================================================================

-- Example grants (uncomment and modify as needed)
-- CREATE USER indusnetwork_app WITH PASSWORD 'secure_password_here';
-- GRANT CONNECT ON DATABASE indusnetwork TO indusnetwork_app;
-- GRANT USAGE ON SCHEMA public TO indusnetwork_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO indusnetwork_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO indusnetwork_app;

-- Create read-only user for reporting
-- CREATE USER indusnetwork_readonly WITH PASSWORD 'readonly_password_here';
-- GRANT CONNECT ON DATABASE indusnetwork TO indusnetwork_readonly;
-- GRANT USAGE ON SCHEMA public TO indusnetwork_readonly;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO indusnetwork_readonly;

COMMIT;

-- Success message
SELECT 'IndusNetwork PostgreSQL database schema created successfully!' as status;
