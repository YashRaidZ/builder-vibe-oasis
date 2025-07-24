import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Server,
  Users,
  ShoppingCart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Zap,
  Settings,
  BarChart3,
  TrendingUp,
  Eye,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface DeliveryQueueItem {
  id: string;
  playerUsername: string;
  itemId: string;
  status: "queued" | "processing" | "completed" | "failed";
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  error?: string;
}

interface ServerStats {
  onlinePlayers: number;
  maxPlayers: number;
  tps: number;
  memoryUsed: number;
  memoryMax: number;
  uptime: number;
  rconConnected: boolean;
}

interface PurchaseStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  revenue: number;
}

export default function Admin() {
  const { auth } = useAuth();
  const [serverStats, setServerStats] = useState<ServerStats | null>(null);
  const [purchaseStats, setPurchaseStats] = useState<PurchaseStats | null>(
    null,
  );
  const [deliveryQueue, setDeliveryQueue] = useState<DeliveryQueueItem[]>([]);
  const [rconCommand, setRconCommand] = useState("");
  const [rconOutput, setRconOutput] = useState("");
  const [loading, setLoading] = useState(true);
  const [rconLoading, setRconLoading] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchAdminData();
      const interval = setInterval(fetchAdminData, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [auth]);

  const fetchAdminData = async () => {
    try {
      // Fetch server status
      const serverResponse = await fetch("/api/server/status");
      const serverData = await serverResponse.json();
      if (serverData.success) {
        setServerStats({
          ...serverData.data,
          rconConnected: true, // Mock RCON status
        });
      }

      // Fetch delivery status
      const deliveryResponse = await fetch("/api/store/delivery/status");
      const deliveryData = await deliveryResponse.json();
      if (deliveryData.success) {
        // Mock delivery queue data
        setDeliveryQueue([
          {
            id: "1",
            playerUsername: "TestPlayer1",
            itemId: "vip-rank",
            status: "completed",
            attempts: 1,
            maxAttempts: 3,
            createdAt: new Date(Date.now() - 30000).toISOString(),
          },
          {
            id: "2",
            playerUsername: "TestPlayer2",
            itemId: "starter-kit",
            status: "processing",
            attempts: 1,
            maxAttempts: 3,
            createdAt: new Date(Date.now() - 10000).toISOString(),
          },
          {
            id: "3",
            playerUsername: "TestPlayer3",
            itemId: "coins-1000",
            status: "failed",
            attempts: 3,
            maxAttempts: 3,
            createdAt: new Date(Date.now() - 60000).toISOString(),
            error: "Player not online",
          },
        ]);
      }

      // Mock purchase stats
      setPurchaseStats({
        total: 1247,
        completed: 1198,
        pending: 12,
        failed: 37,
        revenue: 156789,
      });
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const executeRconCommand = async () => {
    if (!rconCommand.trim()) return;

    setRconLoading(true);
    try {
      const response = await fetch("/api/server/rcon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          command: rconCommand.split(" ")[0],
          args: rconCommand.split(" ").slice(1),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setRconOutput(
          (prev) => `${prev}\n> ${rconCommand}\n${data.data.output}\n`,
        );
      } else {
        setRconOutput(
          (prev) => `${prev}\n> ${rconCommand}\nERROR: ${data.error}\n`,
        );
      }
      setRconCommand("");
    } catch (error) {
      setRconOutput(
        (prev) => `${prev}\n> ${rconCommand}\nERROR: Network error\n`,
      );
    } finally {
      setRconLoading(false);
    }
  };

  const retryDelivery = async (deliveryId: string) => {
    try {
      // Mock retry - in production this would call the actual retry endpoint
      setDeliveryQueue((prev) =>
        prev.map((item) =>
          item.id === deliveryId
            ? {
                ...item,
                status: "queued" as const,
                attempts: 0,
                error: undefined,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Failed to retry delivery:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-neon-green" />;
      case "processing":
        return <Clock className="h-4 w-4 text-gold" />;
      case "queued":
        return <Clock className="h-4 w-4 text-primary-blue" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-redstone" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-neon-green border-neon-green";
      case "processing":
        return "text-gold border-gold";
      case "queued":
        return "text-primary-blue border-primary-blue";
      case "failed":
        return "text-redstone border-redstone";
      default:
        return "text-muted-foreground border-muted";
    }
  };

  if (!auth.isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-redstone" />
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-8">
          You need to be logged in as an administrator to access this page.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-dark">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Server management and monitoring
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              className={`${serverStats?.rconConnected ? "bg-neon-green/20 text-neon-green border-neon-green/30" : "bg-redstone/20 text-redstone border-redstone/30"}`}
            >
              <Activity className="h-3 w-3 mr-1" />
              RCON {serverStats?.rconConnected ? "Connected" : "Disconnected"}
            </Badge>
            <Button onClick={fetchAdminData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="gaming-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-primary-blue" />
                Players Online
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-blue">
                {serverStats?.onlinePlayers || 0}/
                {serverStats?.maxPlayers || 100}
              </div>
              <p className="text-xs text-muted-foreground">
                {(
                  ((serverStats?.onlinePlayers || 0) /
                    (serverStats?.maxPlayers || 100)) *
                  100
                ).toFixed(1)}
                % capacity
              </p>
            </CardContent>
          </Card>

          <Card className="gaming-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Server className="h-4 w-4 text-neon-green" />
                Server TPS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-green">
                {serverStats?.tps?.toFixed(1) || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {(serverStats?.tps || 0) >= 19
                  ? "Excellent"
                  : "Needs attention"}
              </p>
            </CardContent>
          </Card>

          <Card className="gaming-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-gold" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gold">
                ₹{purchaseStats?.revenue.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {purchaseStats?.total || 0} total purchases
              </p>
            </CardContent>
          </Card>

          <Card className="gaming-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary-purple" />
                Delivery Success
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-purple">
                {purchaseStats
                  ? (
                      (purchaseStats.completed / purchaseStats.total) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                {purchaseStats?.failed || 0} failed deliveries
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="delivery" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-card/50">
            <TabsTrigger
              value="delivery"
              className="data-[state=active]:bg-primary-blue data-[state=active]:text-white"
            >
              <Zap className="mr-2 h-4 w-4" />
              Delivery Queue
            </TabsTrigger>
            <TabsTrigger
              value="rcon"
              className="data-[state=active]:bg-primary-purple data-[state=active]:text-white"
            >
              <Settings className="mr-2 h-4 w-4" />
              RCON Console
            </TabsTrigger>
            <TabsTrigger
              value="purchases"
              className="data-[state=active]:bg-gold data-[state=active]:text-white"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Purchases
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-emerald data-[state=active]:text-white"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Delivery Queue Tab */}
          <TabsContent value="delivery" className="space-y-6">
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary-blue" />
                  Instant Delivery Queue
                </CardTitle>
                <CardDescription>
                  Monitor and manage the automatic delivery system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliveryQueue.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>No items in delivery queue</p>
                    </div>
                  ) : (
                    deliveryQueue.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          {getStatusIcon(item.status)}
                          <div>
                            <div className="font-medium">
                              {item.playerUsername}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.itemId}
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={getStatusColor(item.status)}
                          >
                            {item.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-sm text-muted-foreground">
                            Attempt {item.attempts}/{item.maxAttempts}
                          </div>
                          {item.error && (
                            <div className="text-sm text-redstone">
                              {item.error}
                            </div>
                          )}
                          <div className="text-sm text-muted-foreground">
                            {new Date(item.createdAt).toLocaleTimeString()}
                          </div>
                          {item.status === "failed" && (
                            <Button
                              size="sm"
                              onClick={() => retryDelivery(item.id)}
                              className="text-white"
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Retry
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RCON Console Tab */}
          <TabsContent value="rcon" className="space-y-6">
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary-purple" />
                  RCON Console
                </CardTitle>
                <CardDescription>
                  Execute server commands remotely
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-background/50 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
                    <pre className="whitespace-pre-wrap">
                      {rconOutput || "RCON Console ready. Type commands below."}
                    </pre>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter RCON command (e.g., list, give player item 1)"
                      value={rconCommand}
                      onChange={(e) => setRconCommand(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && executeRconCommand()
                      }
                      className="flex-1"
                    />
                    <Button
                      onClick={executeRconCommand}
                      disabled={rconLoading || !rconCommand.trim()}
                      className="btn-primary text-white"
                    >
                      {rconLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRconCommand("list")}
                    >
                      List Players
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRconCommand("tps")}
                    >
                      Check TPS
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRconCommand("save-all")}
                    >
                      Save World
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRconOutput("")}
                    >
                      Clear Console
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Purchases Tab */}
          <TabsContent value="purchases" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="gaming-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Purchase Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Completed</span>
                      <span className="font-semibold text-neon-green">
                        {purchaseStats?.completed || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Pending</span>
                      <span className="font-semibold text-gold">
                        {purchaseStats?.pending || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Failed</span>
                      <span className="font-semibold text-redstone">
                        {purchaseStats?.failed || 0}
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Total Revenue</span>
                        <span className="font-bold text-gold">
                          ₹{purchaseStats?.revenue.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                Analytics and reporting features are coming soon. This will
                include sales charts, player engagement metrics, and performance
                analytics.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
