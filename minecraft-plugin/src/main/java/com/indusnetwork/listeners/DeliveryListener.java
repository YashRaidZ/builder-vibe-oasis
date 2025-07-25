package com.indusnetwork.listeners;

import com.indusnetwork.IndusNetworkPlugin;
import org.bukkit.event.Listener;

public class DeliveryListener implements Listener {
    
    private final IndusNetworkPlugin plugin;
    
    public DeliveryListener(IndusNetworkPlugin plugin) {
        this.plugin = plugin;
    }
    
    // This listener can be extended for delivery-related events
    // For now, delivery checking is handled in the manager
}
