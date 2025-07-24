import { RequestHandler } from "express";
import { StoreItem, Purchase, ApiResponse } from "../../shared/types";
import { storeItemsData } from "../data/store-data";
import { deliveryService, DeliveryHelpers } from "../services/delivery";
import { config } from "../../shared/config";

// Convert comprehensive store data to API format
const convertToApiFormat = (item: any): StoreItem => ({
  id: item.id,
  name: item.name,
  description: item.description,
  price: item.price,
  category: item.category,
  type: item.type,
  icon: item.icon || 'package',
  popular: item.popular || false,
  commands: item.deliveryCommands?.map((cmd: any) => 
    `${cmd.command} ${cmd.args.join(' ')}`
  ) || [],
  metadata: {
    featured: item.featured,
    isNew: item.isNew,
    tags: item.tags,
    discount: item.discount,
    requirements: item.requirements,
    totalSales: item.totalSales,
    rating: item.rating
  }
});

const mockStoreItems: StoreItem[] = storeItemsData.map(convertToApiFormat);
let mockPurchases: Purchase[] = [];

export const getStoreItems: RequestHandler = (req, res) => {
  const category = req.query.category as string;
  const popular = req.query.popular === "true";
  const featured = req.query.featured === "true";
  const isNew = req.query.new === "true";
  const search = req.query.search as string;
  
  let filteredItems = mockStoreItems;
  
  // Apply filters
  if (category && category !== 'all') {
    filteredItems = filteredItems.filter(item => item.category === category);
  }
  
  if (popular) {
    filteredItems = filteredItems.filter(item => item.popular);
  }
  
  if (featured) {
    filteredItems = filteredItems.filter(item => item.metadata?.featured);
  }
  
  if (isNew) {
    filteredItems = filteredItems.filter(item => item.metadata?.isNew);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.metadata?.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
    );
  }
  
  // Sort by popularity and rating
  filteredItems.sort((a, b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return (b.metadata?.rating || 0) - (a.metadata?.rating || 0);
  });
  
  const response: ApiResponse<StoreItem[]> = {
    success: true,
    data: filteredItems,
    message: `Found ${filteredItems.length} items`
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
  
  // Get full item data for detailed view
  const fullItem = storeItemsData.find(fullItem => fullItem.id === id);
  const enhancedItem = fullItem ? {
    ...item,
    longDescription: fullItem.longDescription,
    requirements: fullItem.requirements,
    deliveryMessage: fullItem.deliveryMessage,
    totalSales: fullItem.totalSales,
    rating: fullItem.rating,
    reviews: fullItem.reviews,
    tags: fullItem.tags,
    featured: fullItem.featured,
    isNew: fullItem.isNew,
    discount: fullItem.discount,
    originalPrice: fullItem.originalPrice
  } : item;
  
  const response: ApiResponse<StoreItem> = {
    success: true,
    data: enhancedItem
  };
  
  res.json(response);
};

