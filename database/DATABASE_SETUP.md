# IndusNetwork Database Setup Guide

This guide covers setting up the database for both the IndusNetwork website and Minecraft plugin integration.

## 📊 **Database Options**

### **Option 1: PostgreSQL (Recommended for Cloud/Fly.dev)**

- **File**: `indusnetwork_postgresql.sql`
- **Best for**: Cloud deployments, Fly.dev, modern features
- **Features**: JSONB support, UUID, advanced indexing, enums

### **Option 2: MySQL (Traditional Production)**

- **File**: `indusnetwork_schema.sql`
- **Best for**: Traditional hosting, shared hosting
- **Features**: Full feature set, triggers, events, procedures

### **Option 3: SQLite (Development/Testing)**

- **File**: `indusnetwork_sqlite.sql`
- **Best for**: Local development, testing, small deployments
- **Features**: Simplified schema, easy setup

## 🚀 **Quick Setup**

### **PostgreSQL Setup (Recommended for Fly.dev)**

```bash
# 1. Connect to your PostgreSQL database
psql $DATABASE_URL

# 2. Import the schema
\i database/indusnetwork_postgresql.sql

# 3. Verify setup
SELECT COUNT(*) FROM ranks;
\q
```

**For Fly.dev specifically:**

```bash
# 1. Get your database URL from Fly.dev
fly postgres connect -a your-postgres-app-name

# 2. Import schema
\i database/indusnetwork_postgresql.sql

# 3. Exit
\q
```

### **MySQL Setup**

```bash
# 1. Create database and import schema
mysql -u root -p
CREATE DATABASE indusnetwork;
exit

# 2. Import the schema
mysql -u root -p indusnetwork < database/indusnetwork_schema.sql

# 3. Create application user
mysql -u root -p -e "
CREATE USER 'indusnetwork'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON indusnetwork.* TO 'indusnetwork'@'localhost';
FLUSH PRIVILEGES;"
```

### **SQLite Setup**

```bash
# 1. Create database file
sqlite3 indusnetwork.db < database/indusnetwork_sqlite.sql

# 2. Verify setup
sqlite3 indusnetwork.db "SELECT COUNT(*) FROM ranks;"
```

## 🗄️ **Database Schema Overview**

### **Core Tables**

#### **User Management**

- `users` - Website user accounts
- `user_sessions` - Active user sessions
- `minecraft_players` - Minecraft player data
- `player_statistics` - Player game statistics
- `player_login_history` - Login tracking

#### **Rank System**

- `ranks` - Available server ranks
- `player_rank_history` - Rank change history

#### **Store System**

- `store_categories` - Item categories (ranks, kits, etc.)
- `store_items` - Purchasable items
- `transactions` - Purchase transactions
- `delivery_queue` - Item delivery queue
- `delivery_attempts` - Delivery attempt logs

#### **Leaderboards**

- `leaderboard_types` - Leaderboard configurations
- `leaderboard_cache` - Cached leaderboard data

#### **System**

- `system_config` - Application configuration
- `audit_log` - Action audit trail
- `server_actions` - Server management actions

## 🔧 **Configuration**

### **Environment Variables**

Update your `.env` file with database connection details:

```bash
# PostgreSQL Configuration (Fly.dev/Cloud)
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
DATABASE_HOST=hostname
DATABASE_PORT=5432
DATABASE_NAME=database_name
DATABASE_USER=username
DATABASE_PASSWORD=password

# MySQL Configuration (Traditional hosting)
DATABASE_URL=mysql://indusnetwork:password@localhost:3306/indusnetwork
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=indusnetwork
DATABASE_USER=indusnetwork
DATABASE_PASSWORD=your_secure_password

# SQLite Configuration (Development)
DATABASE_URL=sqlite:./indusnetwork.db
```

### **Minecraft Plugin Configuration**

Update `plugins/IndusNetworkPlugin/config.yml`:

```yaml
database:
  type: "mysql" # or "sqlite"
  host: "localhost"
  port: 3306
  database: "indusnetwork"
  username: "indusnetwork"
  password: "your_secure_password"
  table_prefix: ""
```

## 📋 **Default Data**

### **Ranks System**

The schema includes 10 default ranks:

| Rank        | Display Name | Price (₹) | Coins Multiplier |
| ----------- | ------------ | --------- | ---------------- |
| default     | Default      | ₹0        | 1.0x             |
| vip         | VIP          | ₹199      | 1.5x             |
| mvp         | MVP          | ₹499      | 2.0x             |
| legend      | LEGEND       | ₹999      | 2.5x             |
| champion    | CHAMPION     | ₹1,499    | 3.0x             |
| master      | MASTER       | ₹1,799    | 3.5x             |
| grandmaster | GRANDMASTER  | ₹1,999    | 4.0x             |
| elite       | ELITE        | ₹2,199    | 4.5x             |
| supreme     | SUPREME      | ₹2,349    | 5.0x             |
| ultimate    | ULTIMATE     | ₹2,499    | 6.0x             |

### **Store Categories**

- **Ranks** - Premium server ranks
- **Kits** - Starter equipment packages
- **Currency** - Server coins
- **Cosmetics** - Appearance items
- **Tools** - Special equipment

