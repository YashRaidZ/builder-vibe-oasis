import { RequestHandler } from "express";
import { Plugin, PluginCommand, PluginPermission, ApiResponse } from "@shared/types";

// Mock plugin data
const mockPlugins: Plugin[] = [
  {
    id: "indusnetwork-core",
    name: "IndusNetwork Core",
    version: "2.1.5",
    enabled: true,
    description: "Core plugin for IndusNetwork server with authentication, store integration, and custom features.",
    author: "IndusNetwork Team",
    dependencies: ["Vault", "LuckPerms"],
    commands: [
      {
        name: "verify",
        description: "Verify your Minecraft account with the website",
        usage: "/verify <code>",
        permission: "indusnetwork.verify"
      },
      {
        name: "profile",
        description: "View your player profile and statistics",
        usage: "/profile [player]",
        permission: "indusnetwork.profile"
      },
      {
        name: "store",
        description: "Open the in-game store GUI",
        usage: "/store",
        permission: "indusnetwork.store"
      },
      {
        name: "balance",
        description: "Check your coin balance",
        usage: "/balance",
        permission: "indusnetwork.balance"
      }
    ],
    permissions: [
      {
        name: "indusnetwork.verify",
        description: "Allow players to verify their accounts",
        default: true
      },
      {
        name: "indusnetwork.profile",
        description: "Allow players to view profiles",
        default: true
      },
      {
        name: "indusnetwork.store",
        description: "Allow access to the store",
        default: true
      },
      {
        name: "indusnetwork.admin",
        description: "Full admin access to IndusNetwork features",
        default: false
      }
    ]
  },
  {
    id: "luckperms",
    name: "LuckPerms",
    version: "5.4.102",
    enabled: true,
    description: "Advanced permissions plugin for managing user ranks and permissions.",
    author: "Luck",
    dependencies: [],
    commands: [
      {
        name: "lp",
        description: "Main LuckPerms command",
        usage: "/lp <subcommand>",
        permission: "luckperms.admin"
      },
      {
        name: "lpb",
        description: "LuckPerms bulk operations",
        usage: "/lpb <operation>",
        permission: "luckperms.admin"
      }
    ],
    permissions: [
      {
        name: "luckperms.admin",
        description: "Full LuckPerms administration",
        default: false
      },
      {
        name: "luckperms.user.info",
        description: "View user information",
        default: false
      }
    ]
  },
  {
    id: "vault",
    name: "Vault",
    version: "1.7.3",
    enabled: true,
    description: "Economy API for Minecraft plugins. Provides a common API for economy plugins.",
    author: "MilkBowl",
    dependencies: [],
    commands: [],
    permissions: []
  },
  {
    id: "essentialsx",
    name: "EssentialsX",
    version: "2.20.1",
    enabled: true,
    description: "Essential commands and features for Minecraft servers.",
    author: "EssentialsX Team",
    dependencies: ["Vault"],
    commands: [
      {
        name: "fly",
        description: "Toggle flight mode",
        usage: "/fly [player]",
        permission: "essentials.fly"
      },
      {
        name: "heal",
        description: "Heal yourself or another player",
        usage: "/heal [player]",
        permission: "essentials.heal"
      },
      {
        name: "feed",
        description: "Feed yourself or another player",
        usage: "/feed [player]",
        permission: "essentials.feed"
      },
      {
        name: "tp",
        description: "Teleport to a player or location",
        usage: "/tp <player|x y z>",
        permission: "essentials.tp"
      }
    ],
    permissions: [
      {
        name: "essentials.fly",
        description: "Allow flight mode",
        default: false
      },
      {
        name: "essentials.heal",
        description: "Allow healing",
        default: false
      },
      {
        name: "essentials.feed",
        description: "Allow feeding",
        default: false
      }
    ]
  },
  {
    id: "cosmetics-plus",
    name: "Cosmetics+",
    version: "1.8.7",
    enabled: true,
    description: "Add cosmetic effects like trails, particles, and hats to your server.",
    author: "CosmeticsTeam",
    dependencies: [],
    commands: [
      {
        name: "cosmetics",
        description: "Open cosmetics menu",
        usage: "/cosmetics",
        permission: "cosmetics.use"
      },
      {
        name: "trails",
        description: "Manage particle trails",
        usage: "/trails [give|remove] [player] [trail]",
        permission: "cosmetics.trails"
      },
      {
        name: "hats",
        description: "Manage player hats",
        usage: "/hats [give|remove] [player] [hat]",
        permission: "cosmetics.hats"
      }
    ],
    permissions: [
      {
        name: "cosmetics.use",
        description: "Basic cosmetics access",
        default: true
      },
      {
        name: "cosmetics.trails",
        description: "Manage trails",
        default: false
      },
      {
        name: "cosmetics.admin",
        description: "Full cosmetics administration",
        default: false
      }
    ]
  },
  {
    id: "worldguard",
    name: "WorldGuard",
    version: "7.0.9",
    enabled: false,
    description: "Comprehensive world protection and region management plugin.",
    author: "sk89q",
    dependencies: ["WorldEdit"],
    commands: [
      {
        name: "region",
        description: "Manage WorldGuard regions",
        usage: "/region <subcommand>",
        permission: "worldguard.region"
      },
      {
        name: "wg",
        description: "WorldGuard main command",
        usage: "/wg <subcommand>",
        permission: "worldguard.admin"
      }
    ],
    permissions: [
      {
        name: "worldguard.admin",
        description: "Full WorldGuard administration",
        default: false
      },
      {
        name: "worldguard.region.bypass",
        description: "Bypass region protection",
        default: false
      }
    ]
  }
];

