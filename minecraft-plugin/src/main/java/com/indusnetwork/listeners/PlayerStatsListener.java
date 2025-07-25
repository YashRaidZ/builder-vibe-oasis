package com.indusnetwork.listeners;

import com.indusnetwork.IndusNetworkPlugin;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.PlayerDeathEvent;
import org.bukkit.event.player.PlayerStatisticIncrementEvent;

public class PlayerStatsListener implements Listener {
    
    private final IndusNetworkPlugin plugin;
    
    public PlayerStatsListener(IndusNetworkPlugin plugin) {
        this.plugin = plugin;
    }
    
    @EventHandler
    public void onPlayerDeath(PlayerDeathEvent event) {
        // Update stats when player dies
        plugin.getServer().getScheduler().runTaskLaterAsynchronously(plugin, () -> {
            plugin.getStatsManager().syncPlayerStats(event.getEntity());
        }, 20L); // 1 second delay
    }
    
    @EventHandler
    public void onStatisticIncrement(PlayerStatisticIncrementEvent event) {
        // Sync stats periodically for important statistics
        switch (event.getStatistic()) {
            case PLAYER_KILLS:
            case DEATHS:
            case BLOCKS_MINED:
            case BLOCKS_PLACED:
                // Sync important stats immediately
                plugin.getServer().getScheduler().runTaskLaterAsynchronously(plugin, () -> {
                    plugin.getStatsManager().syncPlayerStats(event.getPlayer());
                }, 40L); // 2 second delay
                break;
            default:
                // Other stats will be synced periodically
                break;
        }
    }
}
