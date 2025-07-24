import express from "express";
import cors from "cors";
import { config } from "../shared/config";
import { handleDemo } from "./routes/demo";
import {
  requestVerification,
  verifyCode,
  getAuthStatus,
  logout
} from "./routes/auth";
import {
  getPlayers,
  getPlayer,
  updatePlayerRank,
  getOnlinePlayers
} from "./routes/players";
import {
  getServerStatus,
  executeRconCommand,
  restartServer,
  stopServer,
  getServerActions,
  createBackup
} from "./routes/server";
import {
  getStoreItems,
  getStoreItem,
  createPurchase,
  getPurchases,
  retryDelivery,
  getDeliveryStatus,
  triggerManualDelivery
} from "./routes/store";
import {
  getLeaderboards,
  getLeaderboard,
  getPlayerRanking,
  updateLeaderboards
} from "./routes/leaderboards";
import {
  getPlugins,
  getPlugin,
  togglePlugin,
  reloadPlugin,
  getPluginCommands,
  getPluginPermissions
} from "./routes/plugins";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: config.dev.enableCors ? true : false,
    credentials: true
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({
      message: "Hello from indusnetwork API v2!",
      timestamp: new Date().toISOString(),
      environment: config.server.nodeEnv,
      version: "2.0.0"
    });
  });

  // Environment info endpoint (non-sensitive data only)
  app.get("/api/info", (_req, res) => {
    res.json({
      server: {
        environment: config.server.nodeEnv,
        features: config.features,
      },
      minecraft: {
        serverHost: config.minecraft.server.host,
        serverPort: config.minecraft.server.port,
      },
      version: "2.0.0",
      timestamp: new Date().toISOString()
    });
  });

  app.get("/api/demo", handleDemo);

  // Authentication API routes
  app.post("/api/auth/request-verification", requestVerification);
  app.post("/api/auth/verify-code", verifyCode);
  app.get("/api/auth/status", getAuthStatus);
  app.post("/api/auth/logout", logout);

  // Player API routes
  app.get("/api/players", getPlayers);
  app.get("/api/players/online", getOnlinePlayers);
  app.get("/api/players/:id", getPlayer);
  app.patch("/api/players/:id/rank", updatePlayerRank);

  // Server API routes
  app.get("/api/server/status", getServerStatus);
  app.post("/api/server/rcon", executeRconCommand);
  app.post("/api/server/restart", restartServer);
  app.post("/api/server/stop", stopServer);
  app.post("/api/server/backup", createBackup);
  app.get("/api/server/actions", getServerActions);

  // Store API routes
  app.get("/api/store/items", getStoreItems);
  app.get("/api/store/items/:id", getStoreItem);
  app.post("/api/store/purchase", createPurchase);
  app.get("/api/store/purchases", getPurchases);
  app.post("/api/store/purchases/:id/retry", retryDelivery);
  app.get("/api/store/delivery/status", getDeliveryStatus);
  app.post("/api/store/delivery/manual/:purchaseId", triggerManualDelivery);

  // Leaderboard API routes
  app.get("/api/leaderboards", getLeaderboards);
  app.get("/api/leaderboards/:type", getLeaderboard);
  app.get("/api/leaderboards/:type/player/:playerId", getPlayerRanking);
  app.post("/api/leaderboards/:type", updateLeaderboards);

  // Plugin API routes
  app.get("/api/plugins", getPlugins);
  app.get("/api/plugins/:id", getPlugin);
  app.patch("/api/plugins/:id/toggle", togglePlugin);
  app.post("/api/plugins/:id/reload", reloadPlugin);
  app.get("/api/plugins/:id/commands", getPluginCommands);
  app.get("/api/plugins/:id/permissions", getPluginPermissions);

  return app;
}
