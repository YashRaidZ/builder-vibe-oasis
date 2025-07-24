import { RequestHandler } from "express";
import { StoreItem, Purchase, ApiResponse } from "../../shared/types";

// Mock store items
const mockStoreItems: StoreItem[] = [
  {
    id: "vip-rank",
    name: "VIP Rank",
    description: "Unlock VIP privileges with /fly, colored chat, and exclusive perks!",
    price: 199,
    category: "ranks",
    type: "rank",
    icon: "crown",
    popular: true,
    commands: [
      "lp user {username} parent set vip",
      "give {username} diamond 16",
      "eco give {username} 5000"
    ],
    metadata: {
      rank: "vip",
      permissions: ["essentials.fly", "essentials.heal", "essentials.feed"],
      duration: "permanent"
    }
  },
  {
    id: "mvp-rank",
    name: "MVP Rank",
    description: "Premium MVP rank with enhanced permissions and exclusive commands!",
    price: 399,
    category: "ranks",
    type: "rank",
    icon: "star",
    popular: false,
    commands: [
      "lp user {username} parent set mvp",
      "give {username} netherite_ingot 8",
      "eco give {username} 15000"
    ],
    metadata: {
      rank: "mvp",
      permissions: ["*"],
      duration: "permanent"
    }
  },
  {
    id: "legend-rank",
    name: "LEGEND Rank",
    description: "Ultimate LEGEND rank with all perks and god-mode privileges!",
    price: 799,
    category: "ranks",
    type: "rank", 
    icon: "trophy",
    popular: false,
    commands: [
      "lp user {username} parent set legend",
      "give {username} netherite_armor_set 1",
      "eco give {username} 50000"
    ],
    metadata: {
      rank: "legend",
      permissions: ["*"],
      duration: "permanent"
    }
  },
  {
    id: "starter-kit",
    name: "Starter Kit",
    description: "Perfect for new players! Includes diamond armor, tools, and supplies.",
    price: 99,
    category: "kits",
    type: "item_bundle",
    icon: "sword",
    popular: true,
    commands: [
      "give {username} diamond_helmet 1",
      "give {username} diamond_chestplate 1", 
      "give {username} diamond_leggings 1",
      "give {username} diamond_boots 1",
      "give {username} diamond_sword 1",
      "give {username} diamond_pickaxe 1",
      "give {username} golden_apple 64",
      "give {username} bread 64"
    ],
    metadata: {
      items: ["diamond_armor_set", "diamond_tools", "food", "supplies"]
    }
  },
  {
    id: "builder-kit",
    name: "Builder's Kit",
    description: "Everything a master builder needs! Blocks, tools, and creative supplies.",
    price: 149,
    category: "kits",
    type: "item_bundle",
    icon: "building-blocks",
    popular: false,
    commands: [
      "give {username} stone 6400",
      "give {username} oak_planks 6400",
      "give {username} glass 1600",
      "give {username} wool 1600",
      "give {username} netherite_pickaxe 1",
      "give {username} efficiency_book 1"
    ],
    metadata: {
      items: ["building_blocks", "tools", "materials"]
    }
  },
  {
    id: "coins-1000",
    name: "1,000 Coins",
    description: "Server currency to trade with other players and buy items!",
    price: 149,
    category: "currency",
    type: "currency",
    icon: "coin",
    popular: true,
    commands: [
      "eco give {username} 1000"
    ],
    metadata: {
      amount: 1000,
      currency: "coins"
    }
  },
  {
    id: "coins-5000",
    name: "5,000 Coins",
    description: "Large coin package for serious traders and builders!",
    price: 599,
    category: "currency", 
    type: "currency",
    icon: "coin-stack",
    popular: false,
    commands: [
      "eco give {username} 5000"
    ],
    metadata: {
      amount: 5000,
      currency: "coins"
    }
  },
  {
    id: "rainbow-trail",
    name: "Rainbow Trail",
    description: "Leave a beautiful rainbow trail wherever you go!",
    price: 199,
    category: "cosmetics",
    type: "cosmetic",
    icon: "rainbow",
    popular: false,
    commands: [
      "trails give {username} rainbow"
    ],
    metadata: {
      cosmetic_type: "trail",
      effect: "rainbow"
    }
  }
];

