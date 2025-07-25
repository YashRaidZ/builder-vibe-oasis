package com.indusnetwork.commands;

import com.indusnetwork.IndusNetworkPlugin;
import com.indusnetwork.utils.MessageUtils;
import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

public class RankCommand implements CommandExecutor {
    
    private final IndusNetworkPlugin plugin;
    
    public RankCommand(IndusNetworkPlugin plugin) {
        this.plugin = plugin;
    }
    
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (args.length == 0) {
            // Show own rank
            if (!(sender instanceof Player)) {
                MessageUtils.sendMessage(sender, plugin.getConfig().getString("messages.player_only"));
                return true;
            }
            
            Player player = (Player) sender;
            showPlayerRank(player, player);
            
        } else if (args.length == 1) {
            // Show another player's rank
            String targetName = args[0];
            Player targetPlayer = Bukkit.getPlayer(targetName);
            
            if (targetPlayer == null) {
                MessageUtils.sendMessage(sender, plugin.getConfig().getString("messages.player_not_found"));
                return true;
            }
            
            if (sender instanceof Player) {
                showPlayerRank((Player) sender, targetPlayer);
            } else {
                showPlayerRank(null, targetPlayer);
            }
            
        } else {
            MessageUtils.sendMessage(sender, "&cUsage: /rank [player]");
        }
        
        return true;
    }
    
    private void showPlayerRank(Player viewer, Player target) {
        String rank = plugin.getRankManager().getPlayerRank(target);
        String displayName = plugin.getRankManager().getRankDisplayName(rank);
        
        String message = plugin.getConfig().getString("messages.rank_info", "{prefix}&6Your current rank: {rank}")
            .replace("{rank}", displayName);
            
        if (viewer != null && !viewer.equals(target)) {
            message = message.replace("Your", target.getName() + "'s");
        }
        
        MessageUtils.sendMessage(viewer != null ? viewer : target, message);
    }
}
