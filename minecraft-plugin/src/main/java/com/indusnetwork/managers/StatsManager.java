package com.indusnetwork.managers;

import com.indusnetwork.IndusNetworkPlugin;
import com.indusnetwork.api.WebAPIManager;
import org.bukkit.entity.Player;
import org.bukkit.Statistic;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public class StatsManager {
    
    private final IndusNetworkPlugin plugin;
    private final Map<UUID, PlayerStatsData> playerStats;
    
    public StatsManager(IndusNetworkPlugin plugin) {
        this.plugin = plugin;
        this.playerStats = new HashMap<>();
    }
    
    /**
     * Initialize player stats tracking
     */
    public void initializePlayer(Player player) {
        UUID playerId = player.getUniqueId();
        
        if (!playerStats.containsKey(playerId)) {
            PlayerStatsData stats = new PlayerStatsData();
            stats.playerId = playerId;
            stats.playerName = player.getName();
            stats.sessionStartTime = System.currentTimeMillis();
            
            // Load current Minecraft statistics
            updatePlayerStats(player, stats);
            
            playerStats.put(playerId, stats);
        }
    }
    
    /**
     * Update player stats from Minecraft statistics
     */
    private void updatePlayerStats(Player player, PlayerStatsData stats) {
        try {
            stats.kills = player.getStatistic(Statistic.PLAYER_KILLS);
            stats.deaths = player.getStatistic(Statistic.DEATHS);
            stats.distanceWalked = player.getStatistic(Statistic.WALK_ONE_CM);
            stats.playtimeMinutes = player.getStatistic(Statistic.PLAY_ONE_MINUTE) / 1200; // Convert ticks to minutes

            // Calculate total blocks broken/placed by summing all materials
            stats.blocksBroken = calculateTotalBlocksBroken(player);
            stats.blocksPlaced = calculateTotalBlocksPlaced(player);

        } catch (Exception e) {
            // Some statistics might not be available, use defaults
            plugin.getLogger().warning("Could not load some statistics for " + player.getName() + ": " + e.getMessage());
        }
    }

    private int calculateTotalBlocksBroken(Player player) {
        int total = 0;
        try {
            // Sum up mining statistics for common blocks only
            org.bukkit.Material[] commonBlocks = {
                org.bukkit.Material.STONE, org.bukkit.Material.DIRT, org.bukkit.Material.COBBLESTONE,
                org.bukkit.Material.OAK_LOG, org.bukkit.Material.COAL_ORE, org.bukkit.Material.IRON_ORE
            };

            for (org.bukkit.Material material : commonBlocks) {
                try {
                    total += player.getStatistic(Statistic.MINE_BLOCK, material);
                } catch (Exception ignored) {
                    // Skip if statistic doesn't exist for this material
                }
            }
        } catch (Exception e) {
            return 0;
        }
        return total;
    }

    private int calculateTotalBlocksPlaced(Player player) {
        int total = 0;
        try {
            // Sum up placement statistics for common blocks only
            org.bukkit.Material[] commonBlocks = {
                org.bukkit.Material.STONE, org.bukkit.Material.DIRT, org.bukkit.Material.COBBLESTONE,
                org.bukkit.Material.OAK_PLANKS, org.bukkit.Material.TORCH, org.bukkit.Material.CHEST
            };

            for (org.bukkit.Material material : commonBlocks) {
                try {
                    total += player.getStatistic(Statistic.USE_ITEM, material);
                } catch (Exception ignored) {
                    // Skip if statistic doesn't exist for this material
                }
            }
        } catch (Exception e) {
            return 0;
        }
        return total;
    }
    
    /**
     * Sync player stats with website
     */
    public CompletableFuture<Void> syncPlayerStats(Player player) {
        return CompletableFuture.runAsync(() -> {
            PlayerStatsData stats = playerStats.get(player.getUniqueId());
            if (stats != null) {
                updatePlayerStats(player, stats);
                
                WebAPIManager.PlayerStats apiStats = new WebAPIManager.PlayerStats(
                    stats.kills,
                    stats.deaths,
                    stats.playtimeMinutes,
                    stats.blocksBroken,
                    stats.blocksPlaced,
                    stats.distanceWalked
                );
                
                plugin.getWebAPIManager().syncPlayerStats(player.getUniqueId(), apiStats);
            }
        });
    }
    
    /**
     * Get player stats
     */
    public PlayerStatsData getPlayerStats(UUID playerId) {
        return playerStats.get(playerId);
    }
    
    /**
     * Save all player stats
     */
    public void saveAllStats() {
        for (Player player : plugin.getServer().getOnlinePlayers()) {
            syncPlayerStats(player);
        }
    }
    
    /**
     * Remove player from tracking when they leave
     */
    public void removePlayer(UUID playerId) {
        playerStats.remove(playerId);
    }
    
    // Inner class to hold player stats data
    public static class PlayerStatsData {
        public UUID playerId;
        public String playerName;
        public int kills = 0;
        public int deaths = 0;
        public int blocksBroken = 0;
        public int blocksPlaced = 0;
        public long distanceWalked = 0;
        public long playtimeMinutes = 0;
        public long sessionStartTime = 0;
        
        public double getKDRatio() {
            return deaths > 0 ? (double) kills / deaths : kills;
        }
        
        public String getFormattedPlaytime() {
            long hours = playtimeMinutes / 60;
            long minutes = playtimeMinutes % 60;
            return hours + "h " + minutes + "m";
        }
    }
}
