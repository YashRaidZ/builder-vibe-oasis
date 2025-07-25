package com.indusnetwork.listeners;

import com.indusnetwork.IndusNetworkPlugin;
import com.indusnetwork.utils.MessageUtils;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;

public class PlayerJoinListener implements Listener {
    
    private final IndusNetworkPlugin plugin;
    
    public PlayerJoinListener(IndusNetworkPlugin plugin) {
        this.plugin = plugin;
    }
    
    @EventHandler(priority = EventPriority.MONITOR)
    public void onPlayerJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();
        
        // Load player data asynchronously
        plugin.getServer().getScheduler().runTaskAsynchronously(plugin, () -> {
            // Update player online status on website
            plugin.getWebAPIManager().updatePlayerStatus(player.getUniqueId(), true);
            
            // Load player coins
            plugin.getCoinManager().loadPlayerCoins(player.getUniqueId());
            
            // Check if player is verified
            plugin.getWebAPIManager().getPlayerData(player.getUniqueId()).thenAccept(playerData -> {
                if (playerData != null) {
                    // Player exists on website
                    if (playerData.isVerified()) {
                        // Update rank if needed
                        String currentRank = plugin.getRankManager().getPlayerRank(player);
                        if (!currentRank.equals(playerData.getRank())) {
                            plugin.getRankManager().updatePlayerRank(player, playerData.getRank());
                        }
                        
                        // Sync coins
                        plugin.getCoinManager().setPlayerCoins(player.getUniqueId(), playerData.getCoins());
                        
                        // Welcome back message
                        plugin.getServer().getScheduler().runTaskLater(plugin, () -> {
                            MessageUtils.sendPrefixedMessage(player, "&aWelcome back, " + player.getName() + "!");
                            
                            String rankDisplay = plugin.getRankManager().getRankDisplayName(playerData.getRank());
                            MessageUtils.sendPrefixedMessage(player, "&6Current Rank: " + rankDisplay);
                            MessageUtils.sendPrefixedMessage(player, "&6Coins: &e" + playerData.getCoins());
                        }, 40L); // 2 seconds delay
                        
                    } else {
                        // Player not verified
                        plugin.getServer().getScheduler().runTaskLater(plugin, () -> {
                            MessageUtils.sendPrefixedMessage(player, "&cYour account is not verified!");
                            MessageUtils.sendPrefixedMessage(player, "&6Visit our website to get your verification code:");
                            MessageUtils.sendPrefixedMessage(player, "&b" + plugin.getConfig().getString("website.url", "https://indusnetwork.highms.pro"));
                            MessageUtils.sendPrefixedMessage(player, "&6Then use: &e/verify <code>");
                        }, 60L); // 3 seconds delay
                    }
                } else {
                    // New player
                    plugin.getServer().getScheduler().runTaskLater(plugin, () -> {
                        MessageUtils.sendPrefixedMessage(player, "&aWelcome to IndusNetwork, " + player.getName() + "!");
                        MessageUtils.sendPrefixedMessage(player, "&6To get started, visit our website:");
                        MessageUtils.sendPrefixedMessage(player, "&b" + plugin.getConfig().getString("website.url", "https://indusnetwork.highms.pro"));
                        MessageUtils.sendPrefixedMessage(player, "&6Register your account and use &e/verify <code>&6 to link it!");
                        
                        // Give starting coins
                        int startingCoins = plugin.getConfig().getInt("settings.starting_coins", 100);
                        plugin.getCoinManager().setPlayerCoins(player.getUniqueId(), startingCoins);
                        MessageUtils.sendPrefixedMessage(player, "&aYou have been given " + startingCoins + " starting coins!");
                    }, 80L); // 4 seconds delay
                }
            }).exceptionally(throwable -> {
                plugin.getLogger().warning("Failed to load player data for " + player.getName() + ": " + throwable.getMessage());
                return null;
            });
            
            // Check for pending deliveries
            plugin.getDeliveryManager().checkPlayerDeliveries(player);
            
            // Initialize stats tracking
            plugin.getStatsManager().initializePlayer(player);
        });
        
        // Send welcome title
        plugin.getServer().getScheduler().runTaskLater(plugin, () -> {
            MessageUtils.sendTitle(player, 
                "&6&lIndusNetwork", 
                "&bWelcome " + player.getName() + "!", 
                10, 60, 20);
        }, 20L); // 1 second delay
    }
}
