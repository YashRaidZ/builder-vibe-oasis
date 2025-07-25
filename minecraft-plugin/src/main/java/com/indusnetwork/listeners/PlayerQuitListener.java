package com.indusnetwork.listeners;

import com.indusnetwork.IndusNetworkPlugin;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerQuitEvent;

public class PlayerQuitListener implements Listener {
    
    private final IndusNetworkPlugin plugin;
    
    public PlayerQuitListener(IndusNetworkPlugin plugin) {
        this.plugin = plugin;
    }
    
    @EventHandler(priority = EventPriority.MONITOR)
    public void onPlayerQuit(PlayerQuitEvent event) {
        Player player = event.getPlayer();
        
        // Update player offline status on website
        plugin.getServer().getScheduler().runTaskAsynchronously(plugin, () -> {
            plugin.getWebAPIManager().updatePlayerStatus(player.getUniqueId(), false);
        });
        
        // Sync final stats before player leaves
        plugin.getStatsManager().syncPlayerStats(player);
        
        // Clean up player data from memory
        plugin.getStatsManager().removePlayer(player.getUniqueId());
    }
}
