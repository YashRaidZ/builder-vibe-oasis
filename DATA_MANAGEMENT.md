# 🗄️ IndusNetwork Data Management System

This document outlines the comprehensive data management system for the IndusNetwork Minecraft server, including instant delivery, RCON integration, and database schemas.

## 📊 **System Overview**

The IndusNetwork data management system provides:

- **Real-time player data** tracking and management
- **Instant delivery system** with RCON integration
- **Comprehensive store management** with 8+ ranks and multiple item categories
- **Transaction tracking** and automated processing
- **Admin dashboard** for monitoring and control

## 🏗️ **Database Schema**

### **Player Data Structure**

```typescript
interface PlayerData {
  id: string;
  uuid: string;
  username: string;
  rank: PlayerRank; // 12 different ranks
  balance: number;
  gems: number; // Premium currency
  level: number;
  experience: number;
  totalPlaytime: number;
  stats: PlayerStats; // Combat, building, economy
  preferences: PlayerPreferences;
  isVerified: boolean;
  isOnline: boolean;
  location?: PlayerLocation;
}
```

### **Store System**

```typescript
interface StoreItemData {
  id: string;
  name: string;
  category: StoreCategory; // 11 categories
  type: ItemType;
  price: number;
  currency: "money" | "gems";
  deliveryCommands: DeliveryCommand[];
  requirements: ItemRequirement[];
  // Analytics and metadata
}
```

## 🎮 **Rank System**

### **Available Ranks (12 Total)**

1. **Default** - Free starter rank
2. **Helper** - Staff helper role
3. **VIP** (₹199) - Flight, heal, feed, 3 homes, 25% XP boost
4. **VIP+** (₹349) - God mode, 5 homes, private warps, 50% XP boost
5. **MVP** (₹599) - Speed commands, 8 homes, 75% XP boost, 50% money boost
6. **MVP+** (₹899) - Gamemode, time/weather control, unlimited homes, 100% XP boost
7. **Legend** (₹1299) - Creative access, WorldEdit, disguise, 150% XP boost
8. **Legend+** (₹1799) - Item spawning, custom enchanting, 200% XP boost
9. **Ultimate** (₹2499) - All features, custom prefix, exclusive worlds, 300% XP boost
10. **Moderator** - Staff moderation role
11. **Admin** - Full administration access
12. **Owner** - Server owner permissions

### **Rank Features**

Each rank includes:

- **Permissions**: LuckPerms integration
- **Commands**: Custom command access
- **Limits**: Home/warp limits
- **Bonuses**: XP and money multipliers
- **Cosmetics**: Prefixes, suffixes, chat colors

## 🛒 **Store Categories & Items**

### **Categories (11 Total)**

1. **Ranks** - All purchasable ranks with instant promotion
2. **Kits** - Starter, Builder, Combat, Premium kits
3. **Currency** - Coins (1K, 5K) and Gems (100, 500)
4. **Tools** - Enchanted pickaxes, weapons, armor
5. **Cosmetics** - Trails, particles, disguises
6. **Items** - Custom items and materials
7. **Weapons** - Enhanced weapons with custom enchants
8. **Armor** - Protective gear with bonuses
9. **Boosters** - XP, money, and other multipliers
10. **Access** - Special area or feature access
11. **Special** - Limited-time and exclusive items

### **Sample Items**

- **VIP Rank**: Instant flight, heal, feed access
- **Starter Kit**: Diamond armor, tools, food, building materials
- **Combat Kit**: Netherite gear with enchantments, potions
- **1000 Coins**: Server currency for trading
- **Rainbow Trail**: Cosmetic particle effects

## ⚡ **Instant Delivery System**

### **Delivery Flow**

1. **Purchase Created** → Payment processing begins
2. **Payment Completed** → Item queued for delivery
3. **RCON Commands** → Executed in sequence with delays
4. **Player Notification** → Success/failure messages sent
5. **Status Tracking** → Real-time updates in admin panel

### **Delivery Methods**

```typescript
// Rank upgrades
DeliveryHelpers.rankUpgrade(username, rank, transactionId, immediate);

// Currency delivery
DeliveryHelpers.giveCoins(username, amount, transactionId, immediate);

// Kit delivery
DeliveryHelpers.deliverKit(
  username,
  kitItems,
  kitName,
  transactionId,
  immediate,
);
```

### **RCON Integration**

- **Connection Management**: Automatic reconnection and health checks
- **Command Queue**: Priority-based command execution
- **Error Handling**: Retry logic and failure notifications
- **Real-time Monitoring**: Live status and queue management

## 🔧 **Delivery Commands**

### **Rank Promotion Commands**

```bash
lp user {username} parent set {rank}
broadcast {username} has been promoted to {rank}!
title {username} title {"text":"RANK UP!","color":"gold","bold":true}
title {username} subtitle {"text":"Welcome to {rank}","color":"yellow"}
```

### **Item Delivery Commands**

```bash
give {username} {item} {quantity} {nbt}
eco give {username} {amount}
tellraw {username} {"text":"Items delivered!","color":"green"}
```

### **Kit Delivery Examples**

```bash
# Starter Kit
give {username} diamond_helmet 1
give {username} diamond_chestplate 1
give {username} diamond_sword 1
give {username} golden_apple 16

# Combat Kit
give {username} netherite_helmet 1 {Enchantments:[{id:"protection",lvl:4}]}
give {username} potion 8 {Potion:"strong_strength"}
```

## 📈 **Transaction Tracking**

### **Purchase States**

- **Pending** - Payment being processed
- **Processing** - Payment confirmed, delivery in progress
- **Paid** - Payment complete, awaiting delivery
- **Failed** - Payment or delivery failed
- **Cancelled** - Purchase cancelled
- **Refunded** - Payment refunded