export const createPurchase: RequestHandler = async (req, res) => {
  const { itemId, playerId, playerUsername } = req.body;
  
  if (!itemId || !playerId || !playerUsername) {
    const response: ApiResponse = {
      success: false,
      error: "Missing required fields: itemId, playerId, playerUsername"
    };
    return res.status(400).json(response);
  }
  
  const item = mockStoreItems.find(item => item.id === itemId);
  const fullItem = storeItemsData.find(item => item.id === itemId);
  
  if (!item || !fullItem) {
    const response: ApiResponse = {
      success: false,
      error: "Store item not found"
    };
    return res.status(404).json(response);
  }

  // Check item availability
  if (!fullItem.isAvailable) {
    const response: ApiResponse = {
      success: false,
      error: "Item is currently unavailable"
    };
    return res.status(400).json(response);
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
  
  // Simulate payment processing and instant delivery
  try {
    // Simulate payment processing (2-3 seconds)
    setTimeout(async () => {
      const purchaseIndex = mockPurchases.findIndex(p => p.id === purchase.id);
      if (purchaseIndex !== -1) {
        mockPurchases[purchaseIndex].status = "completed";
        mockPurchases[purchaseIndex].deliveredAt = new Date().toISOString();
        
        console.log(`💰 Payment completed for ${playerUsername} (${itemId})`);
        
        // Instant delivery via RCON
        try {
          let deliveryResult;
          
          // Handle different item types with specialized delivery
          if (fullItem.category === 'ranks') {
            const rankName = fullItem.id.replace('-rank', '');
            deliveryResult = await DeliveryHelpers.rankUpgrade(
              playerUsername, 
              rankName, 
              purchase.id, 
              true // immediate delivery
            );
          } else if (fullItem.category === 'currency') {
            const amount = parseInt(fullItem.name.match(/\d+/)?.[0] || '0');
            deliveryResult = await DeliveryHelpers.giveCoins(
              playerUsername, 
              amount, 
              purchase.id, 
              true
            );
          } else if (fullItem.category === 'kits') {
            // Extract kit items from delivery commands
            const kitItems = fullItem.deliveryCommands
              .filter(cmd => cmd.command === 'give')
              .map(cmd => ({
                item: cmd.args[1],
                quantity: parseInt(cmd.args[2]) || 1,
                enchantments: cmd.args[3]
              }));
            
            deliveryResult = await DeliveryHelpers.deliverKit(
              playerUsername,
              kitItems,
              fullItem.name,
              purchase.id,
              true
            );
          } else {
            // Generic delivery using commands from item data
            deliveryResult = await deliveryService.deliverImmediately(
              purchase.id,
              playerId,
              playerUsername,
              itemId,
              fullItem.deliveryCommands
            );
          }
          
          if (deliveryResult.success) {
            console.log(`✅ Instant delivery completed for ${playerUsername} (${itemId})`);
          } else {
            console.error(`❌ Delivery failed for ${playerUsername} (${itemId}): ${deliveryResult.error}`);
            mockPurchases[purchaseIndex].status = "failed";
          }
        } catch (deliveryError) {
          console.error(`Delivery error for ${playerUsername} (${itemId}):`, deliveryError);
          mockPurchases[purchaseIndex].status = "failed";
        }
      }
    }, 2000 + Math.random() * 2000); // 2-4 seconds for realism
    
    const response: ApiResponse<Purchase> = {
      success: true,
      data: purchase,
      message: "Purchase created successfully. Processing payment and delivery..."
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Purchase processing failed"
    };
    res.status(500).json(response);
  }
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

export const retryDelivery: RequestHandler = async (req, res) => {
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
  
  try {
    const item = storeItemsData.find(item => item.id === purchase.itemId);
    if (!item) {
      throw new Error('Item not found');
    }
    
    // Get player info - in production this would come from database
    const playerUsername = 'Player'; // This should be retrieved from player data
    
    // Retry delivery immediately
    const deliveryResult = await deliveryService.deliverImmediately(
      purchase.id,
      purchase.playerId,
      playerUsername,
      purchase.itemId,
      item.deliveryCommands
    );
    
    if (deliveryResult.success) {
      mockPurchases[purchaseIndex].status = "completed";
      mockPurchases[purchaseIndex].deliveredAt = new Date().toISOString();
      console.log(`✅ Retry delivery successful for ${playerUsername} (${purchase.itemId})`);
    } else {
      mockPurchases[purchaseIndex].status = "failed";
      mockPurchases[purchaseIndex].failureReason = deliveryResult.error;
      console.error(`❌ Retry delivery failed for ${playerUsername} (${purchase.itemId}): ${deliveryResult.error}`);
    }
    
    const response: ApiResponse<Purchase> = {
      success: deliveryResult.success,
      data: mockPurchases[purchaseIndex],
      message: deliveryResult.success ? "Delivery retry successful" : "Delivery retry failed",
      error: deliveryResult.error
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Retry delivery failed"
    };
    res.status(500).json(response);
  }
};

// New endpoint for delivery queue status
export const getDeliveryStatus: RequestHandler = (req, res) => {
  const queueStatus = deliveryService.getQueueStatus();
  
  const response: ApiResponse = {
    success: true,
    data: {
      queue: queueStatus,
      rconConnected: true, // In production, check actual RCON status
      deliveryEnabled: config.delivery.enabled
    }
  };
  
  res.json(response);
};

// New endpoint for manual delivery trigger
export const triggerManualDelivery: RequestHandler = async (req, res) => {
  const { purchaseId } = req.params;
  const { playerUsername } = req.body;
  
  const purchase = mockPurchases.find(p => p.id === purchaseId);
  if (!purchase) {
    return res.status(404).json({
      success: false,
      error: "Purchase not found"
    });
  }
  
  const item = storeItemsData.find(item => item.id === purchase.itemId);
  if (!item) {
    return res.status(404).json({
      success: false,
      error: "Item not found"
    });
  }
  
  try {
    const deliveryResult = await deliveryService.deliverImmediately(
      purchase.id,
      purchase.playerId,
      playerUsername || 'Player',
      purchase.itemId,
      item.deliveryCommands
    );
    
    if (deliveryResult.success) {
      const purchaseIndex = mockPurchases.findIndex(p => p.id === purchaseId);
      if (purchaseIndex !== -1) {
        mockPurchases[purchaseIndex].status = "completed";
        mockPurchases[purchaseIndex].deliveredAt = new Date().toISOString();
      }
    }
    
    res.json({
      success: deliveryResult.success,
      message: deliveryResult.success ? "Manual delivery completed" : "Manual delivery failed",
      error: deliveryResult.error,
      data: deliveryResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Manual delivery failed"
    });
  }
};
