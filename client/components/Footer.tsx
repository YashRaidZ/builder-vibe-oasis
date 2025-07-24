import { Link } from "react-router-dom";
import { Shield, Mail, MessageCircle, Users, Github, Twitter, Youtube, MapPin, Clock, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  return (
    <footer className="relative bg-gaming-dark border-t border-neon-green/20">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <Shield className="h-8 w-8 text-minecraft-green group-hover:animate-pulse-glow" />
              <span className="font-bold text-xl bg-neon-gradient bg-clip-text text-transparent">
                indusnetwork
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The ultimate Minecraft server experience with custom plugins, automated systems, 
              and a thriving community of players.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-neon-green/30 text-neon-green">
                <Server className="h-3 w-3 mr-1" />
                Online 24/7
              </Badge>
              <Badge variant="outline" className="border-gold/30 text-gold">
                <Users className="h-3 w-3 mr-1" />
                500+ Players
              </Badge>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-muted-foreground hover:text-neon-green transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/store" 
                  className="text-muted-foreground hover:text-neon-green transition-colors text-sm"
                >
                  Store
                </Link>
              </li>
              <li>
                <Link 
                  to="/stats" 
                  className="text-muted-foreground hover:text-neon-green transition-colors text-sm"
                >
                  Player Stats
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-neon-green transition-colors text-sm"
                >
                  Rules
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-neon-green transition-colors text-sm"
                >
                  Forums
                </a>
              </li>
            </ul>
          </div>

          {/* Server Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Server Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-neon-green" />
                <div>
                  <p className="text-muted-foreground">Server IP</p>
                  <code className="text-neon-green font-mono">indusnetwork.highms.pro:25826</code>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gold" />
                <div>
                  <p className="text-muted-foreground">Version</p>
                  <p className="text-foreground">1.20.x - 1.21.x</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Server className="h-4 w-4 text-neon-purple" />
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="text-foreground">India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Community & Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Community</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Discord Server
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start border-gaming-blue/30 text-gaming-blue hover:bg-gaming-blue/10"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start border-redstone/30 text-redstone hover:bg-redstone/10"
              >
                <Youtube className="h-4 w-4 mr-2" />
                YouTube
              </Button>
            </div>
            <div className="pt-2">
              <p className="text-muted-foreground text-xs mb-2">Need help?</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start border-emerald/30 text-emerald hover:bg-emerald/10"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neon-green/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-muted-foreground text-sm">
                © 2024 indusnetwork. All rights reserved.
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Not affiliated with Mojang Studios or Microsoft.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 text-xs">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-neon-green transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-neon-green transition-colors"
              >
                Terms of Service
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-neon-green transition-colors"
              >
                Refund Policy
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-neon-green transition-colors"
              >
                EULA
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-neon-gradient opacity-50" />
    </footer>
  );
}
