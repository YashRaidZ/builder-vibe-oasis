import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
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
  retryDelivery
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
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

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
