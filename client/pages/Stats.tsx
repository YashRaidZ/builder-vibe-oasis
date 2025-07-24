import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Trophy, 
  Clock, 
  Sword, 
  Shield, 
  Pickaxe, 
  Crown, 
  Coins, 
  Target, 
  TrendingUp,
  Calendar,
  Award,
  Star,
  BarChart3,
  Activity,
  Zap
} from "lucide-react";
import { Player, Achievement, Leaderboard } from "../../shared/types";
import { useAuth } from "@/hooks/useAuth";

export default function Stats() {
  const { auth } = useAuth();
  const [playerData, setPlayerData] = useState<Player | null>(null);
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      fetchPlayerData();
      fetchLeaderboards();
    }
  }, [auth]);

  const fetchPlayerData = async () => {
    if (!auth.user) return;
    
    try {
      const response = await fetch(`/api/players/${auth.user.id}`);
      const data = await response.json();
      if (data.success) {
        setPlayerData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch player data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboards = async () => {
    try {
      const response = await fetch("/api/leaderboards");
      const data = await response.json();
      if (data.success) {
        setLeaderboards(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboards:", error);
    }
  };

  const formatPlaytime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case "legend": return "text-emerald";
      case "mvp": return "text-diamond";
      case "vip": return "text-gold";
      default: return "text-muted-foreground";
    }
  };

  const getAchievementRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "border-emerald text-emerald";
      case "epic": return "border-neon-purple text-neon-purple";
      case "rare": return "border-diamond text-diamond";
      default: return "border-muted text-muted-foreground";
    }
  };

  const getPlayerRanking = (leaderboardType: string) => {
    const leaderboard = leaderboards.find(lb => lb.type === leaderboardType);
    if (!leaderboard || !playerData) return null;
    
    const playerEntry = leaderboard.entries.find(entry => 
      entry.player.username === playerData.username
    );
    
    return playerEntry ? playerEntry.rank : null;
  };

  if (!auth.isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-3xl font-bold mb-4">Player Statistics</h1>
        <p className="text-muted-foreground mb-8">Please log in to view your statistics</p>
        <Button className="btn-primary text-white font-bold">
          Login to View Stats
        </Button>
      </div>
    );
  }

  if (loading || !playerData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">Loading your statistics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-dark">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-neon-green/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center gaming-card">
                <User className="h-12 w-12 text-neon-green" />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                  <h1 className="text-4xl font-bold">{playerData.username}</h1>
                  <Badge className={`${getRankColor(playerData.rank)} border-current`}>
                    <Crown className="h-3 w-3 mr-1" />
                    {playerData.rank.toUpperCase()}
                  </Badge>
                  {playerData.isOnline && (
                    <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 animate-pulse-glow">
                      Online
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neon-green">{playerData.level}</div>
                    <div className="text-sm text-muted-foreground">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gold">₹{formatNumber(playerData.balance)}</div>
                    <div className="text-sm text-muted-foreground">Balance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-diamond">{formatPlaytime(playerData.playtime)}</div>
                    <div className="text-sm text-muted-foreground">Playtime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald">{playerData.achievements.length}</div>
                    <div className="text-sm text-muted-foreground">Achievements</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-card/50">
              <TabsTrigger value="overview" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">
                <BarChart3 className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="combat" className="data-[state=active]:bg-redstone data-[state=active]:text-black">
                <Sword className="mr-2 h-4 w-4" />
                Combat
              </TabsTrigger>
              <TabsTrigger value="building" className="data-[state=active]:bg-emerald data-[state=active]:text-black">
                <Pickaxe className="mr-2 h-4 w-4" />
                Building
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <Trophy className="mr-2 h-4 w-4" />
                Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Experience Progress */}
              <Card className="gaming-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-neon-green" />
                    Experience Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Level {playerData.level}</span>
                      <span className="text-neon-green">{formatNumber(playerData.experience)} XP</span>
                    </div>
                    <Progress 
                      value={(playerData.experience % 1000) / 10} 
                      className="h-3"
                    />
                    <div className="text-sm text-muted-foreground text-center">
                      {1000 - (playerData.experience % 1000)} XP to next level
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* General Stats */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="gaming-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-neon-green" />
                      Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Playtime</span>
                        <span className="font-semibold">{formatPlaytime(playerData.playtime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Join Date</span>
                        <span className="font-semibold">{new Date(playerData.joinDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Last Seen</span>
                        <span className="font-semibold">
                          {playerData.isOnline ? "Online now" : new Date(playerData.lastSeen).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="gaming-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-gold" />
                      Rankings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Kills Ranking</span>
                        <Badge variant="outline" className="text-neon-green">
                          #{getPlayerRanking("kills") || "N/A"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Level Ranking</span>
                        <Badge variant="outline" className="text-diamond">
                          #{getPlayerRanking("level") || "N/A"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Playtime Ranking</span>
                        <Badge variant="outline" className="text-emerald">
                          #{getPlayerRanking("playtime") || "N/A"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="gaming-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Coins className="h-5 w-5 text-gold" />
                      Economy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Current Balance</span>
                        <span className="font-semibold text-gold">₹{formatNumber(playerData.balance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Wealth Ranking</span>
                        <Badge variant="outline" className="text-gold">
                          #{getPlayerRanking("balance") || "N/A"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="combat" className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="gaming-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sword className="h-5 w-5 text-redstone" />
                      Combat Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Total Kills</span>
                        <span className="text-2xl font-bold text-redstone">{formatNumber(playerData.kills)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Total Deaths</span>
                        <span className="text-2xl font-bold text-muted-foreground">{formatNumber(playerData.deaths)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>K/D Ratio</span>
                        <span className="text-2xl font-bold text-neon-green">
                          {playerData.deaths > 0 ? (playerData.kills / playerData.deaths).toFixed(2) : playerData.kills}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="gaming-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-neon-green" />
                      Combat Ranking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-neon-green mb-2">
                          #{getPlayerRanking("kills") || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">Kill Leaderboard</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="gaming-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-diamond" />
                      Combat Efficiency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Kills per Hour</span>
                        <span className="font-semibold">
                          {((playerData.kills / (playerData.playtime / 3600)) || 0).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Survival Rate</span>
                        <span className="font-semibold">
                          {(((playerData.kills / (playerData.kills + playerData.deaths)) * 100) || 0).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="building" className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="gaming-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Pickaxe className="h-5 w-5 text-emerald" />
                      Building Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Blocks Placed</span>
                        <span className="text-2xl font-bold text-emerald">{formatNumber(playerData.blocksPlaced)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Blocks Broken</span>
                        <span className="text-2xl font-bold text-redstone">{formatNumber(playerData.blocksBroken)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Net Building</span>
                        <span className="text-2xl font-bold text-neon-green">
                          {formatNumber(playerData.blocksPlaced - playerData.blocksBroken)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="gaming-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-neon-green" />
                      Builder Ranking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-emerald mb-2">
                          #{getPlayerRanking("blocks_placed") || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">Building Leaderboard</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="gaming-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-diamond" />
                      Building Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Blocks per Hour</span>
                        <span className="font-semibold">
                          {((playerData.blocksPlaced / (playerData.playtime / 3600)) || 0).toFixed(0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Build Efficiency</span>
                        <span className="font-semibold">
                          {((playerData.blocksPlaced / (playerData.blocksPlaced + playerData.blocksBroken)) * 100 || 0).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playerData.achievements.map((achievement) => (
                  <Card key={achievement.id} className={`gaming-card border-2 ${getAchievementRarityColor(achievement.rarity)}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className={`h-5 w-5 ${getAchievementRarityColor(achievement.rarity).split(' ')[1]}`} />
                        {achievement.name}
                      </CardTitle>
                      <Badge className={`w-fit ${getAchievementRarityColor(achievement.rarity)}`}>
                        {achievement.rarity.toUpperCase()}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-2">{achievement.description}</CardDescription>
                      <div className="text-xs text-muted-foreground">
                        Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {playerData.achievements.length === 0 && (
                  <div className="col-span-full text-center py-16">
                    <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No achievements yet</h3>
                    <p className="text-muted-foreground">Start playing to unlock achievements!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
