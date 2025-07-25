package com.indusnetwork.managers;

import com.indusnetwork.IndusNetworkPlugin;
import com.indusnetwork.utils.MessageUtils;
import org.bukkit.entity.Player;

import java.util.concurrent.CompletableFuture;

public class DeliveryManager {
    
    private final IndusNetworkPlugin plugin;
    
    public DeliveryManager(IndusNetworkPlugin plugin) {
        this.plugin = plugin;
    }
    
    /**
     * Check for pending deliveries for a player
     */
    public CompletableFuture<Void> checkPlayerDeliveries(Player player) {
        return CompletableFuture.runAsync(() -> {
            try {
                plugin.getWebAPIManager().checkPendingDeliveries(player.getUniqueId()).thenAccept(deliveries -> {
                    if (deliveries.length > 0) {
                        MessageUtils.sendPrefixedMessage(player, "&aYou have " + deliveries.length + " pending deliveries!");
                        
                        // Process each delivery
                        for (var delivery : deliveries) {
                            processDelivery(player, delivery);
                        }
                    }
                });
            } catch (Exception e) {
                plugin.getLogger().warning("Failed to check deliveries for " + player.getName() + ": " + e.getMessage());
            }
        });
    }
    
    /**
     * Process a single delivery
     */
    private void processDelivery(Player player, com.indusnetwork.api.WebAPIManager.DeliveryData delivery) {
        try {
            // Execute delivery commands
            for (String command : delivery.getCommands()) {
                String processedCommand = command.replace("{player}", player.getName())
                                                .replace("{username}", player.getName());
                
                // Execute command on main thread
                plugin.getServer().getScheduler().runTask(plugin, () -> {
                    plugin.getServer().dispatchCommand(plugin.getServer().getConsoleSender(), processedCommand);
                });
            }
            
            // Mark delivery as completed
            plugin.getWebAPIManager().markDeliveryCompleted(delivery.getId()).thenAccept(success -> {
                if (success) {
                    MessageUtils.sendPrefixedMessage(player, "&aDelivery completed: " + delivery.getItemId());
                } else {
                    plugin.getLogger().warning("Failed to mark delivery as completed: " + delivery.getId());
                }
            });
            
        } catch (Exception e) {
            plugin.getLogger().severe("Failed to process delivery " + delivery.getId() + ": " + e.getMessage());
        }
    }
    
    /**
     * Check for pending deliveries for all online players
     */
    public void checkPendingDeliveries() {
        for (Player player : plugin.getServer().getOnlinePlayers()) {
            checkPlayerDeliveries(player);
        }
    }
}
