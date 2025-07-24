import { EventEmitter } from "events";
import { config } from "../../shared/config";
import { RconConnection, RconCommand } from "../../shared/database";

// Simple RCON implementation for demonstration
// In production, use a proper RCON library like 'rcon-client'

export class RconManager extends EventEmitter {
  private connections: Map<string, RconConnection> = new Map();
  private commandQueue: RconCommand[] = [];
  private isProcessing = false;
  private reconnectInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.initializeConnection();
    this.startProcessing();
  }

  private async initializeConnection(): Promise<void> {
    const connectionConfig = {
      id: "main",
      host: config.minecraft.rcon.host,
      port: config.minecraft.rcon.port,
      password: config.minecraft.rcon.password,
      isConnected: false,
      connectionAttempts: 0,
      maxConnectionAttempts: 5,
    };

    this.connections.set("main", connectionConfig);
    await this.connect("main");
  }

  private async connect(connectionId: string): Promise<boolean> {
    const connection = this.connections.get(connectionId);
    if (!connection) return false;

    try {
      // Simulate RCON connection
      // In production, use actual RCON client
      console.log(`Connecting to RCON: ${connection.host}:${connection.port}`);

      // Simulate connection success/failure
      const isSuccess = Math.random() > 0.1; // 90% success rate for demo

      if (isSuccess) {
        connection.isConnected = true;
        connection.connectionAttempts = 0;
        connection.lastPing = new Date();

        console.log(
          `RCON connected successfully to ${connection.host}:${connection.port}`,
        );
        this.emit("connected", connectionId);
        return true;
      } else {
        throw new Error("Connection failed");
      }
    } catch (error) {
      connection.connectionAttempts++;
      connection.isConnected = false;

      console.error(
        `RCON connection failed (attempt ${connection.connectionAttempts}):`,
        error,
      );
      this.emit("error", connectionId, error);

      if (connection.connectionAttempts < connection.maxConnectionAttempts) {
        // Retry connection after delay
        setTimeout(() => this.connect(connectionId), 5000);
      }

      return false;
    }
  }

  private startProcessing(): void {
    setInterval(() => {
      if (!this.isProcessing && this.commandQueue.length > 0) {
        this.processNextCommand();
      }
    }, 100); // Process every 100ms

    // Heartbeat check
    setInterval(() => {
      this.checkConnections();
    }, 30000); // Check every 30 seconds
  }

  private async processNextCommand(): Promise<void> {
    if (this.commandQueue.length === 0 || this.isProcessing) return;

    this.isProcessing = true;
    const command = this.commandQueue.shift()!;

    try {
      const connection = this.connections.get("main");
      if (!connection || !connection.isConnected) {
        throw new Error("RCON not connected");
      }

      const result = await this.executeCommand(command);
      command.executed = true;
      command.response = result;
      command.executedAt = new Date();

      this.emit("commandExecuted", command, result);
      console.log(
        `RCON command executed: ${command.command} ${command.args.join(" ")} -> ${result}`,
      );
    } catch (error) {
      command.error = error instanceof Error ? error.message : "Unknown error";
      this.emit("commandFailed", command, error);
      console.error(`RCON command failed: ${command.command}`, error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async executeCommand(rconCommand: RconCommand): Promise<string> {
    // Simulate RCON command execution
    // In production, use actual RCON client

    const fullCommand = `${rconCommand.command} ${rconCommand.args.join(" ")}`;

    // Simulate different command responses
    switch (rconCommand.command.toLowerCase()) {
      case "give":
        return `Gave ${rconCommand.args[2] || "1"} ${rconCommand.args[1]} to ${rconCommand.args[0]}`;

      case "lp":
        if (rconCommand.args[2] === "parent" && rconCommand.args[3] === "set") {
          return `Set ${rconCommand.args[0]}'s parent group to ${rconCommand.args[4]}`;
        }
        return `LuckPerms command executed`;

      case "eco":
        if (rconCommand.args[0] === "give") {
          return `$${rconCommand.args[2]} has been given to ${rconCommand.args[1]}`;
        }
        return `Economy command executed`;

      case "broadcast":
        return `Broadcasted: ${rconCommand.args.join(" ")}`;

      case "title":
        return `Title sent to ${rconCommand.args[0]}`;

      case "tellraw":
        return `Message sent to ${rconCommand.args[0]}`;

      case "list":
        return `There are 47/100 players online: Player1, Player2, Player3...`;

      case "tps":
        return `TPS from last 1m, 5m, 15m: 19.8, 19.9, 20.0`;

      default:
        return `Command executed: ${fullCommand}`;
    }
  }

  private async checkConnections(): Promise<void> {
    for (const [id, connection] of this.connections) {
      if (connection.isConnected) {
        try {
          // Send ping command to check if connection is alive
          await this.executeCommand({
            id: `ping_${Date.now()}`,
            command: "list",
            args: [],
            priority: 0,
            timestamp: new Date(),
            executed: false,
          });

          connection.lastPing = new Date();
        } catch (error) {
          console.error(`RCON connection lost for ${id}:`, error);
          connection.isConnected = false;
          this.connect(id); // Attempt reconnection
        }
      }
    }
  }

  // Public methods
  public async queueCommand(
    command: string,
    args: string[] = [],
    priority: number = 0,
    playerTarget?: string,
  ): Promise<string> {
    const rconCommand: RconCommand = {
      id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      command,
      args,
      playerTarget,
      priority,
      timestamp: new Date(),
      executed: false,
    };

    // Insert command based on priority (higher priority first)
    const insertIndex = this.commandQueue.findIndex(
      (cmd) => cmd.priority < priority,
    );
    if (insertIndex === -1) {
      this.commandQueue.push(rconCommand);
    } else {
      this.commandQueue.splice(insertIndex, 0, rconCommand);
    }

    return rconCommand.id;
  }

  public async executeImmediate(
    command: string,
    args: string[] = [],
    playerTarget?: string,
  ): Promise<string> {
    const rconCommand: RconCommand = {
      id: `immediate_${Date.now()}`,
      command,
      args,
      playerTarget,
      priority: 999, // Highest priority
      timestamp: new Date(),
      executed: false,
    };

    try {
      const result = await this.executeCommand(rconCommand);
      rconCommand.executed = true;
      rconCommand.response = result;
      rconCommand.executedAt = new Date();
      return result;
    } catch (error) {
      rconCommand.error =
        error instanceof Error ? error.message : "Unknown error";
      throw error;
    }
  }

  public getConnectionStatus(): { [key: string]: boolean } {
    const status: { [key: string]: boolean } = {};
    for (const [id, connection] of this.connections) {
      status[id] = connection.isConnected;
    }
    return status;
  }

  public getQueueLength(): number {
    return this.commandQueue.length;
  }

  public clearQueue(): void {
    this.commandQueue = [];
  }

  public async disconnect(): Promise<void> {
    for (const connection of this.connections.values()) {
      connection.isConnected = false;
    }

    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
    }

    this.emit("disconnected");
  }
}

// Singleton instance
export const rconManager = new RconManager();

// Helper functions for common commands
export const RconCommands = {
  give: (
    username: string,
    item: string,
    quantity: number = 1,
    nbt?: string,
  ) => {
    const args = [username, item, quantity.toString()];
    if (nbt) args.push(nbt);
    return rconManager.queueCommand("give", args, 5);
  },

  setRank: (username: string, rank: string) => {
    return rconManager.queueCommand(
      "lp",
      ["user", username, "parent", "set", rank],
      10,
    );
  },

  giveCoins: (username: string, amount: number) => {
    return rconManager.queueCommand(
      "eco",
      ["give", username, amount.toString()],
      5,
    );
  },

  broadcast: (message: string) => {
    return rconManager.queueCommand("broadcast", [message], 1);
  },

  sendTitle: (username: string, title: string, subtitle?: string) => {
    const commands = [
      rconManager.queueCommand("title", [username, "title", title], 3),
    ];
    if (subtitle) {
      commands.push(
        rconManager.queueCommand("title", [username, "subtitle", subtitle], 3),
      );
    }
    return commands;
  },

  sendMessage: (username: string, message: string) => {
    return rconManager.queueCommand("tellraw", [username, message], 2);
  },

  kickPlayer: (username: string, reason: string = "Kicked by admin") => {
    return rconManager.queueCommand("kick", [username, reason], 8);
  },

  banPlayer: (username: string, reason: string = "Banned by admin") => {
    return rconManager.queueCommand("ban", [username, reason], 9);
  },

  getOnlinePlayers: () => {
    return rconManager.executeImmediate("list");
  },

  getServerTps: () => {
    return rconManager.executeImmediate("tps");
  },
};
