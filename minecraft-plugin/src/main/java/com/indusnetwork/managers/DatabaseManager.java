package com.indusnetwork.managers;

import com.indusnetwork.IndusNetworkPlugin;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import java.sql.Connection;
import java.sql.SQLException;

public class DatabaseManager {
    
    private final IndusNetworkPlugin plugin;
    private HikariDataSource dataSource;
    
    public DatabaseManager(IndusNetworkPlugin plugin) {
        this.plugin = plugin;
        initializeDatabase();
    }
    
    private void initializeDatabase() {
        try {
            String databaseType = plugin.getConfig().getString("database.type", "sqlite");
            
            if (databaseType.equalsIgnoreCase("mysql")) {
                initializeMySQL();
            } else {
                initializeSQLite();
            }
            
            plugin.getLogger().info("Database connection established successfully!");
            
        } catch (Exception e) {
            plugin.getLogger().severe("Failed to initialize database: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void initializeMySQL() {
        HikariConfig config = new HikariConfig();
        
        String host = plugin.getConfig().getString("database.host", "localhost");
        int port = plugin.getConfig().getInt("database.port", 3306);
        String database = plugin.getConfig().getString("database.database", "indusnetwork");
        String username = plugin.getConfig().getString("database.username", "username");
        String password = plugin.getConfig().getString("database.password", "password");
        
        config.setJdbcUrl("jdbc:mysql://" + host + ":" + port + "/" + database);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        
        // Connection pool settings
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(5);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);
        
        this.dataSource = new HikariDataSource(config);
    }
    
    private void initializeSQLite() {
        HikariConfig config = new HikariConfig();
        
        config.setJdbcUrl("jdbc:sqlite:plugins/IndusNetworkPlugin/database.db");
        config.setDriverClassName("org.sqlite.JDBC");
        config.setMaximumPoolSize(1); // SQLite only supports single connection
        
        this.dataSource = new HikariDataSource(config);
    }
    
    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
    
    public void close() {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
        }
    }
}
