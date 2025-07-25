package com.indusnetwork;

import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.event.Listener;

import com.indusnetwork.commands.*;
import com.indusnetwork.listeners.*;
import com.indusnetwork.managers.*;
import com.indusnetwork.api.WebAPIManager;

public class IndusNetworkPlugin extends JavaPlugin implements Listener {
    
    private static IndusNetworkPlugin instance;
    private WebAPIManager webAPIManager;
    private DatabaseManager databaseManager;
    private DeliveryManager deliveryManager;
    private RankManager rankManager;
    private CoinManager coinManager;
    private StatsManager statsManager;
    
    @Override
    public void onEnable() {
        instance = this;
        
        // Save default config
        saveDefaultConfig();
        
        // Initialize managers
        initializeManagers();
        
        // Register commands
        registerCommands();
        
        // Register listeners
        registerListeners();
        
        // Start background tasks
        startBackgroundTasks();
        
        getLogger().info("IndusNetwork Plugin v" + getDescription().getVersion() + " has been enabled!");
        getLogger().info("Website integration: " + getConfig().getString("website.url"));
    }
    
    @Override
    public void onDisable() {
        // Save any pending data
        if (statsManager != null) {
            statsManager.saveAllStats();
        }
        
        // Close database connections
        if (databaseManager != null) {
            databaseManager.close();
        }
        
        getLogger().info("IndusNetwork Plugin has been disabled!");
    }
    
    private void initializeManagers() {
        try {
            // Initialize MessageUtils first
            com.indusnetwork.utils.MessageUtils.setPlugin(this);

            // Initialize core managers
            this.webAPIManager = new WebAPIManager(this);
            this.databaseManager = new DatabaseManager(this);
            this.deliveryManager = new DeliveryManager(this);
            this.rankManager = new RankManager(this);
            this.coinManager = new CoinManager(this);
            this.statsManager = new StatsManager(this);

            getLogger().info("All managers initialized successfully!");
        } catch (Exception e) {
            getLogger().severe("Failed to initialize managers: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void registerCommands() {
        // Register custom commands
        getCommand("coins").setExecutor(new CoinsCommand(this));
        getCommand("rank").setExecutor(new RankCommand(this));
        getCommand("stats").setExecutor(new StatsCommand(this));
        getCommand("verify").setExecutor(new VerifyCommand(this));
        getCommand("shop").setExecutor(new ShopCommand(this));
        getCommand("indus").setExecutor(new IndusCommand(this));
        
        // Admin commands
        getCommand("indusadmin").setExecutor(new AdminCommand(this));
    }
    
    private void registerListeners() {
        getServer().getPluginManager().registerEvents(new PlayerJoinListener(this), this);
        getServer().getPluginManager().registerEvents(new PlayerQuitListener(this), this);
        getServer().getPluginManager().registerEvents(new PlayerStatsListener(this), this);
        getServer().getPluginManager().registerEvents(new DeliveryListener(this), this);
        getServer().getPluginManager().registerEvents(new RankUpdateListener(this), this);
    }
    
    private void startBackgroundTasks() {
        // Sync player data every 5 minutes
        getServer().getScheduler().runTaskTimerAsynchronously(this, () -> {
            syncOnlinePlayersWithWeb();
        }, 20L * 60L * 5L, 20L * 60L * 5L); // 5 minutes
        
        // Check for pending deliveries every 30 seconds
        getServer().getScheduler().runTaskTimerAsynchronously(this, () -> {
            deliveryManager.checkPendingDeliveries();
        }, 20L * 30L, 20L * 30L); // 30 seconds
        
        // Save stats every 10 minutes
        getServer().getScheduler().runTaskTimerAsynchronously(this, () -> {
            statsManager.saveAllStats();
        }, 20L * 60L * 10L, 20L * 60L * 10L); // 10 minutes
    }
    
    private void syncOnlinePlayersWithWeb() {
        for (Player player : getServer().getOnlinePlayers()) {
            webAPIManager.updatePlayerStatus(player.getUniqueId(), true);
            statsManager.syncPlayerStats(player);
        }
    }
    
    // Getters for managers
    public static IndusNetworkPlugin getInstance() {
        return instance;
    }
    
    public WebAPIManager getWebAPIManager() {
        return webAPIManager;
    }
    
    public DatabaseManager getDatabaseManager() {
        return databaseManager;
    }
    
    public DeliveryManager getDeliveryManager() {
        return deliveryManager;
    }
    
    public RankManager getRankManager() {
        return rankManager;
    }
    
    public CoinManager getCoinManager() {
        return coinManager;
    }
    
    public StatsManager getStatsManager() {
        return statsManager;
    }
}
