# IndusNetwork Minecraft Plugin

Official Minecraft plugin for IndusNetwork server that integrates with the website for seamless player experience.

## Features

### 🌐 Website Integration
- **Account Verification**: Players can verify their Minecraft accounts with website accounts
- **Real-time Synchronization**: Player data syncs between game and website
- **API Integration**: Secure communication with website backend

### 💰 Economy System
- **Coins Management**: Track and manage player coins
- **Rank Multipliers**: Different coin earning rates based on player ranks
- **Daily Bonuses**: Automatic daily coin rewards
- **Transfer System**: Players can send coins to each other

### 🏆 Rank System
- **12 Rank Tiers**: From Default to Ultimate
- **LuckPerms Integration**: Automatic permission group management
- **Website Sync**: Ranks purchased on website automatically applied in-game
- **Visual Indicators**: Custom rank display names and colors

### 📦 Delivery System
- **Instant Delivery**: Purchased items delivered automatically when player joins
- **Queue Management**: Handles multiple deliveries efficiently
- **Retry Logic**: Automatic retry for failed deliveries
- **Notification System**: Players notified of successful/failed deliveries

### 📊 Statistics Tracking
- **Player Stats**: Kills, deaths, playtime, blocks broken/placed
- **Website Sync**: Statistics synchronized with website dashboard
- **Leaderboards**: Automatic leaderboard updates

### 🛍️ Shop Integration
- **Purchase Verification**: Verify purchases made on website
- **Item Delivery**: Automatic delivery of purchased items
- **Payment Processing**: Integration with website payment system

## Commands

### Player Commands
- `/coins [player]` - View your or another player's coin balance
- `/rank [player]` - View rank information
- `/stats [player]` - View player statistics
- `/verify <code>` - Verify your account with website verification code
- `/shop` - Open the server shop
- `/indus <subcommand>` - Main IndusNetwork command

### Admin Commands
- `/indusadmin <subcommand>` - Admin management commands
  - `reload` - Reload plugin configuration
  - `coins <player> <add/remove/set> <amount>` - Manage player coins
  - `rank <player> <rank>` - Set player rank
  - `delivery <player>` - Check player delivery status
  - `stats <player>` - View detailed player statistics

## Permissions

### Player Permissions
- `indusnetwork.coins` - View coin balance (default: true)
- `indusnetwork.rank` - View rank information (default: true)
- `indusnetwork.stats` - View statistics (default: true)
- `indusnetwork.verify` - Account verification (default: true)
- `indusnetwork.shop` - Access shop (default: true)

### Admin Permissions
- `indusnetwork.admin` - Full admin access (default: op)
- `indusnetwork.admin.coins` - Manage player coins (default: op)
- `indusnetwork.admin.ranks` - Manage player ranks (default: op)
- `indusnetwork.admin.stats` - View/edit player stats (default: op)
- `indusnetwork.admin.delivery` - Manage delivery system (default: op)

## Installation

### Prerequisites
- **Minecraft Server**: Spigot/Paper 1.20.4+
- **Java**: Java 17+
- **Dependencies**: Vault, LuckPerms
- **Optional**: PlaceholderAPI, EssentialsX

### Installation Steps

1. **Download Dependencies**:
   ```bash
   # Download required plugins
   wget https://github.com/MilkBowl/Vault/releases/download/1.7.3/Vault.jar
   wget https://download.luckperms.net/1515/bukkit/loader/LuckPerms-Bukkit-5.4.102.jar
   ```

2. **Build Plugin**:
   ```bash
   cd minecraft-plugin
   mvn clean package
   ```

3. **Install Plugin**:
   ```bash
   # Copy the generated JAR to your plugins folder
   cp target/indusnetwork-plugin-1.0.0.jar /path/to/your/server/plugins/
   ```

4. **Start Server**:
   Start your Minecraft server. The plugin will generate a default configuration file.

5. **Configure Plugin**:
   Edit `plugins/IndusNetworkPlugin/config.yml` with your settings:
   ```yaml
   website:
     url: "https://your-website-url.com"
     api_key: "your_api_key_here"
     webhook_secret: "your_webhook_secret_here"
   
   database:
     type: "mysql"
     host: "localhost"
     port: 3306
     database: "indusnetwork"
     username: "username"
     password: "password"
   ```

6. **Restart Server**:
   Restart your server to apply the configuration.

## Configuration

### Website Integration
```yaml
website:
  url: "https://indusnetwork.highms.pro"
  api_key: "your_secure_api_key"
  webhook_secret: "webhook_verification_secret"
```

### Database Settings
```yaml
database:
  type: "mysql"  # mysql, sqlite, mongodb
  host: "localhost"
  port: 3306
  database: "indusnetwork"
  username: "db_user"
  password: "secure_password"
  table_prefix: "indus_"
```

### Rank Configuration
```yaml
ranks:
  default:
    display_name: "&7Default"
    permission_group: "default"
    coins_multiplier: 1.0
  vip:
    display_name: "&a&lVIP"
    permission_group: "vip"
    coins_multiplier: 1.5
  # ... more ranks
```

## API Integration

### Website Endpoints Used
- `GET /api/players/{uuid}` - Get player data
- `POST /api/players/status` - Update player online status
- `PATCH /api/players/{uuid}/rank` - Update player rank
- `PATCH /api/players/{uuid}/coins` - Update player coins
- `POST /api/players/{uuid}/stats` - Sync player statistics
- `GET /api/store/delivery/pending/{uuid}` - Check pending deliveries
- `POST /api/store/delivery/{id}/complete` - Mark delivery completed
- `POST /api/auth/verify-minecraft` - Verify player account

### Authentication
All API requests include:
- `Authorization: Bearer {api_key}` header
- `Content-Type: application/json` header
- Request signing for sensitive operations

## Development

### Building from Source
```bash
git clone https://github.com/yourusername/indusnetwork-plugin.git
cd indusnetwork-plugin
mvn clean package
```

### Testing
```bash
# Run tests
mvn test

# Run with specific Minecraft version
mvn clean package -Dminecraft.version=1.20.4
```

### Adding Features
1. Create new command classes in `com.indusnetwork.commands`
2. Add event listeners in `com.indusnetwork.listeners`
3. Extend managers in `com.indusnetwork.managers`
4. Update `plugin.yml` with new commands/permissions

## Troubleshooting

### Common Issues

**Plugin not loading**:
- Verify Java 17+ is being used
- Check that Vault and LuckPerms are installed
- Review server console for error messages

**Website connection failed**:
- Verify website URL is correct and accessible
- Check API key is valid
- Ensure firewall allows outbound HTTPS connections

**Player data not syncing**:
- Verify database connection settings
- Check API endpoints are responding
- Review plugin logs for error messages

**Deliveries not working**:
- Confirm player is online when delivery attempted
- Check delivery queue status with `/indusadmin delivery <player>`
- Verify RCON connection if using command-based delivery

### Debug Mode
Enable debug mode in config.yml:
```yaml
settings:
  debug: true
```

This will provide detailed logging for troubleshooting.

## Support

- **Website**: https://indusnetwork.highms.pro
- **Discord**: [Join our Discord](#)
- **Documentation**: [Plugin Wiki](#)
- **Bug Reports**: [GitHub Issues](#)

## License

This plugin is proprietary software owned by IndusNetwork. 
Unauthorized distribution or modification is prohibited.

## Credits

- **Development Team**: IndusNetwork Developers
- **Dependencies**: Vault, LuckPerms, Paper/Spigot
- **Libraries**: HikariCP, Jedis, Caffeine, Commons Lang
