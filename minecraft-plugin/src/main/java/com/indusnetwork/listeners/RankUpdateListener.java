package com.indusnetwork.listeners;

import com.indusnetwork.IndusNetworkPlugin;
import org.bukkit.event.Listener;

public class RankUpdateListener implements Listener {
    
    private final IndusNetworkPlugin plugin;
    
    public RankUpdateListener(IndusNetworkPlugin plugin) {
        this.plugin = plugin;
    }
    
    // This listener can be extended for rank-related events
    // For now, rank updates are handled through the manager
}
