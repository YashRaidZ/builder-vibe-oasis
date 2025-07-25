package com.indusnetwork.managers;

import com.indusnetwork.IndusNetworkPlugin;
import com.indusnetwork.utils.MessageUtils;
import net.luckperms.api.LuckPerms;
import net.luckperms.api.LuckPermsProvider;
import net.luckperms.api.model.user.User;
import net.luckperms.api.node.types.InheritanceNode;
import org.bukkit.entity.Player;
import org.bukkit.configuration.ConfigurationSection;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public class RankManager {
    
    private final IndusNetworkPlugin plugin;
    private final LuckPerms luckPerms;
    private final Map<String, RankData> ranks;
    
    public RankManager(IndusNetworkPlugin plugin) {
        this.plugin = plugin;
        this.luckPerms = LuckPermsProvider.get();
        this.ranks = new HashMap<>();
        
        loadRanks();
    }
    
    private void loadRanks() {
        ConfigurationSection ranksSection = plugin.getConfig().getConfigurationSection("ranks");
        if (ranksSection != null) {
            for (String rankId : ranksSection.getKeys(false)) {
                ConfigurationSection rankSection = ranksSection.getConfigurationSection(rankId);
                if (rankSection != null) {
                    RankData rankData = new RankData(
                        rankId,
                        rankSection.getString("display_name", rankId),
                        rankSection.getString("permission_group", rankId),
                        rankSection.getDouble("coins_multiplier", 1.0)
                    );
                    ranks.put(rankId.toLowerCase(), rankData);
                }
            }
        }
        
        plugin.getLogger().info("Loaded " + ranks.size() + " ranks from configuration");
    }
    
    /**
     * Update player's rank both in-game and on website
     */
    public CompletableFuture<Boolean> updatePlayerRank(Player player, String rankId) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                RankData rankData = ranks.get(rankId.toLowerCase());
                if (rankData == null) {
                    plugin.getLogger().warning("Unknown rank: " + rankId);
                    return false;
                }
                
                // Update LuckPerms group
                User user = luckPerms.getUserManager().getUser(player.getUniqueId());
                if (user != null) {
                    // Clear existing groups
                    user.data().clear(InheritanceNode.builder().build());
                    
                    // Add new group
                    user.data().add(InheritanceNode.builder(rankData.getPermissionGroup()).build());
                    
                    // Save user data
                    luckPerms.getUserManager().saveUser(user);
                    
                    // Update on website
                    plugin.getWebAPIManager().updatePlayerRank(player.getUniqueId(), rankId).thenAccept(success -> {
                        if (!success) {
                            plugin.getLogger().warning("Failed to update rank on website for " + player.getName());
                        }
                    });
                    
                    // Notify player
                    String message = plugin.getConfig().getString("messages.rank_updated", "{prefix}&aYour rank has been updated to {rank}&a!")
                        .replace("{rank}", rankData.getDisplayName());
                    MessageUtils.sendMessage(player, message);
                    
                    plugin.getLogger().info("Updated rank for " + player.getName() + " to " + rankId);
                    return true;
                }
                
                return false;
            } catch (Exception e) {
                plugin.getLogger().severe("Failed to update rank for " + player.getName() + ": " + e.getMessage());
                return false;
            }
        });
    }
    
    /**
     * Get player's current rank
     */
    public String getPlayerRank(Player player) {
        try {
            User user = luckPerms.getUserManager().getUser(player.getUniqueId());
            if (user != null) {
                return user.getPrimaryGroup();
            }
        } catch (Exception e) {
            plugin.getLogger().warning("Failed to get rank for " + player.getName() + ": " + e.getMessage());
        }
        
        return "default";
    }
    
    /**
     * Get rank display name
     */
    public String getRankDisplayName(String rankId) {
        RankData rankData = ranks.get(rankId.toLowerCase());
        return rankData != null ? rankData.getDisplayName() : rankId;
    }
    
    /**
     * Get rank coins multiplier
     */
    public double getRankCoinsMultiplier(String rankId) {
        RankData rankData = ranks.get(rankId.toLowerCase());
        return rankData != null ? rankData.getCoinsMultiplier() : 1.0;
    }
    
    /**
     * Check if rank exists
     */
    public boolean rankExists(String rankId) {
        return ranks.containsKey(rankId.toLowerCase());
    }
    
    /**
     * Get all available ranks
     */
    public Map<String, RankData> getAllRanks() {
        return new HashMap<>(ranks);
    }
    
    // Inner class to hold rank data
    public static class RankData {
        private final String id;
        private final String displayName;
        private final String permissionGroup;
        private final double coinsMultiplier;
        
        public RankData(String id, String displayName, String permissionGroup, double coinsMultiplier) {
            this.id = id;
            this.displayName = displayName;
            this.permissionGroup = permissionGroup;
            this.coinsMultiplier = coinsMultiplier;
        }
        
        public String getId() { return id; }
        public String getDisplayName() { return displayName; }
        public String getPermissionGroup() { return permissionGroup; }
        public double getCoinsMultiplier() { return coinsMultiplier; }
    }
}
