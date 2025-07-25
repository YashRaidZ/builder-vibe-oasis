package com.indusnetwork.commands;

import com.indusnetwork.IndusNetworkPlugin;
import com.indusnetwork.utils.MessageUtils;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;

public class IndusCommand implements CommandExecutor {
    
    private final IndusNetworkPlugin plugin;
    
    public IndusCommand(IndusNetworkPlugin plugin) {
        this.plugin = plugin;
    }
    
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (args.length == 0) {
            showHelp(sender);
            return true;
        }
        
        String subcommand = args[0].toLowerCase();
        
        switch (subcommand) {
            case "help":
                showHelp(sender);
                break;
                
            case "info":
                showInfo(sender);
                break;
                
            case "website":
                showWebsite(sender);
                break;
                
            default:
                MessageUtils.sendPrefixedMessage(sender, "&cUnknown subcommand: " + subcommand);
                showHelp(sender);
                break;
        }
        
        return true;
    }
    
    private void showHelp(CommandSender sender) {
        MessageUtils.sendMessage(sender, "&6&l=== IndusNetwork Commands ===");
        MessageUtils.sendMessage(sender, "&e/indus help &7- Show this help menu");
        MessageUtils.sendMessage(sender, "&e/indus info &7- Show plugin information");
        MessageUtils.sendMessage(sender, "&e/indus website &7- Get website link");
        MessageUtils.sendMessage(sender, "&e/verify <code> &7- Verify your account");
        MessageUtils.sendMessage(sender, "&e/coins [player] &7- Check coin balance");
        MessageUtils.sendMessage(sender, "&e/rank [player] &7- Check rank information");
        MessageUtils.sendMessage(sender, "&e/stats [player] &7- View player statistics");
        MessageUtils.sendMessage(sender, "&e/shop &7- Open the server shop");
    }
    
    private void showInfo(CommandSender sender) {
        MessageUtils.sendMessage(sender, "&6&l=== IndusNetwork Plugin ===");
        MessageUtils.sendMessage(sender, "&eVersion: &f" + plugin.getDescription().getVersion());
        MessageUtils.sendMessage(sender, "&eAuthor: &f" + String.join(", ", plugin.getDescription().getAuthors()));
        MessageUtils.sendMessage(sender, "&eWebsite: &b" + plugin.getConfig().getString("website.url"));
        MessageUtils.sendMessage(sender, "&eDescription: &f" + plugin.getDescription().getDescription());
    }
    
    private void showWebsite(CommandSender sender) {
        String websiteUrl = plugin.getConfig().getString("website.url", "https://indusnetwork.highms.pro");
        MessageUtils.sendPrefixedMessage(sender, "&6Visit our website:");
        MessageUtils.sendMessage(sender, "&b&l" + websiteUrl);
    }
}