### **Admin Account**

- **Username**: `admin`
- **Email**: `admin@indusnetwork.com`
- **Password**: `admin123` ⚠️ **Change this immediately!**

## 🔐 **Security Setup**

### **1. Change Default Passwords**

```sql
-- Update admin password (use a proper hash)
UPDATE users SET password_hash = '$2b$12$NEW_HASH_HERE' WHERE username = 'admin';
```

### **2. Database User Permissions**

```sql
-- Create read-only user for reporting
CREATE USER 'indusnetwork_readonly'@'localhost' IDENTIFIED BY 'readonly_password';
GRANT SELECT ON indusnetwork.* TO 'indusnetwork_readonly'@'localhost';

-- Create backup user
CREATE USER 'indusnetwork_backup'@'localhost' IDENTIFIED BY 'backup_password';
GRANT SELECT, LOCK TABLES ON indusnetwork.* TO 'indusnetwork_backup'@'localhost';
```

### **3. Enable Binary Logging (MySQL)**

Add to `/etc/mysql/mysql.conf.d/mysqld.cnf`:

```ini
log-bin = /var/log/mysql/mysql-bin.log
binlog_format = ROW
expire_logs_days = 7
```

## 📊 **Monitoring & Maintenance**

### **Performance Monitoring**

```sql
-- Check table sizes
SELECT
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'indusnetwork'
ORDER BY (data_length + index_length) DESC;

-- Check slow queries
SHOW PROCESSLIST;
```

### **Maintenance Procedures**

```sql
-- Clean expired sessions (run hourly)
CALL CleanExpiredSessions();

-- Update leaderboards (run every 15 minutes)
CALL UpdateLeaderboards();

-- Cleanup failed deliveries (run daily)
CALL CleanupFailedDeliveries();
```

### **Backup Commands**

```bash
# Full backup
mysqldump --single-transaction --routines --triggers indusnetwork > backup_$(date +%Y%m%d).sql

# Compressed backup
mysqldump --single-transaction indusnetwork | gzip > backup_$(date +%Y%m%d).sql.gz

# SQLite backup
sqlite3 indusnetwork.db ".backup backup_$(date +%Y%m%d).db"
```

## 🔄 **Database Migrations**

### **Adding New Columns**

```sql
-- Example: Add new column to players table
ALTER TABLE minecraft_players ADD COLUMN discord_id VARCHAR(20) NULL;
ALTER TABLE minecraft_players ADD INDEX idx_discord_id (discord_id);
```

### **Schema Updates**

When updating the schema:

1. **Backup** the database first
2. **Test** on development environment
3. **Document** the changes
4. **Apply** during maintenance window

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Connection Refused**

```bash
# Check MySQL service
sudo systemctl status mysql
sudo systemctl start mysql

# Check SQLite file permissions
ls -la indusnetwork.db
chmod 664 indusnetwork.db
```

#### **Foreign Key Constraints**

```sql
-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;
-- Perform operations
SET FOREIGN_KEY_CHECKS = 1;
```

#### **Character Encoding Issues**

```sql
-- Check current encoding
SHOW VARIABLES LIKE 'character_set%';

-- Fix encoding for existing table
ALTER TABLE table_name CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### **Performance Issues**

```sql
-- Check missing indexes
SELECT * FROM sys.statements_with_temp_tables;

-- Analyze query performance
EXPLAIN SELECT * FROM minecraft_players WHERE minecraft_username = 'player';
```

## 📈 **Scaling Considerations**

### **Read Replicas**

For high traffic, consider MySQL read replicas:

```sql
-- On master
CREATE USER 'replicator'@'%' IDENTIFIED BY 'replica_password';
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'%';
```

### **Partitioning**

For large audit logs:

```sql
-- Partition audit_log by month
ALTER TABLE audit_log PARTITION BY RANGE (TO_DAYS(created_at)) (
    PARTITION p202401 VALUES LESS THAN (TO_DAYS('2024-02-01')),
    PARTITION p202402 VALUES LESS THAN (TO_DAYS('2024-03-01'))
);
```

### **Caching**

Implement Redis for:

- Session storage
- Leaderboard cache
- Frequently accessed config

## 🎯 **Best Practices**

### **1. Regular Maintenance**

- **Daily**: Check disk space, backup
- **Weekly**: Analyze slow queries, update statistics
- **Monthly**: Review indexes, cleanup old data

### **2. Security**

- Use strong passwords
- Enable SSL connections
- Regular security updates
- Audit user access

### **3. Monitoring**

- Set up alerts for disk space
- Monitor connection counts
- Track query performance
- Log failed login attempts

### **4. Backup Strategy**

- **Full backup**: Daily
- **Incremental**: Hourly
- **Test restores**: Monthly
- **Offsite storage**: Weekly

---

## 🚀 **Quick Start Checklist**

- [ ] Install MySQL/SQLite
- [ ] Import database schema
- [ ] Create application user
- [ ] Update environment variables
- [ ] Change default admin password
- [ ] Test database connection
- [ ] Configure backup schedule
- [ ] Set up monitoring
- [ ] Test Minecraft plugin connection
- [ ] Verify website integration

Your IndusNetwork database is now ready for both website and Minecraft plugin integration! 🎮