### **Delivery States**

- **Pending** - Waiting for delivery
- **Processing** - Commands being executed
- **Delivered** - Successfully completed
- **Failed** - Delivery failed (retryable)
- **Partial** - Some commands succeeded

### **Tracking Features**

- **Attempt Counter**: Tracks delivery attempts (max 3)
- **Error Logging**: Detailed failure reasons
- **Retry Logic**: Automatic and manual retry options
- **Success Rate**: Real-time delivery success metrics

## 👨‍💼 **Admin Dashboard Features**

### **Real-time Monitoring**

- **Server Statistics**: TPS, memory, online players
- **RCON Status**: Connection health and command queue
- **Purchase Analytics**: Revenue, success rates, popular items
- **Delivery Queue**: Live monitoring of all deliveries

### **Management Tools**

- **RCON Console**: Direct server command execution
- **Manual Delivery**: Force delivery for failed purchases
- **Queue Management**: Retry, cancel, or prioritize deliveries
- **Player Management**: View stats, modify ranks, handle issues

### **Quick Actions**

```bash
# Common RCON commands
list                    # Show online players
tps                     # Check server performance
save-all               # Save world data
give player item 1     # Give items to players
kick player reason     # Kick problematic players
```

## 🔒 **Security & Reliability**

### **Security Measures**

- **Authentication**: JWT tokens for API access
- **Authorization**: Role-based admin access
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Sanitize all commands and inputs
- **Audit Logging**: Track all admin actions

### **Reliability Features**

- **Connection Monitoring**: Automatic RCON reconnection
- **Queue Persistence**: Deliveries survive server restarts
- **Error Recovery**: Comprehensive retry mechanisms
- **Health Checks**: Regular system status monitoring

## 📊 **Analytics & Reporting**

### **Purchase Analytics**

- **Revenue Tracking**: Daily, weekly, monthly totals
- **Popular Items**: Best-selling ranks and items
- **Success Rates**: Delivery completion percentages
- **Player Behavior**: Purchase patterns and trends

### **Server Analytics**

- **Performance Metrics**: TPS, memory usage, uptime
- **Player Activity**: Online counts, peak times
- **Command Execution**: RCON usage and success rates
- **Error Tracking**: Failed deliveries and system issues

## 🚀 **API Endpoints**

### **Store Management**

```typescript
GET    /api/store/items                    // List all items
GET    /api/store/items/:id               // Get item details
POST   /api/store/purchase                // Create purchase
GET    /api/store/purchases               // List purchases
POST   /api/store/purchases/:id/retry     // Retry delivery

// Delivery Management
GET    /api/store/delivery/status         // Queue status
POST   /api/store/delivery/manual/:id     // Manual delivery
```

### **Server Management**

```typescript
GET / api / server / status; // Server statistics
POST / api / server / rcon; // Execute RCON command
POST / api / server / restart; // Restart server
GET / api / server / actions; // Server actions log
```

## 🔧 **Configuration**

### **Environment Variables**

```bash
# RCON Configuration
MINECRAFT_RCON_HOST=indusnetwork.highms.pro
MINECRAFT_RCON_PORT=25575
MINECRAFT_RCON_PASSWORD=secure_password

# Delivery Settings
DELIVERY_MAX_ATTEMPTS=3
DELIVERY_RETRY_DELAY=60
DELIVERY_BATCH_SIZE=10
DELIVERY_PROCESSING_INTERVAL=5

# Features
ENABLE_RCON=true
ENABLE_DELIVERY=true
ENABLE_PAYMENTS=true
```

## 📝 **Usage Examples**

### **Making a Purchase**

```typescript
// Frontend purchase flow
const response = await api.store.createPurchase(
  itemId,
  playerId,
  playerUsername,
);
// Backend automatically:
// 1. Processes payment
// 2. Queues delivery commands
// 3. Executes via RCON
// 4. Notifies player in-game
```

### **Manual Delivery**

```typescript
// Admin panel manual delivery
const result = await api.store.triggerManualDelivery(
  purchaseId,
  playerUsername,
);
// Immediately executes delivery commands
```

### **Monitoring Queue**

```typescript
// Real-time queue monitoring
const status = await api.store.getDeliveryStatus();
console.log(
  `Queue: ${status.queue.total} items, ${status.queue.processing} processing`,
);
```

## 🔄 **Development Workflow**

### **Adding New Items**

1. **Define Item**: Add to `store-data.ts` with delivery commands
2. **Create Commands**: Specify RCON commands for delivery
3. **Add Images**: Create appropriate images in `/images/`
4. **Test Delivery**: Verify commands work correctly
5. **Deploy**: Update production data

### **Adding New Ranks**

1. **Rank Definition**: Add to `ranksData` with permissions
2. **LuckPerms Setup**: Configure server-side permissions
3. **Delivery Commands**: Set promotion commands
4. **UI Updates**: Add rank images and descriptions
5. **Testing**: Verify promotion and features work

## 🎯 **Best Practices**

### **Delivery Commands**

- **Use delays**: Prevent command spam
- **Add retries**: Handle temporary failures
- **Validate targets**: Check player existence
- **Send feedback**: Notify players of results

### **Error Handling**

- **Log everything**: Comprehensive error logging
- **Graceful degradation**: System continues with failures
- **User feedback**: Clear error messages
- **Admin alerts**: Notify of critical issues

### **Performance**

- **Queue management**: Process in batches
- **Connection pooling**: Reuse RCON connections
- **Caching**: Cache frequently accessed data
- **Monitoring**: Track system performance

The IndusNetwork data management system provides a complete, production-ready solution for Minecraft server management with real-time delivery, comprehensive analytics, and robust error handling.
