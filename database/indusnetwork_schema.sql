-- IndusNetwork Database Schema
-- This schema supports both the website and Minecraft plugin integration
-- Compatible with MySQL 8.0+

CREATE DATABASE IF NOT EXISTS indusnetwork CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE indusnetwork;

-- ============================================================================
-- USER MANAGEMENT TABLES
-- ============================================================================

-- Users table for website authentication
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255) NULL,
    email_verification_expires TIMESTAMP NULL,
    password_reset_token VARCHAR(255) NULL,
    password_reset_expires TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_verification_token (email_verification_token),
    INDEX idx_reset_token (password_reset_token)
);

-- User sessions for web authentication
CREATE TABLE IF NOT EXISTS user_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);

-- ============================================================================
-- MINECRAFT PLAYER TABLES
-- ============================================================================

-- Minecraft players (linked to users)
CREATE TABLE IF NOT EXISTS minecraft_players (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL, -- NULL if not linked to website account
    minecraft_uuid VARCHAR(36) NOT NULL UNIQUE,
    minecraft_username VARCHAR(16) NOT NULL,
    current_rank VARCHAR(50) DEFAULT 'default',
    coins INT DEFAULT 0,
    total_playtime BIGINT DEFAULT 0, -- in minutes
    last_seen TIMESTAMP NULL,
    is_online BOOLEAN DEFAULT FALSE,
    first_join TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(10) NULL,
    verification_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_minecraft_uuid (minecraft_uuid),
    INDEX idx_minecraft_username (minecraft_username),
    INDEX idx_user_id (user_id),
    INDEX idx_verification_code (verification_code),
    INDEX idx_is_online (is_online),
    INDEX idx_current_rank (current_rank)
);

-- Player statistics
CREATE TABLE IF NOT EXISTS player_statistics (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    player_id BIGINT UNSIGNED NOT NULL,
    kills INT DEFAULT 0,
    deaths INT DEFAULT 0,
    blocks_broken INT DEFAULT 0,
    blocks_placed INT DEFAULT 0,
    distance_walked BIGINT DEFAULT 0,
    playtime_minutes BIGINT DEFAULT 0,
    login_count INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES minecraft_players(id) ON DELETE CASCADE,
    UNIQUE KEY unique_player_stats (player_id)
);

-- Player login history
CREATE TABLE IF NOT EXISTS player_login_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    player_id BIGINT UNSIGNED NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP NULL,
    session_duration INT NULL, -- in minutes
    ip_address VARCHAR(45) NULL,
    FOREIGN KEY (player_id) REFERENCES minecraft_players(id) ON DELETE CASCADE,
    INDEX idx_player_id (player_id),
    INDEX idx_login_time (login_time)
);

-- ============================================================================
-- RANK SYSTEM TABLES
-- ============================================================================

-- Available ranks configuration
CREATE TABLE IF NOT EXISTS ranks (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rank_name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    permission_group VARCHAR(50) NOT NULL,
    coins_multiplier DECIMAL(3,2) DEFAULT 1.00,
    price_inr DECIMAL(10,2) DEFAULT 0.00,
    priority INT DEFAULT 0, -- Higher priority = higher rank
    color_code VARCHAR(10) DEFAULT '&7',
    is_purchasable BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT NULL,
    permissions JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_rank_name (rank_name),
    INDEX idx_priority (priority),
    INDEX idx_is_purchasable (is_purchasable)
);

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
('ultimate', '&f&lULTIMATE', 'ultimate', 6.00, 2499.00, 9, '&f', 'Ultimate rank - the highest tier');

-- Rank history for players
CREATE TABLE IF NOT EXISTS player_rank_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    player_id BIGINT UNSIGNED NOT NULL,
    from_rank VARCHAR(50) NULL,
    to_rank VARCHAR(50) NOT NULL,
    changed_by VARCHAR(50) DEFAULT 'SYSTEM', -- 'SYSTEM', 'ADMIN', 'PURCHASE'
    change_reason VARCHAR(255) NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES minecraft_players(id) ON DELETE CASCADE,
    INDEX idx_player_id (player_id),
    INDEX idx_changed_at (changed_at)
);

-- ============================================================================
-- STORE SYSTEM TABLES
-- ============================================================================

-- Store categories
CREATE TABLE IF NOT EXISTS store_categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    icon VARCHAR(255) NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_sort_order (sort_order)
);

-- Insert default categories
INSERT INTO store_categories (name, slug, description, icon, sort_order) VALUES
('Ranks', 'ranks', 'Premium server ranks with exclusive perks', 'crown', 1),
('Kits', 'kits', 'Starter kits and equipment packages', 'package', 2),
('Currency', 'currency', 'Server coins and in-game currency', 'coins', 3),
('Cosmetics', 'cosmetics', 'Cosmetic items and customizations', 'palette', 4),
('Tools', 'tools', 'Special tools and equipment', 'wrench', 5);

