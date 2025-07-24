import { RequestHandler } from "express";
import { ServerStats, RconCommand, RconResponse, ServerAction, ApiResponse } from "../../shared/types";

// Mock server stats - in production this would connect to your Minecraft server
const mockServerStats: ServerStats = {
  onlinePlayers: 47,
  maxPlayers: 100,
  tps: 19.8,
  memoryUsed: 3200,
  memoryMax: 8192,
  uptime: 86400000, // 24 hours in milliseconds
  version: "1.20.4",
  motd: "Welcome to indusnetwork - The Ultimate Gaming Experience!",
  players: [
    {
      username: "DarkKnight_X",
      uuid: "550e8400-e29b-41d4-a716-446655440000",
      rank: "VIP",
      world: "world",
      ping: 45
    },
    {
      username: "BuilderPro",
      uuid: "550e8400-e29b-41d4-a716-446655440001", 
      rank: "MVP",
      world: "creative",
      ping: 32
    }
  ]
};

let serverActions: ServerAction[] = [];

export const getServerStatus: RequestHandler = (req, res) => {
  // Simulate real-time data with small variations
  const stats = {
    ...mockServerStats,
    onlinePlayers: mockServerStats.onlinePlayers + Math.floor(Math.random() * 10 - 5),
    tps: Number((mockServerStats.tps + (Math.random() * 0.4 - 0.2)).toFixed(1)),
    memoryUsed: mockServerStats.memoryUsed + Math.floor(Math.random() * 200 - 100)
  };
  
  const response: ApiResponse<ServerStats> = {
    success: true,
    data: stats
  };
  
  res.json(response);
};

export const executeRconCommand: RequestHandler = (req, res) => {
  const { command, args = [] }: RconCommand = req.body;
  
  // Validate admin permissions (in production, check JWT token and admin role)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized - Admin access required"
    });
  }
  
  // Mock RCON execution - in production this would use actual RCON connection
  const fullCommand = args.length > 0 ? `${command} ${args.join(' ')}` : command;
  
  let mockOutput = "";
  
  switch (command.toLowerCase()) {
    case "list":
      mockOutput = `There are 47/100 players online:\nDarkKnight_X, BuilderPro, CrafterLegend, MineWarrior...`;
      break;
    case "tps":
      mockOutput = `TPS from last 1m, 5m, 15m: 19.8, 19.9, 20.0`;
      break;
    case "memory":
      mockOutput = `Memory usage: 3.2GB / 8.0GB (40%)`;
      break;
    case "save-all":
      mockOutput = `Saved the game`;
      break;
    case "whitelist":
      if (args[0] === "add") {
        mockOutput = `Added ${args[1]} to the whitelist`;
      } else if (args[0] === "remove") {
        mockOutput = `Removed ${args[1]} from the whitelist`;
      } else {
        mockOutput = `Whitelist has 25 entries`;
      }
      break;
    case "ban":
      mockOutput = `Banned player ${args[0]}`;
      break;
    case "pardon":
      mockOutput = `Unbanned player ${args[0]}`;
      break;
    case "kick":
      mockOutput = `Kicked ${args[0]} from the game`;
      break;
    default:
      mockOutput = `Executed command: ${fullCommand}`;
  }
  
  const response: ApiResponse<RconResponse> = {
    success: true,
    data: {
      success: true,
      output: mockOutput,
      timestamp: new Date().toISOString()
    }
  };
  
  res.json(response);
};

export const restartServer: RequestHandler = (req, res) => {
  const action: ServerAction = {
    id: Date.now().toString(),
    type: "restart",
    status: "pending",
    initiatedBy: "admin", // In production, get from JWT token
    createdAt: new Date().toISOString()
  };
  
  serverActions.push(action);
  
  // Simulate server restart process
  setTimeout(() => {
    const actionIndex = serverActions.findIndex(a => a.id === action.id);
    if (actionIndex !== -1) {
      serverActions[actionIndex].status = "running";
      
      setTimeout(() => {
        serverActions[actionIndex].status = "completed";
        serverActions[actionIndex].completedAt = new Date().toISOString();
        serverActions[actionIndex].output = "Server restarted successfully";
      }, 30000); // 30 seconds
    }
  }, 1000);
  
  const response: ApiResponse<ServerAction> = {
    success: true,
    data: action,
    message: "Server restart initiated"
  };
  
  res.json(response);
};

export const stopServer: RequestHandler = (req, res) => {
  const action: ServerAction = {
    id: Date.now().toString(),
    type: "stop",
    status: "pending",
    initiatedBy: "admin",
    createdAt: new Date().toISOString()
  };
  
  serverActions.push(action);
  
  setTimeout(() => {
    const actionIndex = serverActions.findIndex(a => a.id === action.id);
    if (actionIndex !== -1) {
      serverActions[actionIndex].status = "completed";
      serverActions[actionIndex].completedAt = new Date().toISOString();
      serverActions[actionIndex].output = "Server stopped successfully";
    }
  }, 5000);
  
  const response: ApiResponse<ServerAction> = {
    success: true,
    data: action,
    message: "Server stop initiated"
  };
  
  res.json(response);
};

export const getServerActions: RequestHandler = (req, res) => {
  const response: ApiResponse<ServerAction[]> = {
    success: true,
    data: serverActions.slice(-20) // Return last 20 actions
  };
  
  res.json(response);
};

export const createBackup: RequestHandler = (req, res) => {
  const action: ServerAction = {
    id: Date.now().toString(),
    type: "backup",
    status: "pending",
    initiatedBy: "admin",
    createdAt: new Date().toISOString()
  };
  
  serverActions.push(action);
  
  setTimeout(() => {
    const actionIndex = serverActions.findIndex(a => a.id === action.id);
    if (actionIndex !== -1) {
      serverActions[actionIndex].status = "running";
      
      setTimeout(() => {
        serverActions[actionIndex].status = "completed";
        serverActions[actionIndex].completedAt = new Date().toISOString();
        serverActions[actionIndex].output = "Backup created: backup_2024_01_15_14_30.zip (2.3GB)";
      }, 60000); // 1 minute
    }
  }, 2000);
  
  const response: ApiResponse<ServerAction> = {
    success: true,
    data: action,
    message: "Backup initiated"
  };
  
  res.json(response);
};
