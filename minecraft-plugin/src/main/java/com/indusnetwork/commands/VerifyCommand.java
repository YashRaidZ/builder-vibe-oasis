package com.indusnetwork.commands;

import com.indusnetwork.IndusNetworkPlugin;
import com.indusnetwork.utils.MessageUtils;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

public class VerifyCommand implements CommandExecutor {
    
    private final IndusNetworkPlugin plugin;
    
    public VerifyCommand(IndusNetworkPlugin plugin) {
        this.plugin = plugin;
    }
    
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player)) {
            MessageUtils.sendMessage(sender, plugin.getConfig().getString("messages.player_only"));
            return true;
        }
        
        Player player = (Player) sender;
        
        if (args.length != 1) {
            MessageUtils.sendMessage(player, "&cUsage: /verify <verification_code>");
            MessageUtils.sendMessage(player, "&6Get your verification code from the website!");
            return true;
        }
        
        String verificationCode = args[0];
        
        // Check if player is already verified
        plugin.getWebAPIManager().getPlayerData(player.getUniqueId()).thenAccept(playerData -> {
            if (playerData != null && playerData.isVerified()) {
                MessageUtils.sendMessage(player, plugin.getConfig().getString("messages.already_verified"));
                return;
            }
            
            // Attempt verification
            MessageUtils.sendMessage(player, "&6Verifying your account...");
            
            plugin.getWebAPIManager().verifyPlayer(player.getUniqueId(), verificationCode).thenAccept(success -> {
                if (success) {
                    MessageUtils.sendMessage(player, plugin.getConfig().getString("messages.verify_success"));
                    
                    // Sync player data after verification
                    plugin.getWebAPIManager().getPlayerData(player.getUniqueId()).thenAccept(newPlayerData -> {
                        if (newPlayerData != null) {
                            // Update rank if needed
                            plugin.getRankManager().updatePlayerRank(player, newPlayerData.getRank());
                            
                            // Update coins
                            plugin.getCoinManager().setPlayerCoins(player.getUniqueId(), newPlayerData.getCoins());
                            
                            MessageUtils.sendMessage(player, "&aAccount data synchronized!");
                        }
                    });
                    
                } else {
                    MessageUtils.sendMessage(player, plugin.getConfig().getString("messages.verify_failed"));
                }
            }).exceptionally(throwable -> {
                MessageUtils.sendMessage(player, "&cVerification failed due to a network error. Please try again later.");
                plugin.getLogger().severe("Verification error for " + player.getName() + ": " + throwable.getMessage());
                return null;
            });
        });
        
        return true;
    }
}