let mockPurchases: Purchase[] = [];

export const getStoreItems: RequestHandler = (req, res) => {
  const category = req.query.category as string;
  const popular = req.query.popular === "true";
  
  let filteredItems = mockStoreItems;
  
  if (category) {
    filteredItems = filteredItems.filter(item => item.category === category);
  }
  
  if (popular) {
    filteredItems = filteredItems.filter(item => item.popular);
  }
  
  const response: ApiResponse<StoreItem[]> = {
    success: true,
    data: filteredItems
  };
  
  res.json(response);
};

export const getStoreItem: RequestHandler = (req, res) => {
  const { id } = req.params;
  const item = mockStoreItems.find(item => item.id === id);
  
  if (!item) {
    const response: ApiResponse = {
      success: false,
      error: "Store item not found"
    };
    return res.status(404).json(response);
  }
  
  const response: ApiResponse<StoreItem> = {
    success: true,
    data: item
  };
  
  res.json(response);
};

export const createPurchase: RequestHandler = (req, res) => {
  const { itemId, playerId } = req.body;
  
  const item = mockStoreItems.find(item => item.id === itemId);
  if (!item) {
    const response: ApiResponse = {
      success: false,
      error: "Store item not found"
    };
    return res.status(404).json(response);
  }
  
  const purchase: Purchase = {
    id: Date.now().toString(),
    playerId,
    itemId,
    price: item.price,
    status: "pending",
    paymentId: `razorpay_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  mockPurchases.push(purchase);
  
  // Simulate payment processing
  setTimeout(() => {
    const purchaseIndex = mockPurchases.findIndex(p => p.id === purchase.id);
    if (purchaseIndex !== -1) {
      mockPurchases[purchaseIndex].status = "completed";
      mockPurchases[purchaseIndex].deliveredAt = new Date().toISOString();
      
      // Here you would execute the delivery commands via RCON
      console.log(`Delivering item ${itemId} to player ${playerId}`);
    }
  }, 3000); // 3 seconds
  
  const response: ApiResponse<Purchase> = {
    success: true,
    data: purchase,
    message: "Purchase created successfully"
  };
  
  res.json(response);
};

export const getPurchases: RequestHandler = (req, res) => {
  const playerId = req.query.playerId as string;
  const status = req.query.status as string;
  
  let filteredPurchases = mockPurchases;
  
  if (playerId) {
    filteredPurchases = filteredPurchases.filter(p => p.playerId === playerId);
  }
  
  if (status) {
    filteredPurchases = filteredPurchases.filter(p => p.status === status);
  }
  
  const response: ApiResponse<Purchase[]> = {
    success: true,
    data: filteredPurchases
  };
  
  res.json(response);
};

export const retryDelivery: RequestHandler = (req, res) => {
  const { id } = req.params;
  
  const purchaseIndex = mockPurchases.findIndex(p => p.id === id);
  if (purchaseIndex === -1) {
    const response: ApiResponse = {
      success: false,
      error: "Purchase not found"
    };
    return res.status(404).json(response);
  }
  
  const purchase = mockPurchases[purchaseIndex];
  if (purchase.status !== "failed") {
    const response: ApiResponse = {
      success: false,
      error: "Can only retry failed deliveries"
    };
    return res.status(400).json(response);
  }
  
  // Reset status and try delivery again
  mockPurchases[purchaseIndex].status = "pending";
  mockPurchases[purchaseIndex].failureReason = undefined;
  
  setTimeout(() => {
    mockPurchases[purchaseIndex].status = "completed";
    mockPurchases[purchaseIndex].deliveredAt = new Date().toISOString();
  }, 2000);
  
  const response: ApiResponse<Purchase> = {
    success: true,
    data: mockPurchases[purchaseIndex],
    message: "Delivery retry initiated"
  };
  
  res.json(response);
};
