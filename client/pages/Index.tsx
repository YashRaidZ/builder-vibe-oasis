import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  Trophy, 
  Zap, 
  ShoppingCart, 
  BarChart3, 
  Crown,
  Sword,
  Pickaxe,
  Star,
  Play,
  Copy,
  Check
} from "lucide-react";
import { useState } from "react";

export default function Index() {
  const [copied, setCopied] = useState(false);
  
  const serverIP = "indusnetwork.highms.pro:25826";

  const copyIP = () => {
    navigator.clipboard.writeText(serverIP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-minecraft-green/10 to-transparent" />
        <div className="container relative mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-minecraft-green/20 text-minecraft-green border-minecraft-green/30">
              🚀 Now Online - Join 500+ Players
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-minecraft-green to-emerald bg-clip-text text-transparent">
              Welcome to indusnetwork
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Experience the ultimate Minecraft server with custom plugins, automated systems, 
              and a thriving community. Join thousands of players in our premium gaming environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <div className="flex items-center gap-2 bg-card rounded-lg p-4 min-w-fit">
                <code className="text-minecraft-green font-mono text-lg">{serverIP}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyIP}
                  className="h-8 w-8 p-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Button size="lg" className="bg-minecraft-gradient hover:bg-minecraft-green glow-green">
                <Play className="mr-2 h-5 w-5" />
                Join Server Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-minecraft-green mb-2">500+</div>
              <div className="text-muted-foreground">Active Players</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-gold mb-2">24/7</div>
              <div className="text-muted-foreground">Server Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-diamond mb-2">10k+</div>
              <div className="text-muted-foreground">Items Sold</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-emerald mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Server Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover what makes indusnetwork the premier destination for Minecraft players
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 hover:border-minecraft-green/50 transition-colors">
              <CardHeader>
                <Zap className="h-12 w-12 text-minecraft-green mb-4" />
                <CardTitle>Instant Delivery</CardTitle>
                <CardDescription>
                  Purchase items and receive them instantly in-game through our automated delivery system
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border/50 hover:border-gold/50 transition-colors">
              <CardHeader>
                <Crown className="h-12 w-12 text-gold mb-4" />
                <CardTitle>Premium Ranks</CardTitle>
                <CardDescription>
                  Unlock VIP, MVP, and LEGEND ranks with exclusive perks, commands, and privileges
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border/50 hover:border-diamond/50 transition-colors">
              <CardHeader>
                <Shield className="h-12 w-12 text-diamond mb-4" />
                <CardTitle>Secure Payments</CardTitle>
                <CardDescription>
                  Safe transactions through Razorpay with instant verification and delivery confirmation
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border/50 hover:border-emerald/50 transition-colors">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-emerald mb-4" />
                <CardTitle>Real-time Stats</CardTitle>
                <CardDescription>
                  Track your progress with live statistics, achievements, and leaderboards
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border/50 hover:border-redstone/50 transition-colors">
              <CardHeader>
                <Users className="h-12 w-12 text-redstone mb-4" />
                <CardTitle>Active Community</CardTitle>
                <CardDescription>
                  Join hundreds of players in events, competitions, and collaborative builds
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border/50 hover:border-iron/50 transition-colors">
              <CardHeader>
                <Trophy className="h-12 w-12 text-iron mb-4" />
                <CardTitle>Custom Content</CardTitle>
                <CardDescription>
                  Experience unique plugins, custom items, and exclusive game modes you won't find elsewhere
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Store Preview */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">indusnetwork Store</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enhance your gameplay with premium ranks, items, and cosmetics
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="relative overflow-hidden border-gold/50">
              <div className="absolute top-4 right-4">
                <Badge className="bg-gold/20 text-gold border-gold/30">Popular</Badge>
              </div>
              <CardHeader>
                <Crown className="h-12 w-12 text-gold mb-4" />
                <CardTitle className="text-gold">VIP Rank</CardTitle>
                <div className="text-3xl font-bold">₹199</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• /fly command access</li>
                  <li>• 2x XP multiplier</li>
                  <li>• Exclusive chat colors</li>
                  <li>• Priority queue access</li>
                </ul>
                <Button className="w-full mt-6 bg-gold hover:bg-gold/80">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Purchase VIP
                </Button>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden border-emerald/50">
              <CardHeader>
                <Sword className="h-12 w-12 text-emerald mb-4" />
                <CardTitle className="text-emerald">Starter Kit</CardTitle>
                <div className="text-3xl font-bold">₹99</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Diamond armor set</li>
                  <li>• Enchanted tools</li>
                  <li>• 64 Golden apples</li>
                  <li>• Building materials</li>
                </ul>
                <Button className="w-full mt-6 bg-emerald hover:bg-emerald/80">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Get Starter Kit
                </Button>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden border-diamond/50">
              <CardHeader>
                <Star className="h-12 w-12 text-diamond mb-4" />
                <CardTitle className="text-diamond">1000 Coins</CardTitle>
                <div className="text-3xl font-bold">₹149</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 1000 server coins</li>
                  <li>• Use in player shops</li>
                  <li>• Buy custom items</li>
                  <li>• Trade with players</li>
                </ul>
                <Button className="w-full mt-6 bg-diamond hover:bg-diamond/80 text-background">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Buy Coins
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-minecraft-green text-minecraft-green hover:bg-minecraft-green hover:text-white">
              View Full Store
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Begin Your Adventure?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of players in the ultimate Minecraft experience. Your journey starts now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-minecraft-gradient hover:bg-minecraft-green glow-green">
              <Play className="mr-2 h-5 w-5" />
              Join Server
            </Button>
            <Button variant="outline" size="lg" className="border-minecraft-green text-minecraft-green hover:bg-minecraft-green hover:text-white">
              <Users className="mr-2 h-5 w-5" />
              Join Discord
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
