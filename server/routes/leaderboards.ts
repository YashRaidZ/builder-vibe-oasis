import { RequestHandler } from "express";
import { Leaderboard, LeaderboardEntry, ApiResponse } from "../../shared/types";

// Mock leaderboard data
const mockLeaderboards: Record<string, Leaderboard> = {
  kills: {
    type: "kills",
    title: "Top Killers",
    lastUpdated: new Date().toISOString(),
    entries: [
      {
        rank: 1,
        player: { username: "WarriorX", uuid: "uuid1", rank: "LEGEND" },
        value: 2847,
        change: 0
      },
      {
        rank: 2,
        player: { username: "DarkKnight_X", uuid: "uuid2", rank: "VIP" },
        value: 2156,
        change: 1
      },
      {
        rank: 3,
        player: { username: "ShadowSlayer", uuid: "uuid3", rank: "MVP" },
        value: 1923,
        change: -1
      },
      {
        rank: 4,
        player: { username: "CombatPro", uuid: "uuid4", rank: "VIP" },
        value: 1847,
        change: 2
      },
      {
        rank: 5,
        player: { username: "BladeRunner", uuid: "uuid5", rank: "default" },
        value: 1632,
        change: 0
      }
    ]
  },
  deaths: {
    type: "deaths",
    title: "Most Deaths",
    lastUpdated: new Date().toISOString(),
    entries: [
      {
        rank: 1,
        player: { username: "Noob_Player", uuid: "uuid6", rank: "default" },
        value: 1234,
        change: 0
      },
      {
        rank: 2,
        player: { username: "RecklessWarrior", uuid: "uuid7", rank: "VIP" },
        value: 987,
        change: 1
      },
      {
        rank: 3,
        player: { username: "DareDevil", uuid: "uuid8", rank: "default" },
        value: 876,
        change: -1
      }
    ]
  },
  playtime: {
    type: "playtime",
    title: "Most Active Players",
    lastUpdated: new Date().toISOString(),
    entries: [
      {
        rank: 1,
        player: { username: "NoLifeGamer", uuid: "uuid9", rank: "LEGEND" },
        value: 2592000, // 30 days in seconds
        change: 0
      },
      {
        rank: 2,
        player: { username: "AddictedPlayer", uuid: "uuid10", rank: "MVP" },
        value: 2160000, // 25 days
        change: 0
      },
      {
        rank: 3,
        player: { username: "DarkKnight_X", uuid: "uuid2", rank: "VIP" },
        value: 1728000, // 20 days
        change: 1
      },
      {
        rank: 4,
        player: { username: "BuilderPro", uuid: "uuid11", rank: "MVP" },
        value: 1555200, // 18 days
        change: -1
      },
      {
        rank: 5,
        player: { username: "CrafterLegend", uuid: "uuid12", rank: "VIP" },
        value: 1382400, // 16 days
        change: 0
      }
    ]
  },
  level: {
    type: "level",
    title: "Highest Level",
    lastUpdated: new Date().toISOString(),
    entries: [
      {
        rank: 1,
        player: { username: "MaxLevel", uuid: "uuid13", rank: "LEGEND" },
        value: 98,
        change: 0
      },
      {
        rank: 2,
        player: { username: "LevelGrinder", uuid: "uuid14", rank: "MVP" },
        value: 94,
        change: 1
      },
      {
        rank: 3,
        player: { username: "ExperienceKing", uuid: "uuid15", rank: "VIP" },
        value: 87,
        change: -1
      },
      {
        rank: 4,
        player: { username: "DarkKnight_X", uuid: "uuid2", rank: "VIP" },
        value: 82,
        change: 2
      },
      {
        rank: 5,
        player: { username: "SkillMaster", uuid: "uuid16", rank: "default" },
        value: 79,
        change: 0
      }
    ]
  },
  balance: {
    type: "balance",
    title: "Richest Players",
    lastUpdated: new Date().toISOString(),
    entries: [
      {
        rank: 1,
        player: { username: "MoneyBags", uuid: "uuid17", rank: "LEGEND" },
        value: 1500000,
        change: 0
      },
      {
        rank: 2,
        player: { username: "RichPlayer", uuid: "uuid18", rank: "MVP" },
        value: 987000,
        change: 1
      },
      {
        rank: 3,
        player: { username: "Entrepreneur", uuid: "uuid19", rank: "VIP" },
        value: 756000,
        change: -1
      },
      {
        rank: 4,
        player: { username: "Trader", uuid: "uuid20", rank: "MVP" },
        value: 654000,
        change: 0
      },
      {
        rank: 5,
        player: { username: "BusinessMan", uuid: "uuid21", rank: "VIP" },
        value: 532000,
        change: 2
      }
    ]
  },
  blocks_placed: {
    type: "blocks_placed",
    title: "Top Builders",
    lastUpdated: new Date().toISOString(),
    entries: [
      {
        rank: 1,
        player: { username: "MegaBuilder", uuid: "uuid22", rank: "MVP" },
        value: 5000000,
        change: 0
      },
      {
        rank: 2,
        player: { username: "ArchitectPro", uuid: "uuid23", rank: "LEGEND" },
        value: 4200000,
        change: 1
      },
      {
        rank: 3,
        player: { username: "BuilderPro", uuid: "uuid11", rank: "MVP" },
        value: 3800000,
        change: -1
      },
      {
        rank: 4,
        player: { username: "ConstructionKing", uuid: "uuid24", rank: "VIP" },
        value: 3200000,
        change: 0
      },
      {
        rank: 5,
        player: { username: "BlockMaster", uuid: "uuid25", rank: "default" },
        value: 2900000,
        change: 1
      }
    ]
  }
};

