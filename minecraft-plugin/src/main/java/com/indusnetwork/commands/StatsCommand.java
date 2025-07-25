package com.indusnetwork.commands;

import com.indusnetwork.IndusNetworkPlugin;
import com.indusnetwork.managers.StatsManager;
import com.indusnetwork.utils.MessageUtils;
import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

public class StatsCommand implements CommandExecutor {
    
    private final IndusNetworkPlugin plugin;
    
    public StatsCommand(IndusNetworkPlugin plugin) {
        this.plugin = plugin;
    }
    
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (args.length == 0) {
            // Show own stats
            if (!(sender instanceof Player)) {
                MessageUtils.sendMessage(sender, plugin.getConfig().getString("messages.player_only"));
                return true;
            }
            
            Player player = (Player) sender;
            showPlayerStats(player, player);
            
        } else if (args.length == 1) {
            // Show another player's stats
            String targetName = args[0];
            Player targetPlayer = Bukkit.getPlayer(targetName);
            
            if (targetPlayer == null) {
                MessageUtils.sendMessage(sender, plugin.getConfig().getString("messages.player_not_found"));
                return true;
            }
            
            if (sender instanceof Player) {
                showPlayerStats((Player) sender, targetPlayer);
            } else {
                showPlayerStats(null, targetPlayer);
            }
            
        } else {
            MessageUtils.sendMessage(sender, "&cUsage: /stats [player]");
        }
        
        return true;
    }
    
    private void showPlayerStats(Player viewer, Player target) {
        StatsManager.PlayerStatsData stats = plugin.getStatsManager().getPlayerStats(target.getUniqueId());
        
        if (stats == null) {
            MessageUtils.sendMessage(viewer != null ? viewer : target, "&cStats not available for this player.");
            return;
        }
        
        String targetName = viewer != null && !viewer.equals(target) ? target.getName() + "'s" : "Your";
        
        MessageUtils.sendMessage(viewer != null ? viewer : target, 
            plugin.getConfig().getString("messages.stats_header", "{prefix}&6=== Your Stats ===")
                .replace("Your", targetName));
        
        MessageUtils.sendMessage(viewer != null ? viewer : target,
            plugin.getConfig().getString("messages.kills", "&6Kills: &e{kills}")
                .replace("{kills}", String.valueOf(stats.kills)));
        
        MessageUtils.sendMessage(viewer != null ? viewer : target,
            plugin.getConfig().getString("messages.deaths", "&6Deaths: &e{deaths}")
                .replace("{deaths}", String.valueOf(stats.deaths)));
        
        MessageUtils.sendMessage(viewer != null ? viewer : target,
            plugin.getConfig().getString("messages.kdr", "&6K/D Ratio: &e{kdr}")
                .replace("{kdr}", String.format("%.2f", stats.getKDRatio())));
        
        MessageUtils.sendMessage(viewer != null ? viewer : target,
            plugin.getConfig().getString("messages.playtime", "&6Playtime: &e{playtime}")
                .replace("{playtime}", stats.getFormattedPlaytime()));
    }
}
