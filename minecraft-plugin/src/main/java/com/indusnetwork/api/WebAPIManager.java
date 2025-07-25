package com.indusnetwork.api;

import com.indusnetwork.IndusNetworkPlugin;
import org.bukkit.entity.Player;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public class WebAPIManager {
    
    private final IndusNetworkPlugin plugin;
    private final String baseUrl;
    private final String apiKey;
    private final JSONParser jsonParser;
    
    public WebAPIManager(IndusNetworkPlugin plugin) {
        this.plugin = plugin;
        this.baseUrl = plugin.getConfig().getString("website.url", "https://indusnetwork.highms.pro");
        this.apiKey = plugin.getConfig().getString("website.api_key", "");
        this.jsonParser = new JSONParser();
    }
    
    /**
     * Verify player account with website
     */
    public CompletableFuture<Boolean> verifyPlayer(UUID playerId, String verificationCode) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                JSONObject requestData = new JSONObject();
                requestData.put("player_id", playerId.toString());
                requestData.put("verification_code", verificationCode);
                
                JSONObject response = makeAPIRequest("/api/auth/verify-minecraft", "POST", requestData);
                if (response != null) {
                    return (Boolean) response.getOrDefault("success", false);
                }
                return false;
            } catch (Exception e) {
                plugin.getLogger().severe("Failed to verify player: " + e.getMessage());
                return false;
            }
        });
    }
    
    /**
     * Update player online status
     */
    public CompletableFuture<Void> updatePlayerStatus(UUID playerId, boolean online) {
        return CompletableFuture.runAsync(() -> {
            try {
                JSONObject requestData = new JSONObject();
                requestData.put("player_id", playerId.toString());
                requestData.put("online", online);
                requestData.put("timestamp", System.currentTimeMillis());
                
                makeAPIRequest("/api/players/status", "POST", requestData);
            } catch (Exception e) {
                plugin.getLogger().warning("Failed to update player status: " + e.getMessage());
            }
        });
    }
    
    /**
     * Get player data from website
     */
    public CompletableFuture<PlayerData> getPlayerData(UUID playerId) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                JSONObject response = makeAPIRequest("/api/players/" + playerId.toString(), "GET", null);
                if (response != null && (Boolean) response.getOrDefault("success", false)) {
                    JSONObject playerData = (JSONObject) response.get("data");
                    return new PlayerData(
                        (String) playerData.get("username"),
                        (String) playerData.get("rank"),
                        ((Number) playerData.get("coins")).intValue(),
                        (Boolean) playerData.getOrDefault("verified", false)
                    );
                }
                return null;
            } catch (Exception e) {
                plugin.getLogger().severe("Failed to get player data: " + e.getMessage());
                return null;
            }
        });
    }
    
    /**
     * Update player rank
     */
    public CompletableFuture<Boolean> updatePlayerRank(UUID playerId, String rank) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                JSONObject requestData = new JSONObject();
                requestData.put("rank", rank);
                
                JSONObject response = makeAPIRequest("/api/players/" + playerId.toString() + "/rank", "PATCH", requestData);
                return response != null && (Boolean) response.getOrDefault("success", false);
            } catch (Exception e) {
                plugin.getLogger().severe("Failed to update player rank: " + e.getMessage());
                return false;
            }
        });
    }
    
    /**
     * Update player coins
     */
    public CompletableFuture<Boolean> updatePlayerCoins(UUID playerId, int coins) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                JSONObject requestData = new JSONObject();
                requestData.put("coins", coins);
                
                JSONObject response = makeAPIRequest("/api/players/" + playerId.toString() + "/coins", "PATCH", requestData);
                return response != null && (Boolean) response.getOrDefault("success", false);
            } catch (Exception e) {
                plugin.getLogger().severe("Failed to update player coins: " + e.getMessage());
                return false;
            }
        });
    }
    
    /**
     * Sync player statistics with website
     */
    public CompletableFuture<Boolean> syncPlayerStats(UUID playerId, PlayerStats stats) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                JSONObject requestData = new JSONObject();
                requestData.put("kills", stats.getKills());
                requestData.put("deaths", stats.getDeaths());
                requestData.put("playtime", stats.getPlaytime());
                requestData.put("blocks_broken", stats.getBlocksBroken());
                requestData.put("blocks_placed", stats.getBlocksPlaced());
                requestData.put("distance_walked", stats.getDistanceWalked());
                requestData.put("last_seen", System.currentTimeMillis());
                
                JSONObject response = makeAPIRequest("/api/players/" + playerId.toString() + "/stats", "POST", requestData);
                return response != null && (Boolean) response.getOrDefault("success", false);
            } catch (Exception e) {
                plugin.getLogger().severe("Failed to sync player stats: " + e.getMessage());
                return false;
            }
        });
    }
    
    /**
     * Check for pending deliveries
     */
    public CompletableFuture<DeliveryData[]> checkPendingDeliveries(UUID playerId) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                JSONObject response = makeAPIRequest("/api/store/delivery/pending/" + playerId.toString(), "GET", null);
                if (response != null && (Boolean) response.getOrDefault("success", false)) {
                    // Parse delivery data from response
                    // This would need to be implemented based on your API structure
                    return new DeliveryData[0]; // Placeholder
                }
                return new DeliveryData[0];
            } catch (Exception e) {
                plugin.getLogger().severe("Failed to check pending deliveries: " + e.getMessage());
                return new DeliveryData[0];
            }
        });
    }
    
    /**
     * Mark delivery as completed
     */
    public CompletableFuture<Boolean> markDeliveryCompleted(String deliveryId) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                JSONObject requestData = new JSONObject();
                requestData.put("status", "completed");
                requestData.put("completed_at", System.currentTimeMillis());
                
                JSONObject response = makeAPIRequest("/api/store/delivery/" + deliveryId + "/complete", "POST", requestData);
                return response != null && (Boolean) response.getOrDefault("success", false);
            } catch (Exception e) {
                plugin.getLogger().severe("Failed to mark delivery as completed: " + e.getMessage());
                return false;
            }
        });
    }
    
    /**
     * Make HTTP request to API
     */
    private JSONObject makeAPIRequest(String endpoint, String method, JSONObject data) {
        try {
            URL url = new URL(baseUrl + endpoint);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            
            // Set request properties
            connection.setRequestMethod(method);
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Authorization", "Bearer " + apiKey);
            connection.setRequestProperty("User-Agent", "IndusNetwork-Plugin/1.0.0");
            
            // Send data if present
            if (data != null && ("POST".equals(method) || "PATCH".equals(method) || "PUT".equals(method))) {
                connection.setDoOutput(true);
                try (OutputStreamWriter writer = new OutputStreamWriter(connection.getOutputStream())) {
                    writer.write(data.toJSONString());
                    writer.flush();
                }
            }
            
            // Read response
            int responseCode = connection.getResponseCode();
            if (responseCode >= 200 && responseCode < 300) {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                    return (JSONObject) jsonParser.parse(response.toString());
                }
            } else {
                plugin.getLogger().warning("API request failed with code " + responseCode + " for endpoint: " + endpoint);
                return null;
            }
            
        } catch (Exception e) {
            plugin.getLogger().severe("Failed to make API request to " + endpoint + ": " + e.getMessage());
            return null;
        }
    }
    
    // Data classes
    public static class PlayerData {
        private final String username;
        private final String rank;
        private final int coins;
        private final boolean verified;
        
        public PlayerData(String username, String rank, int coins, boolean verified) {
            this.username = username;
            this.rank = rank;
            this.coins = coins;
            this.verified = verified;
        }
        
        public String getUsername() { return username; }
        public String getRank() { return rank; }
        public int getCoins() { return coins; }
        public boolean isVerified() { return verified; }
    }
    
    public static class PlayerStats {
        private int kills, deaths, blocksBroken, blocksPlaced;
        private long playtime, distanceWalked;
        
        public PlayerStats(int kills, int deaths, long playtime, int blocksBroken, int blocksPlaced, long distanceWalked) {
            this.kills = kills;
            this.deaths = deaths;
            this.playtime = playtime;
            this.blocksBroken = blocksBroken;
            this.blocksPlaced = blocksPlaced;
            this.distanceWalked = distanceWalked;
        }
        
        // Getters
        public int getKills() { return kills; }
        public int getDeaths() { return deaths; }
        public long getPlaytime() { return playtime; }
        public int getBlocksBroken() { return blocksBroken; }
        public int getBlocksPlaced() { return blocksPlaced; }
        public long getDistanceWalked() { return distanceWalked; }
    }
    
    public static class DeliveryData {
        private final String id;
        private final String itemId;
        private final String[] commands;
        
        public DeliveryData(String id, String itemId, String[] commands) {
            this.id = id;
            this.itemId = itemId;
            this.commands = commands;
        }
        
        public String getId() { return id; }
        public String getItemId() { return itemId; }
        public String[] getCommands() { return commands; }
    }
}