export const getLeaderboards: RequestHandler = (req, res) => {
  const response: ApiResponse<Leaderboard[]> = {
    success: true,
    data: Object.values(mockLeaderboards)
  };
  
  res.json(response);
};

export const getLeaderboard: RequestHandler = (req, res) => {
  const { type } = req.params;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const leaderboard = mockLeaderboards[type];
  if (!leaderboard) {
    const response: ApiResponse = {
      success: false,
      error: "Leaderboard type not found"
    };
    return res.status(404).json(response);
  }
  
  // Limit the number of entries returned
  const limitedLeaderboard = {
    ...leaderboard,
    entries: leaderboard.entries.slice(0, limit)
  };
  
  const response: ApiResponse<Leaderboard> = {
    success: true,
    data: limitedLeaderboard
  };
  
  res.json(response);
};

export const getPlayerRanking: RequestHandler = (req, res) => {
  const { type, playerId } = req.params;
  
  const leaderboard = mockLeaderboards[type];
  if (!leaderboard) {
    const response: ApiResponse = {
      success: false,
      error: "Leaderboard type not found"
    };
    return res.status(404).json(response);
  }
  
  const playerEntry = leaderboard.entries.find(entry => 
    entry.player.uuid === playerId || entry.player.username.toLowerCase() === playerId.toLowerCase()
  );
  
  if (!playerEntry) {
    const response: ApiResponse = {
      success: false,
      error: "Player not found in leaderboard"
    };
    return res.status(404).json(response);
  }
  
  const response: ApiResponse<LeaderboardEntry> = {
    success: true,
    data: playerEntry
  };
  
  res.json(response);
};

export const updateLeaderboards: RequestHandler = (req, res) => {
  // This would typically be called by the Minecraft plugin to update leaderboard data
  const { type, entries } = req.body;
  
  if (!mockLeaderboards[type]) {
    const response: ApiResponse = {
      success: false,
      error: "Invalid leaderboard type"
    };
    return res.status(400).json(response);
  }
  
  // Calculate position changes
  const oldEntries = mockLeaderboards[type].entries;
  const newEntries = entries.map((entry: LeaderboardEntry, index: number) => {
    const oldEntry = oldEntries.find(old => old.player.uuid === entry.player.uuid);
    const oldRank = oldEntry ? oldEntry.rank : Infinity;
    const newRank = index + 1;
    
    return {
      ...entry,
      rank: newRank,
      change: oldRank - newRank // Positive means moved up, negative means moved down
    };
  });
  
  mockLeaderboards[type] = {
    type: type as any,
    title: mockLeaderboards[type].title,
    entries: newEntries,
    lastUpdated: new Date().toISOString()
  };
  
  const response: ApiResponse<Leaderboard> = {
    success: true,
    data: mockLeaderboards[type],
    message: "Leaderboard updated successfully"
  };
  
  res.json(response);
};
