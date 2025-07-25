package com.indusnetwork.commands;

import com.indusnetwork.IndusNetworkPlugin;
import com.indusnetwork.utils.MessageUtils;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

public class ShopCommand implements CommandExecutor {
    
    private final IndusNetworkPlugin plugin;
    
    public ShopCommand(IndusNetworkPlugin plugin) {
        this.plugin = plugin;
    }
    
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player)) {
            MessageUtils.sendMessage(sender, plugin.getConfig().getString("messages.player_only"));
            return true;
        }
        
        Player player = (Player) sender;
        
        // For now, just redirect to website
        String websiteUrl = plugin.getConfig().getString("website.url", "https://indusnetwork.highms.pro");
        
        MessageUtils.sendPrefixedMessage(player, "&6Visit our store to purchase items:");
        MessageUtils.sendClickableMessage(player, 
            "&b&l" + websiteUrl + "/store", 
            null, 
            "&aClick to open store in browser");
        
        MessageUtils.sendPrefixedMessage(player, "&aItems purchased will be delivered automatically!");
        
        return true;
    }
}
