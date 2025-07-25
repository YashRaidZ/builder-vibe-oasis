package com.indusnetwork.utils;

import com.indusnetwork.IndusNetworkPlugin;
import org.bukkit.ChatColor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

public class MessageUtils {
    
    private static IndusNetworkPlugin plugin;
    
    public static void setPlugin(IndusNetworkPlugin pluginInstance) {
        plugin = pluginInstance;
    }
    
    /**
     * Send a colored message to a command sender
     */
    public static void sendMessage(CommandSender sender, String message) {
        if (sender == null || message == null) return;
        
        String formattedMessage = formatMessage(message);
        sender.sendMessage(formattedMessage);
    }
    
    /**
     * Send a message with prefix to a command sender
     */
    public static void sendPrefixedMessage(CommandSender sender, String message) {
        if (sender == null || message == null) return;
        
        String prefix = plugin != null ? plugin.getConfig().getString("settings.prefix", "&6[&bIndusNetwork&6] ") : "&6[&bIndusNetwork&6] ";
        String fullMessage = prefix + message;
        sendMessage(sender, fullMessage);
    }
    
    /**
     * Format a message with color codes and placeholders
     */
    public static String formatMessage(String message) {
        if (message == null) return "";
        
        // Replace common placeholders
        if (plugin != null) {
            String prefix = plugin.getConfig().getString("settings.prefix", "&6[&bIndusNetwork&6] ");
            message = message.replace("{prefix}", prefix);
        }
        
        // Convert color codes
        return ChatColor.translateAlternateColorCodes('&', message);
    }
    
    /**
     * Send a title to a player
     */
    public static void sendTitle(Player player, String title, String subtitle, int fadeIn, int stay, int fadeOut) {
        if (player == null) return;
        
        String formattedTitle = title != null ? formatMessage(title) : "";
        String formattedSubtitle = subtitle != null ? formatMessage(subtitle) : "";
        
        player.sendTitle(formattedTitle, formattedSubtitle, fadeIn, stay, fadeOut);
    }
    
    /**
     * Send an action bar message to a player
     */
    public static void sendActionBar(Player player, String message) {
        if (player == null || message == null) return;
        
        String formattedMessage = formatMessage(message);
        player.spigot().sendMessage(net.md_5.bungee.api.ChatMessageType.ACTION_BAR, 
            new net.md_5.bungee.api.chat.TextComponent(formattedMessage));
    }
    
    /**
     * Broadcast a message to all online players
     */
    public static void broadcast(String message) {
        if (message == null || plugin == null) return;
        
        String formattedMessage = formatMessage(message);
        plugin.getServer().broadcastMessage(formattedMessage);
    }
    
    /**
     * Broadcast a message to players with a specific permission
     */
    public static void broadcastToPermission(String message, String permission) {
        if (message == null || permission == null || plugin == null) return;
        
        String formattedMessage = formatMessage(message);
        for (Player player : plugin.getServer().getOnlinePlayers()) {
            if (player.hasPermission(permission)) {
                player.sendMessage(formattedMessage);
            }
        }
    }
    
    /**
     * Send a clickable message to a player
     */
    public static void sendClickableMessage(Player player, String message, String command, String hoverText) {
        if (player == null || message == null) return;
        
        net.md_5.bungee.api.chat.TextComponent textComponent = new net.md_5.bungee.api.chat.TextComponent(formatMessage(message));
        
        if (command != null) {
            textComponent.setClickEvent(new net.md_5.bungee.api.chat.ClickEvent(
                net.md_5.bungee.api.chat.ClickEvent.Action.RUN_COMMAND, command));
        }
        
        if (hoverText != null) {
            textComponent.setHoverEvent(new net.md_5.bungee.api.chat.HoverEvent(
                net.md_5.bungee.api.chat.HoverEvent.Action.SHOW_TEXT, 
                new net.md_5.bungee.api.chat.TextComponent[]{new net.md_5.bungee.api.chat.TextComponent(formatMessage(hoverText))}));
        }
        
        player.spigot().sendMessage(textComponent);
    }
    
    /**
     * Log a message to console with plugin prefix
     */
    public static void log(String message) {
        if (plugin != null) {
            plugin.getLogger().info(message);
        }
    }
    
    /**
     * Log a warning to console with plugin prefix
     */
    public static void logWarning(String message) {
        if (plugin != null) {
            plugin.getLogger().warning(message);
        }
    }
    
    /**
     * Log an error to console with plugin prefix
     */
    public static void logError(String message) {
        if (plugin != null) {
            plugin.getLogger().severe(message);
        }
    }
    
    /**
     * Format time in milliseconds to a readable string
     */
    public static String formatTime(long milliseconds) {
        long seconds = milliseconds / 1000;
        long minutes = seconds / 60;
        long hours = minutes / 60;
        long days = hours / 24;
        
        if (days > 0) {
            return days + "d " + (hours % 24) + "h " + (minutes % 60) + "m";
        } else if (hours > 0) {
            return hours + "h " + (minutes % 60) + "m " + (seconds % 60) + "s";
        } else if (minutes > 0) {
            return minutes + "m " + (seconds % 60) + "s";
        } else {
            return seconds + "s";
        }
    }
    
    /**
     * Format a number with commas
     */
    public static String formatNumber(long number) {
        return String.format("%,d", number);
    }
    
    /**
     * Create a progress bar
     */
    public static String createProgressBar(double percentage, int length, char fillChar, char emptyChar, String fillColor, String emptyColor) {
        int filled = (int) (percentage * length / 100.0);
        int empty = length - filled;
        
        StringBuilder bar = new StringBuilder();
        bar.append(ChatColor.translateAlternateColorCodes('&', fillColor));
        
        for (int i = 0; i < filled; i++) {
            bar.append(fillChar);
        }
        
        bar.append(ChatColor.translateAlternateColorCodes('&', emptyColor));
        
        for (int i = 0; i < empty; i++) {
            bar.append(emptyChar);
        }
        
        return bar.toString();
    }
}
