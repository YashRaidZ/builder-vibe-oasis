package com.indusnetwork.commands;

import com.indusnetwork.IndusNetworkPlugin;
import com.indusnetwork.utils.MessageUtils;
import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

public class CoinsCommand implements CommandExecutor {
    
    private final IndusNetworkPlugin plugin;
    
    public CoinsCommand(IndusNetworkPlugin plugin) {
        this.plugin = plugin;
    }
    
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (args.length == 0) {
            // Show own coins
            if (!(sender instanceof Player)) {
                MessageUtils.sendMessage(sender, plugin.getConfig().getString("messages.player_only"));
                return true;
            }
            
            Player player = (Player) sender;
            showPlayerCoins(player, player);
            
        } else if (args.length == 1) {
            // Show another player's coins
            String targetName = args[0];
            Player targetPlayer = Bukkit.getPlayer(targetName);
            
            if (targetPlayer == null) {
                MessageUtils.sendMessage(sender, plugin.getConfig().getString("messages.player_not_found"));
                return true;
            }
            
            if (sender instanceof Player) {
                showPlayerCoins((Player) sender, targetPlayer);
            } else {
                showPlayerCoins(null, targetPlayer);
            }
            
        } else {
            MessageUtils.sendMessage(sender, "&cUsage: /coins [player]");
        }
        
        return true;
    }
    
    private void showPlayerCoins(Player viewer, Player target) {
        int coins = plugin.getCoinManager().getPlayerCoins(target.getUniqueId());
        
        String message = plugin.getConfig().getString("messages.coins_balance", "{prefix}&6Your coins: &e{coins}")
            .replace("{coins}", String.valueOf(coins));
            
        if (viewer != null && !viewer.equals(target)) {
            message = message.replace("Your", target.getName() + "'s");
        }
        
        MessageUtils.sendMessage(viewer != null ? viewer : target, message);
    }
}