-- Store items
CREATE TABLE IF NOT EXISTS store_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id INT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    short_description VARCHAR(500) NULL,
    price_inr DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500) NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    stock_quantity INT NULL, -- NULL = unlimited
    max_per_user INT NULL, -- NULL = unlimited
    commands JSON NOT NULL, -- Delivery commands
    requirements JSON NULL, -- Purchase requirements
    metadata JSON NULL, -- Additional item data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES store_categories(id) ON DELETE CASCADE,
    INDEX idx_category_id (category_id),
    INDEX idx_slug (slug),
    INDEX idx_is_featured (is_featured),
    INDEX idx_is_active (is_active),
    INDEX idx_price_inr (price_inr)
);

-- Insert sample store items
INSERT INTO store_items (category_id, name, slug, description, price_inr, commands, is_featured) VALUES
(1, 'VIP Rank', 'vip-rank', 'Upgrade to VIP rank with exclusive perks', 199.00, '[{"command": "lp", "args": ["user", "{username}", "parent", "set", "vip"], "delay": 0}]', TRUE),
(2, 'Starter Kit', 'starter-kit', 'Complete starter kit with armor and tools', 99.00, '[{"command": "give", "args": ["{username}", "diamond_sword", "1"], "delay": 0}, {"command": "give", "args": ["{username}", "diamond_helmet", "1"], "delay": 1}]', TRUE),
(3, '1000 Coins', '1000-coins', 'Get 1000 server coins instantly', 149.00, '[{"command": "eco", "args": ["give", "{username}", "1000"], "delay": 0}]', TRUE);

-- ============================================================================
-- TRANSACTION TABLES
-- ============================================================================