export const getPlugins: RequestHandler = (req, res) => {
  const enabled = req.query.enabled;
  
  let filteredPlugins = mockPlugins;
  
  if (enabled !== undefined) {
    const isEnabled = enabled === "true";
    filteredPlugins = mockPlugins.filter(plugin => plugin.enabled === isEnabled);
  }
  
  const response: ApiResponse<Plugin[]> = {
    success: true,
    data: filteredPlugins
  };
  
  res.json(response);
};

export const getPlugin: RequestHandler = (req, res) => {
  const { id } = req.params;
  const plugin = mockPlugins.find(p => p.id === id);
  
  if (!plugin) {
    const response: ApiResponse = {
      success: false,
      error: "Plugin not found"
    };
    return res.status(404).json(response);
  }
  
  const response: ApiResponse<Plugin> = {
    success: true,
    data: plugin
  };
  
  res.json(response);
};

export const togglePlugin: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { enabled } = req.body;
  
  const pluginIndex = mockPlugins.findIndex(p => p.id === id);
  
  if (pluginIndex === -1) {
    const response: ApiResponse = {
      success: false,
      error: "Plugin not found"
    };
    return res.status(404).json(response);
  }
  
  // Check dependencies
  const plugin = mockPlugins[pluginIndex];
  
  if (enabled === false) {
    // Check if other plugins depend on this one
    const dependentPlugins = mockPlugins.filter(p => 
      p.enabled && p.dependencies.includes(plugin.name)
    );
    
    if (dependentPlugins.length > 0) {
      const response: ApiResponse = {
        success: false,
        error: `Cannot disable plugin. The following plugins depend on it: ${dependentPlugins.map(p => p.name).join(", ")}`
      };
      return res.status(400).json(response);
    }
  } else {
    // Check if dependencies are enabled
    const missingDeps = plugin.dependencies.filter(dep => {
      const depPlugin = mockPlugins.find(p => p.name === dep);
      return !depPlugin || !depPlugin.enabled;
    });
    
    if (missingDeps.length > 0) {
      const response: ApiResponse = {
        success: false,
        error: `Cannot enable plugin. Missing dependencies: ${missingDeps.join(", ")}`
      };
      return res.status(400).json(response);
    }
  }
  
  mockPlugins[pluginIndex].enabled = enabled;
  
  // Here you would execute RCON commands to actually enable/disable the plugin
  // await executeRconCommand(enabled ? `pl enable ${plugin.name}` : `pl disable ${plugin.name}`);
  
  const response: ApiResponse<Plugin> = {
    success: true,
    data: mockPlugins[pluginIndex],
    message: `Plugin ${enabled ? "enabled" : "disabled"} successfully`
  };
  
  res.json(response);
};

export const reloadPlugin: RequestHandler = (req, res) => {
  const { id } = req.params;
  const plugin = mockPlugins.find(p => p.id === id);
  
  if (!plugin) {
    const response: ApiResponse = {
      success: false,
      error: "Plugin not found"
    };
    return res.status(404).json(response);
  }
  
  if (!plugin.enabled) {
    const response: ApiResponse = {
      success: false,
      error: "Cannot reload disabled plugin"
    };
    return res.status(400).json(response);
  }
  
  // Here you would execute RCON command to reload the plugin
  // await executeRconCommand(`pl reload ${plugin.name}`);
  
  const response: ApiResponse<Plugin> = {
    success: true,
    data: plugin,
    message: `Plugin ${plugin.name} reloaded successfully`
  };
  
  res.json(response);
};

export const getPluginCommands: RequestHandler = (req, res) => {
  const { id } = req.params;
  const plugin = mockPlugins.find(p => p.id === id);
  
  if (!plugin) {
    const response: ApiResponse = {
      success: false,
      error: "Plugin not found"
    };
    return res.status(404).json(response);
  }
  
  const response: ApiResponse<PluginCommand[]> = {
    success: true,
    data: plugin.commands
  };
  
  res.json(response);
};

export const getPluginPermissions: RequestHandler = (req, res) => {
  const { id } = req.params;
  const plugin = mockPlugins.find(p => p.id === id);
  
  if (!plugin) {
    const response: ApiResponse = {
      success: false,
      error: "Plugin not found"
    };
    return res.status(404).json(response);
  }
  
  const response: ApiResponse<PluginPermission[]> = {
    success: true,
    data: plugin.permissions
  };
  
  res.json(response);
};
