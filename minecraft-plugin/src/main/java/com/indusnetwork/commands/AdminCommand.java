package com.indusnetwork.commands;

import com.indusnetwork.IndusNetworkPlugin;
import com.indusnetwork.utils.MessageUtils;
import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

public class AdminCommand implements CommandExecutor {
    
    private final IndusNetworkPlugin plugin;
    
    public AdminCommand(IndusNetworkPlugin plugin) {
        this.plugin = plugin;
    }
    
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!sender.hasPermission("indusnetwork.admin")) {
            MessageUtils.sendMessage(sender, plugin.getConfig().getString("messages.no_permission"));
            return true;
        }
        
        if (args.length == 0) {
            showAdminHelp(sender);
            return true;
        }
        
        String subcommand = args[0].toLowerCase();
        
        switch (subcommand) {
            case "reload":
                handleReload(sender);
                break;
                
            case "coins":
                handleCoinsAdmin(sender, args);
                break;
                
            case "rank":
                handleRankAdmin(sender, args);
                break;
                
            case "delivery":
                handleDeliveryAdmin(sender, args);
                break;
                
            default:
                MessageUtils.sendPrefixedMessage(sender, "&cUnknown subcommand: " + subcommand);
                showAdminHelp(sender);
                break;
        }
        
        return true;
    }
    
    private void showAdminHelp(CommandSender sender) {
        MessageUtils.sendMessage(sender, "&c&l=== IndusNetwork Admin Commands ===");
        MessageUtils.sendMessage(sender, "&e/indusadmin reload &7- Reload plugin configuration");
        MessageUtils.sendMessage(sender, "&e/indusadmin coins <player> <add/remove/set> <amount> &7- Manage player coins");
        MessageUtils.sendMessage(sender, "&e/indusadmin rank <player> <rank> &7- Set player rank");
        MessageUtils.sendMessage(sender, "&e/indusadmin delivery <player> &7- Check delivery status");
    }
    
    private void handleReload(CommandSender sender) {
        try {
            plugin.reloadConfig();
            MessageUtils.sendPrefixedMessage(sender, "&aConfiguration reloaded successfully!");
        } catch (Exception e) {
            MessageUtils.sendPrefixedMessage(sender, "&cFailed to reload configuration: " + e.getMessage());
        }
    }
    
    private void handleCoinsAdmin(CommandSender sender, String[] args) {
        if (args.length < 4) {
            MessageUtils.sendMessage(sender, "&cUsage: /indusadmin coins <player> <add/remove/set> <amount>");
            return;
        }
        
        Player target = Bukkit.getPlayer(args[1]);
        if (target == null) {
            MessageUtils.sendMessage(sender, plugin.getConfig().getString("messages.player_not_found"));
            return;
        }
        
        String action = args[2].toLowerCase();
        int amount;
        
        try {
            amount = Integer.parseInt(args[3]);
        } catch (NumberFormatException e) {
            MessageUtils.sendMessage(sender, "&cInvalid amount: " + args[3]);
            return;
        }
        
        switch (action) {
            case "add":
                plugin.getCoinManager().addPlayerCoins(target.getUniqueId(), amount);
                MessageUtils.sendPrefixedMessage(sender, "&aAdded " + amount + " coins to " + target.getName());
                break;
                
            case "remove":
                plugin.getCoinManager().removePlayerCoins(target.getUniqueId(), amount);
                MessageUtils.sendPrefixedMessage(sender, "&aRemoved " + amount + " coins from " + target.getName());
                break;
                
            case "set":
                plugin.getCoinManager().setPlayerCoins(target.getUniqueId(), amount);
                MessageUtils.sendPrefixedMessage(sender, "&aSet " + target.getName() + "'s coins to " + amount);
                break;
                
            default:
                MessageUtils.sendMessage(sender, "&cInvalid action: " + action + ". Use add, remove, or set.");
                break;
        }
    }
    
    private void handleRankAdmin(CommandSender sender, String[] args) {
        if (args.length < 3) {
            MessageUtils.sendMessage(sender, "&cUsage: /indusadmin rank <player> <rank>");
            return;
        }
        
        Player target = Bukkit.getPlayer(args[1]);
        if (target == null) {
            MessageUtils.sendMessage(sender, plugin.getConfig().getString("messages.player_not_found"));
            return;
        }
        
        String rank = args[2].toLowerCase();
        
        if (!plugin.getRankManager().rankExists(rank)) {
            MessageUtils.sendMessage(sender, "&cInvalid rank: " + rank);
            return;
        }
        
        plugin.getRankManager().updatePlayerRank(target, rank).thenAccept(success -> {
            if (success) {
                MessageUtils.sendPrefixedMessage(sender, "&aUpdated " + target.getName() + "'s rank to " + rank);
            } else {
                MessageUtils.sendPrefixedMessage(sender, "&cFailed to update " + target.getName() + "'s rank");
            }
        });
    }
    
    private void handleDeliveryAdmin(CommandSender sender, String[] args) {
        if (args.length < 2) {
            MessageUtils.sendMessage(sender, "&cUsage: /indusadmin delivery <player>");
            return;
        }
        
        Player target = Bukkit.getPlayer(args[1]);
        if (target == null) {
            MessageUtils.sendMessage(sender, plugin.getConfig().getString("messages.player_not_found"));
            return;
        }
        
        MessageUtils.sendPrefixedMessage(sender, "&6Checking deliveries for " + target.getName() + "...");
        plugin.getDeliveryManager().checkPlayerDeliveries(target);
        MessageUtils.sendPrefixedMessage(sender, "&aDelivery check initiated for " + target.getName());
    }
}