-- Purchase transactions
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    player_id BIGINT UNSIGNED NULL,
    item_id BIGINT UNSIGNED NOT NULL,
    transaction_id VARCHAR(255) NOT NULL UNIQUE, -- External payment gateway ID
    payment_gateway VARCHAR(50) NOT NULL DEFAULT 'razorpay',
    amount_inr DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled') DEFAULT 'pending',
    payment_data JSON NULL, -- Payment gateway response data
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (player_id) REFERENCES minecraft_players(id) ON DELETE SET NULL,
    FOREIGN KEY (item_id) REFERENCES store_items(id) ON DELETE CASCADE,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_user_id (user_id),
    INDEX idx_player_id (player_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- ============================================================================
-- DELIVERY SYSTEM TABLES
-- ============================================================================

-- Delivery queue for purchased items
CREATE TABLE IF NOT EXISTS delivery_queue (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    transaction_id BIGINT UNSIGNED NOT NULL,
    player_id BIGINT UNSIGNED NOT NULL,
    item_id BIGINT UNSIGNED NOT NULL,
    delivery_commands JSON NOT NULL,
    priority INT DEFAULT 1,
    status ENUM('queued', 'processing', 'completed', 'failed') DEFAULT 'queued',
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 3,
    next_attempt TIMESTAMP NULL,
    error_message TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES minecraft_players(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES store_items(id) ON DELETE CASCADE,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_player_id (player_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_next_attempt (next_attempt)
);

-- Delivery attempts log
CREATE TABLE IF NOT EXISTS delivery_attempts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    delivery_id BIGINT UNSIGNED NOT NULL,
    attempt_number INT NOT NULL,
    status ENUM('success', 'failed') NOT NULL,
    error_message TEXT NULL,
    executed_commands JSON NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (delivery_id) REFERENCES delivery_queue(id) ON DELETE CASCADE,
    INDEX idx_delivery_id (delivery_id),
    INDEX idx_attempted_at (attempted_at)
);

-- ============================================================================
-- LEADERBOARD TABLES
-- ============================================================================

-- Leaderboard types
CREATE TABLE IF NOT EXISTS leaderboard_types (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    stat_column VARCHAR(100) NOT NULL, -- Column name in player_statistics
    sort_order ENUM('ASC', 'DESC') DEFAULT 'DESC',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default leaderboard types
INSERT INTO leaderboard_types (name, display_name, description, stat_column, sort_order) VALUES
('kills', 'Top Killers', 'Players with the most kills', 'kills', 'DESC'),
('playtime', 'Most Active', 'Players with the most playtime', 'playtime_minutes', 'DESC'),
('blocks_broken', 'Block Breakers', 'Players who broke the most blocks', 'blocks_broken', 'DESC'),
('kdr', 'Best K/D Ratio', 'Players with the best kill/death ratio', 'kills', 'DESC');

-- Leaderboard cache (updated periodically)
CREATE TABLE IF NOT EXISTS leaderboard_cache (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    leaderboard_type VARCHAR(100) NOT NULL,
    player_id BIGINT UNSIGNED NOT NULL,
    rank_position INT NOT NULL,
    score DECIMAL(15,2) NOT NULL,
    additional_data JSON NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES minecraft_players(id) ON DELETE CASCADE,
    UNIQUE KEY unique_leaderboard_player (leaderboard_type, player_id),
    INDEX idx_leaderboard_type (leaderboard_type),
    INDEX idx_rank_position (rank_position),
    INDEX idx_score (score)
);

-- ============================================================================
-- PLUGIN DATA TABLES
-- ============================================================================

-- Server plugins management
CREATE TABLE IF NOT EXISTS server_plugins (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    plugin_name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    version VARCHAR(50) NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    config_data JSON NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_plugin_name (plugin_name),
    INDEX idx_is_enabled (is_enabled)
);

-- Server actions log
CREATE TABLE IF NOT EXISTS server_actions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    action_type ENUM('restart', 'stop', 'start', 'backup', 'command', 'config_change') NOT NULL,
    description TEXT NULL,
    executed_by VARCHAR(100) NULL, -- admin username or 'SYSTEM'
    parameters JSON NULL,
    status ENUM('pending', 'running', 'completed', 'failed') DEFAULT 'pending',
    result TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    INDEX idx_action_type (action_type),
    INDEX idx_executed_by (executed_by),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- ============================================================================
-- SYSTEM TABLES
-- ============================================================================

-- System configuration
CREATE TABLE IF NOT EXISTS system_config (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(255) NOT NULL UNIQUE,
    config_value TEXT NULL,
    description TEXT NULL,
    is_public BOOLEAN DEFAULT FALSE, -- Can be accessed by non-admin users
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_config_key (config_key),
    INDEX idx_is_public (is_public)
);

-- Insert default system configuration
INSERT INTO system_config (config_key, config_value, description, is_public) VALUES
('server_ip', 'indusnetwork.highms.pro', 'Server IP address', TRUE),
('server_port', '25826', 'Server port', TRUE),
('discord_invite', '', 'Discord server invite link', TRUE),
('store_enabled', 'true', 'Whether the store is enabled', TRUE),
('maintenance_mode', 'false', 'Server maintenance mode', TRUE),
('max_players', '100', 'Maximum player count', TRUE),
('motd', 'Welcome to IndusNetwork!', 'Server message of the day', TRUE);

-- Audit log for important actions
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    action_type VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NULL,
    record_id BIGINT UNSIGNED NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action_type (action_type),
    INDEX idx_table_name (table_name),
    INDEX idx_created_at (created_at)
);

-- ============================================================================
-- TRIGGERS FOR AUDIT LOGGING
-- ============================================================================

DELIMITER $$

-- Trigger for user changes
CREATE TRIGGER users_audit_insert AFTER INSERT ON users
FOR EACH ROW BEGIN
    INSERT INTO audit_log (user_id, action_type, table_name, record_id, new_values)
    VALUES (NEW.id, 'INSERT', 'users', NEW.id, JSON_OBJECT('username', NEW.username, 'email', NEW.email));
END$$

CREATE TRIGGER users_audit_update AFTER UPDATE ON users
FOR EACH ROW BEGIN
    INSERT INTO audit_log (user_id, action_type, table_name, record_id, old_values, new_values)
    VALUES (NEW.id, 'UPDATE', 'users', NEW.id, 
        JSON_OBJECT('username', OLD.username, 'email', OLD.email, 'is_admin', OLD.is_admin),
        JSON_OBJECT('username', NEW.username, 'email', NEW.email, 'is_admin', NEW.is_admin));
END$$

-- Trigger for transaction changes
CREATE TRIGGER transactions_audit_update AFTER UPDATE ON transactions
FOR EACH ROW BEGIN
    INSERT INTO audit_log (user_id, action_type, table_name, record_id, old_values, new_values)
    VALUES (NEW.user_id, 'UPDATE', 'transactions', NEW.id,
        JSON_OBJECT('status', OLD.status, 'amount_inr', OLD.amount_inr),
        JSON_OBJECT('status', NEW.status, 'amount_inr', NEW.amount_inr));
END$$

DELIMITER ;

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for player overview with stats
CREATE VIEW player_overview AS
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
        WHEN ps.deaths > 0 THEN ROUND(ps.kills / ps.deaths, 2)
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
CREATE VIEW transaction_overview AS
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
CREATE VIEW pending_deliveries AS
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
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Additional indexes for common queries
CREATE INDEX idx_players_last_seen ON minecraft_players(last_seen);
CREATE INDEX idx_players_coins ON minecraft_players(coins);
CREATE INDEX idx_transactions_amount ON transactions(amount_inr);
CREATE INDEX idx_delivery_created_at ON delivery_queue(created_at);
CREATE INDEX idx_stats_kills ON player_statistics(kills);
CREATE INDEX idx_stats_playtime ON player_statistics(playtime_minutes);

-- ============================================================================
-- INITIAL DATA AND SAMPLE RECORDS
-- ============================================================================

-- Create sample admin user (password: admin123 - change in production!)
INSERT INTO users (username, email, password_hash, is_admin, email_verified) VALUES
('admin', 'admin@indusnetwork.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4wpa6PALKu', TRUE, TRUE);

-- Sample system configuration
INSERT INTO system_config (config_key, config_value, description, is_public) VALUES
('website_title', 'IndusNetwork - Premium Minecraft Server', 'Website title', TRUE),
('player_limit', '500', 'Maximum concurrent players', TRUE),
('default_coins', '100', 'Starting coins for new players', FALSE),
('delivery_check_interval', '30', 'Delivery check interval in seconds', FALSE);

-- Sample plugin configuration
INSERT INTO server_plugins (plugin_name, display_name, version, is_enabled, description) VALUES
('IndusNetworkPlugin', 'IndusNetwork Core', '1.0.0', TRUE, 'Main plugin for website integration'),
('Vault', 'Vault', '1.7.3', TRUE, 'Economy and permission abstraction'),
('LuckPerms', 'LuckPerms', '5.4.102', TRUE, 'Permission management system');

COMMIT;

-- ============================================================================
-- MAINTENANCE PROCEDURES
-- ============================================================================

DELIMITER $$

-- Procedure to clean old sessions
CREATE PROCEDURE CleanExpiredSessions()
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
    SELECT ROW_COUNT() as deleted_sessions;
END$$

-- Procedure to update leaderboards
CREATE PROCEDURE UpdateLeaderboards()
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
    
    SELECT 'Leaderboards updated successfully' as result;
END$$

-- Procedure to cleanup failed deliveries
CREATE PROCEDURE CleanupFailedDeliveries()
BEGIN
    -- Mark old failed deliveries as expired
    UPDATE delivery_queue 
    SET status = 'failed', error_message = 'Delivery expired after maximum attempts'
    WHERE status = 'queued' 
    AND attempts >= max_attempts 
    AND created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR);
    
    SELECT ROW_COUNT() as expired_deliveries;
END$$

DELIMITER ;

-- ============================================================================
-- SCHEDULED EVENTS (Enable event scheduler: SET GLOBAL event_scheduler = ON;)
-- ============================================================================

-- Clean expired sessions every hour
CREATE EVENT IF NOT EXISTS clean_sessions
ON SCHEDULE EVERY 1 HOUR
DO CALL CleanExpiredSessions();

-- Update leaderboards every 15 minutes
CREATE EVENT IF NOT EXISTS update_leaderboards
ON SCHEDULE EVERY 15 MINUTE
DO CALL UpdateLeaderboards();

-- Cleanup failed deliveries daily
CREATE EVENT IF NOT EXISTS cleanup_deliveries
ON SCHEDULE EVERY 1 DAY
STARTS DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 2 HOUR
DO CALL CleanupFailedDeliveries();

-- ============================================================================
-- GRANT STATEMENTS (Adjust as needed for your environment)
-- ============================================================================

-- Create application user (change password in production!)
-- CREATE USER IF NOT EXISTS 'indusnetwork'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON indusnetwork.* TO 'indusnetwork'@'localhost';

-- Create read-only user for reporting
-- CREATE USER IF NOT EXISTS 'indusnetwork_readonly'@'localhost' IDENTIFIED BY 'readonly_password_here';
-- GRANT SELECT ON indusnetwork.* TO 'indusnetwork_readonly'@'localhost';

-- FLUSH PRIVILEGES;

-- ============================================================================
-- BACKUP RECOMMENDATIONS
-- ============================================================================

/*
Recommended backup strategy:

1. Daily full backup:
   mysqldump --single-transaction --routines --triggers indusnetwork > backup_$(date +%Y%m%d).sql

2. Hourly incremental backup (using binary logs)
3. Weekly backup verification
4. Monthly archival to external storage

Critical tables to monitor:
- transactions (financial data)
- minecraft_players (player data)
- delivery_queue (pending deliveries)
- audit_log (security and compliance)
*/

SELECT 'IndusNetwork database schema created successfully!' as status;
