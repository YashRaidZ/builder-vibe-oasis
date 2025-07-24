import { RequestHandler } from "express";
import { Player, ApiResponse, PaginatedResponse } from "../../shared/types";

// Mock data - in production this would connect to your database
const mockPlayers: Player[] = [
  {
    id: "1",
    uuid: "550e8400-e29b-41d4-a716-446655440000",
    username: "DarkKnight_X",
    rank: "VIP",
    balance: 15000,
    level: 45,
    experience: 182500,
    playtime: 256800, // seconds
    lastSeen: new Date().toISOString(),
    joinDate: "2024-01-15T10:30:00Z",
    kills: 1250,
    deaths: 380,
    blocksPlaced: 45000,
    blocksBroken: 32000,
    achievements: [
      {
        id: "1",
        name: "First Blood",
        description: "Get your first kill",
        icon: "sword",
        unlockedAt: "2024-01-15T11:45:00Z",
        rarity: "common"
      },
      {
        id: "2",
        name: "Master Builder",
        description: "Place 10,000 blocks",
        icon: "building-blocks",
        unlockedAt: "2024-02-01T14:20:00Z",
        rarity: "rare"
      }
    ],
    isOnline: true,
    location: {
      world: "world",
      x: 125.5,
      y: 64.0,
      z: -89.2
    }
  },
  {
    id: "2",
    uuid: "550e8400-e29b-41d4-a716-446655440001",
    username: "BuilderPro",
    rank: "MVP",
    balance: 8500,
    level: 32,
    experience: 98000,
    playtime: 156300,
    lastSeen: "2024-01-10T08:15:00Z",
    joinDate: "2024-01-08T16:45:00Z",
    kills: 450,
    deaths: 120,
    blocksPlaced: 78000,
    blocksBroken: 12000,
    achievements: [],
    isOnline: false
  }
];

export const getPlayers: RequestHandler = (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;
  
  let filteredPlayers = mockPlayers;
  
  if (search) {
    filteredPlayers = mockPlayers.filter(player => 
      player.username.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPlayers = filteredPlayers.slice(startIndex, endIndex);
  
  const response: PaginatedResponse<Player> = {
    success: true,
    data: paginatedPlayers,
    pagination: {
      page,
      limit,
      total: filteredPlayers.length,
      pages: Math.ceil(filteredPlayers.length / limit)
    }
  };
  
  res.json(response);
};

export const getPlayer: RequestHandler = (req, res) => {
  const { id } = req.params;
  const player = mockPlayers.find(p => p.id === id || p.username.toLowerCase() === id.toLowerCase());
  
  if (!player) {
    const response: ApiResponse = {
      success: false,
      error: "Player not found"
    };
    return res.status(404).json(response);
  }
  
  const response: ApiResponse<Player> = {
    success: true,
    data: player
  };
  
  res.json(response);
};

export const updatePlayerRank: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { rank } = req.body;
  
  const playerIndex = mockPlayers.findIndex(p => p.id === id);
  
  if (playerIndex === -1) {
    const response: ApiResponse = {
      success: false,
      error: "Player not found"
    };
    return res.status(404).json(response);
  }
  
  mockPlayers[playerIndex].rank = rank;
  
  // Here you would also execute the RCON command to update in-game
  // await executeRconCommand(`lp user ${mockPlayers[playerIndex].username} parent set ${rank}`);
  
  const response: ApiResponse<Player> = {
    success: true,
    data: mockPlayers[playerIndex],
    message: `Player rank updated to ${rank}`
  };
  
  res.json(response);
};

export const getOnlinePlayers: RequestHandler = (req, res) => {
  const onlinePlayers = mockPlayers.filter(p => p.isOnline);
  
  const response: ApiResponse<Player[]> = {
    success: true,
    data: onlinePlayers
  };
  
  res.json(response);
};
