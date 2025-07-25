package com.indusnetwork.managers;

import com.indusnetwork.IndusNetworkPlugin;
import com.indusnetwork.utils.MessageUtils;
import org.bukkit.entity.Player;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public class CoinManager {
    
    private final IndusNetworkPlugin plugin;
    private final Map<UUID, Integer> playerCoins;
    
    public CoinManager(IndusNetworkPlugin plugin) {
        this.plugin = plugin;
        this.playerCoins = new HashMap<>();
    }
    
    /**
     * Get player's coin balance
     */
    public int getPlayerCoins(UUID playerId) {
        return playerCoins.getOrDefault(playerId, 0);
    }
    
    /**
     * Set player's coin balance
     */
    public void setPlayerCoins(UUID playerId, int coins) {
        playerCoins.put(playerId, Math.max(0, coins));
        
        // Sync with website
        plugin.getWebAPIManager().updatePlayerCoins(playerId, coins).exceptionally(throwable -> {
            plugin.getLogger().warning("Failed to sync coins with website: " + throwable.getMessage());
            return false;
        });
    }
    
    /**
     * Add coins to player's balance
     */
    public CompletableFuture<Boolean> addPlayerCoins(UUID playerId, int amount) {
        return CompletableFuture.supplyAsync(() -> {
            if (amount <= 0) return false;
            
            int currentCoins = getPlayerCoins(playerId);
            int newCoins = currentCoins + amount;
            
            setPlayerCoins(playerId, newCoins);
            
            // Notify player if online
            Player player = plugin.getServer().getPlayer(playerId);
            if (player != null) {
                String message = plugin.getConfig().getString("messages.coins_added", "{prefix}&a+{amount} coins added to your account!")
                    .replace("{amount}", String.valueOf(amount));
                MessageUtils.sendMessage(player, message);
            }
            
            return true;
        });
    }
    
    /**
     * Remove coins from player's balance
     */
    public CompletableFuture<Boolean> removePlayerCoins(UUID playerId, int amount) {
        return CompletableFuture.supplyAsync(() -> {
            if (amount <= 0) return false;
            
            int currentCoins = getPlayerCoins(playerId);
            if (currentCoins < amount) {
                return false; // Insufficient coins
            }
            
            int newCoins = currentCoins - amount;
            setPlayerCoins(playerId, newCoins);
            
            // Notify player if online
            Player player = plugin.getServer().getPlayer(playerId);
            if (player != null) {
                String message = plugin.getConfig().getString("messages.coins_removed", "{prefix}&c-{amount} coins removed from your account!")
                    .replace("{amount}", String.valueOf(amount));
                MessageUtils.sendMessage(player, message);
            }
            
            return true;
        });
    }
    
    /**
     * Check if player has enough coins
     */
    public boolean hasEnoughCoins(UUID playerId, int amount) {
        return getPlayerCoins(playerId) >= amount;
    }
    
    /**
     * Transfer coins between players
     */
    public CompletableFuture<Boolean> transferCoins(UUID fromPlayerId, UUID toPlayerId, int amount) {
        return CompletableFuture.supplyAsync(() -> {
            if (amount <= 0) return false;
            
            if (!hasEnoughCoins(fromPlayerId, amount)) {
                return false;
            }
            
            // Remove from sender
            removePlayerCoins(fromPlayerId, amount);
            
            // Add to receiver
            addPlayerCoins(toPlayerId, amount);
            
            // Notify players
            Player fromPlayer = plugin.getServer().getPlayer(fromPlayerId);
            Player toPlayer = plugin.getServer().getPlayer(toPlayerId);
            
            if (fromPlayer != null) {
                MessageUtils.sendMessage(fromPlayer, "&aYou sent " + amount + " coins to " + 
                    (toPlayer != null ? toPlayer.getName() : "another player"));
            }
            
            if (toPlayer != null) {
                MessageUtils.sendMessage(toPlayer, "&aYou received " + amount + " coins from " + 
                    (fromPlayer != null ? fromPlayer.getName() : "another player"));
            }
            
            return true;
        });
    }
    
    /**
     * Apply rank multiplier to coin earning
     */
    public int applyRankMultiplier(UUID playerId, int baseAmount) {
        Player player = plugin.getServer().getPlayer(playerId);
        if (player != null) {
            String rank = plugin.getRankManager().getPlayerRank(player);
            double multiplier = plugin.getRankManager().getRankCoinsMultiplier(rank);
            return (int) Math.ceil(baseAmount * multiplier);
        }
        return baseAmount;
    }
    
    /**
     * Give daily bonus coins
     */
    public CompletableFuture<Boolean> giveDailyBonus(UUID playerId) {
        return CompletableFuture.supplyAsync(() -> {
            int dailyBonus = plugin.getConfig().getInt("settings.daily_bonus", 50);
            int bonusWithMultiplier = applyRankMultiplier(playerId, dailyBonus);
            
            addPlayerCoins(playerId, bonusWithMultiplier);
            
            Player player = plugin.getServer().getPlayer(playerId);
            if (player != null) {
                MessageUtils.sendMessage(player, "&aDaily bonus: +" + bonusWithMultiplier + " coins!");
            }
            
            return true;
        });
    }
    
    /**
     * Load player coins from website
     */
    public CompletableFuture<Void> loadPlayerCoins(UUID playerId) {
        return plugin.getWebAPIManager().getPlayerData(playerId).thenAccept(playerData -> {
            if (playerData != null) {
                playerCoins.put(playerId, playerData.getCoins());
            } else {
                // Set starting coins for new players
                int startingCoins = plugin.getConfig().getInt("settings.starting_coins", 100);
                playerCoins.put(playerId, startingCoins);
                setPlayerCoins(playerId, startingCoins);
            }
        });
    }
    
    /**
     * Save all player coins to website
     */
    public void saveAllCoins() {
        for (Map.Entry<UUID, Integer> entry : playerCoins.entrySet()) {
            plugin.getWebAPIManager().updatePlayerCoins(entry.getKey(), entry.getValue());
        }
    }
}
