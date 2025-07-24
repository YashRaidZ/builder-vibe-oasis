import { EventEmitter } from "events";
import {
  DeliveryQueue,
  Transaction,
  DeliveryAttempt,
  DeliveryCommand,
} from "../../shared/database";
import { rconManager, RconCommands } from "./rcon";
import { config } from "../../shared/config";

export class DeliveryService extends EventEmitter {
  private deliveryQueue: DeliveryQueue[] = [];
  private isProcessing = false;
  private processingInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.startProcessing();
  }

  private startProcessing(): void {
    // Process delivery queue every 5 seconds
    this.processingInterval = setInterval(() => {
      this.processQueue();
    }, config.delivery.processingInterval * 1000);

    console.log("Delivery service started");
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.deliveryQueue.length === 0) return;

    this.isProcessing = true;

    try {
      // Get highest priority items that are ready to process
      const readyItems = this.deliveryQueue
        .filter(
          (item) =>
            item.status === "queued" &&
            (!item.nextAttempt || item.nextAttempt <= new Date()) &&
            item.attempts < item.maxAttempts,
        )
        .sort((a, b) => b.priority - a.priority) // Higher priority first
        .slice(0, config.delivery.batchSize);

      for (const item of readyItems) {
        await this.processDeliveryItem(item);
      }
    } catch (error) {
      console.error("Error processing delivery queue:", error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async processDeliveryItem(item: DeliveryQueue): Promise<void> {
    item.status = "processing";
    item.attempts++;
    item.processedAt = new Date();

    console.log(
      `Processing delivery for ${item.playerUsername} (${item.itemId}) - Attempt ${item.attempts}`,
    );

    try {
      const deliveryResult = await this.executeDeliveryCommands(item);

      if (deliveryResult.success) {
        item.status = "completed";
        item.completedAt = new Date();

        // Remove from queue
        this.removeFromQueue(item.id);

        console.log(
          `✅ Delivery completed for ${item.playerUsername} (${item.itemId})`,
        );
        this.emit("deliveryCompleted", item, deliveryResult);
      } else {
        throw new Error(deliveryResult.error || "Delivery failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      item.error = errorMessage;

      if (item.attempts >= item.maxAttempts) {
        item.status = "failed";
        console.error(
          `❌ Delivery failed permanently for ${item.playerUsername} (${item.itemId}): ${errorMessage}`,
        );
        this.emit("deliveryFailed", item, errorMessage);
      } else {
        item.status = "queued";
        item.nextAttempt = new Date(
          Date.now() + config.delivery.retryDelay * 1000 * item.attempts,
        );
        console.warn(
          `⚠️ Delivery failed for ${item.playerUsername} (${item.itemId}), retrying in ${config.delivery.retryDelay * item.attempts}s: ${errorMessage}`,
        );
        this.emit("deliveryRetry", item, errorMessage);
      }
    }
  }

  private async executeDeliveryCommands(
    item: DeliveryQueue,
  ): Promise<{ success: boolean; error?: string; responses: string[] }> {
    const responses: string[] = [];
    const executedCommands: string[] = [];

    try {
      // Check if player is online (optional check)
      const onlineCheck = await this.isPlayerOnline(item.playerUsername);
      if (!onlineCheck) {
        console.warn(
          `Player ${item.playerUsername} is not online, but proceeding with delivery`,
        );
      }

      // Execute commands in sequence
      for (const command of item.commands) {
        const processedCommand = this.processCommandTemplate(
          command,
          item.playerUsername,
        );

        try {
          // Add delay if specified
          if (command.delay && command.delay > 0) {
            await this.delay(command.delay * 1000);
          }

          const response = await rconManager.executeImmediate(
            processedCommand.command,
            processedCommand.args,
            item.playerUsername,
          );

          responses.push(response);
          executedCommands.push(
            `${processedCommand.command} ${processedCommand.args.join(" ")}`,
          );

          console.log(
            `Command executed: ${processedCommand.command} ${processedCommand.args.join(" ")} -> ${response}`,
          );
        } catch (cmdError) {
          const cmdErrorMsg =
            cmdError instanceof Error
              ? cmdError.message
              : "Command execution failed";
          console.error(
            `Command failed: ${processedCommand.command} ${processedCommand.args.join(" ")} -> ${cmdErrorMsg}`,
          );

          if (!command.retryOnFail) {
            throw new Error(`Command failed: ${cmdErrorMsg}`);
          }

          responses.push(`ERROR: ${cmdErrorMsg}`);
        }
      }

      // Send success notification to player
      await this.sendDeliveryNotification(
        item.playerUsername,
        item.itemId,
        true,
      );

      return { success: true, responses };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // Send failure notification to player if they're online
      await this.sendDeliveryNotification(
        item.playerUsername,
        item.itemId,
        false,
        errorMessage,
      );

      return { success: false, error: errorMessage, responses };
    }
  }

  private processCommandTemplate(
    command: DeliveryCommand,
    username: string,
  ): { command: string; args: string[] } {
    const processString = (str: string): string => {
      return str
        .replace(/\{username\}/g, username)
        .replace(/\{player\}/g, username)
        .replace(/\{time\}/g, new Date().toLocaleTimeString())
        .replace(/\{date\}/g, new Date().toLocaleDateString());
    };

    return {
      command: processString(command.command),
      args: command.args.map((arg) => processString(arg)),
    };
  }

  private async isPlayerOnline(username: string): Promise<boolean> {
    try {
      const response = await RconCommands.getOnlinePlayers();
      return response.toLowerCase().includes(username.toLowerCase());
    } catch {
      return false; // Assume offline if we can't check
    }
  }

  private async sendDeliveryNotification(
    username: string,
    itemId: string,
    success: boolean,
    error?: string,
  ): Promise<void> {
    try {
      if (success) {
        await RconCommands.sendMessage(
          username,
          `{"text":"✅ Your purchase (${itemId}) has been delivered!","color":"green"}`,
        );
      } else {
        await RconCommands.sendMessage(
          username,
          `{"text":"❌ Delivery failed for ${itemId}. Contact support if this persists.","color":"red"}`,
        );
      }
    } catch (error) {
      console.error("Failed to send delivery notification:", error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private removeFromQueue(deliveryId: string): void {
    this.deliveryQueue = this.deliveryQueue.filter(
      (item) => item.id !== deliveryId,
    );
  }

  // Public methods
  public async addToQueue(
    transactionId: string,
    playerId: string,
    playerUsername: string,
    itemId: string,
    commands: DeliveryCommand[],
    priority: number = 1,
  ): Promise<string> {
    const deliveryId = `delivery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const queueItem: DeliveryQueue = {
      id: deliveryId,
      transactionId,
      playerId,
      playerUsername,
      itemId,
      commands,
      priority,
      status: "queued",
      attempts: 0,
      maxAttempts: config.delivery.maxAttempts,
      createdAt: new Date(),
    };

    this.deliveryQueue.push(queueItem);

    console.log(
      `➕ Added delivery to queue: ${playerUsername} (${itemId}) - Priority: ${priority}`,
    );
    this.emit("deliveryQueued", queueItem);

    return deliveryId;
  }

  public async deliverImmediately(
    transactionId: string,
    playerId: string,
    playerUsername: string,
    itemId: string,
    commands: DeliveryCommand[],
  ): Promise<{ success: boolean; error?: string; responses?: string[] }> {
    console.log(`🚀 Immediate delivery for ${playerUsername} (${itemId})`);

    const tempItem: DeliveryQueue = {
      id: `immediate_${Date.now()}`,
      transactionId,
      playerId,
      playerUsername,
      itemId,
      commands,
      priority: 999,
      status: "processing",
      attempts: 1,
      maxAttempts: 1,
      createdAt: new Date(),
      processedAt: new Date(),
    };

    try {
      const result = await this.executeDeliveryCommands(tempItem);

      if (result.success) {
        console.log(
          `✅ Immediate delivery completed for ${playerUsername} (${itemId})`,
        );
        this.emit("immediateDeliveryCompleted", tempItem, result);
      } else {
        console.error(
          `❌ Immediate delivery failed for ${playerUsername} (${itemId}): ${result.error}`,
        );
        this.emit("immediateDeliveryFailed", tempItem, result.error);
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(
        `❌ Immediate delivery error for ${playerUsername} (${itemId}): ${errorMessage}`,
      );
      this.emit("immediateDeliveryFailed", tempItem, errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  public getQueueStatus(): {
    total: number;
    queued: number;
    processing: number;
    completed: number;
    failed: number;
  } {
    const stats = {
      total: this.deliveryQueue.length,
      queued: 0,
      processing: 0,
      completed: 0,
      failed: 0,
    };

    for (const item of this.deliveryQueue) {
      stats[item.status]++;
    }

    return stats;
  }

  public getQueueItems(): DeliveryQueue[] {
    return [...this.deliveryQueue];
  }

  public async retryDelivery(deliveryId: string): Promise<boolean> {
    const item = this.deliveryQueue.find((q) => q.id === deliveryId);
    if (!item) return false;

    item.status = "queued";
    item.attempts = 0;
    item.nextAttempt = undefined;
    item.error = undefined;

    console.log(
      `🔄 Retrying delivery: ${item.playerUsername} (${item.itemId})`,
    );
    this.emit("deliveryRetryRequested", item);

    return true;
  }

  public async cancelDelivery(deliveryId: string): Promise<boolean> {
    const index = this.deliveryQueue.findIndex((q) => q.id === deliveryId);
    if (index === -1) return false;

    const item = this.deliveryQueue[index];
    this.deliveryQueue.splice(index, 1);

    console.log(
      `❌ Cancelled delivery: ${item.playerUsername} (${item.itemId})`,
    );
    this.emit("deliveryCancelled", item);

    return true;
  }

  public async clearQueue(): Promise<void> {
    const count = this.deliveryQueue.length;
    this.deliveryQueue = [];
    console.log(`🧹 Cleared delivery queue (${count} items)`);
    this.emit("queueCleared", count);
  }

  public stop(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    console.log("Delivery service stopped");
  }
}

// Singleton instance - lazy initialization to prevent issues during build
let _deliveryService: DeliveryService | null = null;

export const getDeliveryService = (): DeliveryService => {
  if (!_deliveryService) {
    _deliveryService = new DeliveryService();
  }
  return _deliveryService;
};

// For backward compatibility
export const deliveryService = new Proxy({} as DeliveryService, {
  get(target, prop) {
    return getDeliveryService()[prop as keyof DeliveryService];
  }
});

// Helper functions for common delivery scenarios
export const DeliveryHelpers = {
  rankUpgrade: async (
    username: string,
    rank: string,
    transactionId: string = "",
    immediate: boolean = true,
  ) => {
    const commands: DeliveryCommand[] = [
      {
        command: "lp",
        args: ["user", "{username}", "parent", "set", rank],
        delay: 0,
        retryOnFail: true,
      },
      {
        command: "broadcast",
        args: [
          "{username}",
          "has",
          "been",
          "promoted",
          "to",
          rank.toUpperCase() + "!",
        ],
        delay: 1,
      },
      {
        command: "title",
        args: [
          "{username}",
          "title",
          `{"text":"RANK UP!","color":"gold","bold":true}`,
        ],
        delay: 2,
      },
      {
        command: "title",
        args: [
          "{username}",
          "subtitle",
          `{"text":"Welcome to ${rank.toUpperCase()}","color":"yellow"}`,
        ],
        delay: 3,
      },
    ];

    if (immediate) {
      return deliveryService.deliverImmediately(
        transactionId,
        "",
        username,
        `${rank}-rank`,
        commands,
      );
    } else {
      return deliveryService.addToQueue(
        transactionId,
        "",
        username,
        `${rank}-rank`,
        commands,
        10,
      );
    }
  },

  giveCoins: async (
    username: string,
    amount: number,
    transactionId: string = "",
    immediate: boolean = true,
  ) => {
    const commands: DeliveryCommand[] = [
      {
        command: "eco",
        args: ["give", "{username}", amount.toString()],
        delay: 0,
        retryOnFail: true,
      },
      {
        command: "tellraw",
        args: [
          "{username}",
          `{"text":"${amount} coins have been added to your account!","color":"green"}`,
        ],
        delay: 1,
      },
    ];

    if (immediate) {
      return deliveryService.deliverImmediately(
        transactionId,
        "",
        username,
        `coins-${amount}`,
        commands,
      );
    } else {
      return deliveryService.addToQueue(
        transactionId,
        "",
        username,
        `coins-${amount}`,
        commands,
        5,
      );
    }
  },

  deliverKit: async (
    username: string,
    kitItems: Array<{ item: string; quantity: number; enchantments?: string }>,
    kitName: string,
    transactionId: string = "",
    immediate: boolean = true,
  ) => {
    const commands: DeliveryCommand[] = [
      ...kitItems.map((item, index) => ({
        command: "give",
        args: [
          "{username}",
          item.item,
          item.quantity.toString(),
          ...(item.enchantments ? [item.enchantments] : []),
        ],
        delay: index * 0.1,
        retryOnFail: true,
      })),
      {
        command: "tellraw",
        args: [
          "{username}",
          `{"text":"${kitName} has been delivered! Check your inventory.","color":"green"}`,
        ],
        delay: kitItems.length * 0.1 + 1,
      },
    ];

    if (immediate) {
      return deliveryService.deliverImmediately(
        transactionId,
        "",
        username,
        kitName,
        commands,
      );
    } else {
      return deliveryService.addToQueue(
        transactionId,
        "",
        username,
        kitName,
        commands,
        7,
      );
    }
  },
};
