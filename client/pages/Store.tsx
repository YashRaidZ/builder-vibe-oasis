import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Crown, 
  Sword, 
  Coins, 
  Sparkles, 
  Package,
  ShoppingCart, 
  Search,
  Filter,
  Star,
  Zap,
  Gift,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { StoreItem, Purchase } from "../../shared/types";
import { useAuth } from "@/hooks/useAuth";
import { images, getPackImage, getRankImage } from "@/lib/images";

const categoryIcons = {
  ranks: Crown,
  items: Package,
  currency: Coins,
  cosmetics: Sparkles,
  kits: Sword
};

const categoryColors = {
  ranks: "text-gold",
  items: "text-emerald", 
  currency: "text-neon-green",
  cosmetics: "text-neon-purple",
  kits: "text-diamond"
};

export default function Store() {
  const { auth } = useAuth();
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<StoreItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [purchaseModal, setPurchaseModal] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<{ success: boolean; message: string } | null>(null);
  const [userPurchases, setUserPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoreItems();
    if (auth.isAuthenticated) {
      fetchUserPurchases();
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    filterItems();
  }, [storeItems, selectedCategory, searchQuery]);

  const fetchStoreItems = async () => {
    try {
      const response = await fetch("/api/store/items");
      const data = await response.json();
      if (data.success) {
        setStoreItems(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch store items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPurchases = async () => {
    if (!auth.user) return;
    
    try {
      const response = await fetch(`/api/store/purchases?playerId=${auth.user.id}`);
      const data = await response.json();
      if (data.success) {
        setUserPurchases(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch user purchases:", error);
    }
  };

  const filterItems = () => {
    let filtered = storeItems;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const handlePurchase = async () => {
    if (!selectedItem || !auth.user) return;

    setPurchasing(true);
    setPurchaseResult(null);

    try {
      const response = await fetch("/api/store/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
        },
        body: JSON.stringify({
          itemId: selectedItem.id,
          playerId: auth.user.id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setPurchaseResult({ success: true, message: "Purchase successful! Item will be delivered shortly." });
        fetchUserPurchases(); // Refresh purchase history
      } else {
        setPurchaseResult({ success: false, message: data.error || "Purchase failed" });
      }
    } catch (error) {
      setPurchaseResult({ success: false, message: "Network error occurred" });
    } finally {
      setPurchasing(false);
    }
  };

  const getItemIcon = (item: StoreItem) => {
    switch (item.type) {
      case "rank": return Crown;
      case "item_bundle": return Package;
      case "currency": return Coins;
      case "cosmetic": return Sparkles;
      case "kit": return Sword;
      default: return Gift;
    }
  };

  const getItemImage = (item: StoreItem) => {
    switch (item.type) {
      case "rank":
        return getRankImage(item.id.split('-')[0]); // vip-rank -> vip
      case "kit":
      case "item_bundle":
        return getPackImage(item.id);
      case "currency":
        return images.ui.coins;
      default:
        return null;
    }
  };

  const getPurchaseStatus = (itemId: string) => {
    const purchase = userPurchases.find(p => p.itemId === itemId);
    return purchase?.status;
  };

  const getPurchaseStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-neon-green" />;
      case "pending": return <Clock className="h-4 w-4 text-gold" />;
      case "failed": return <XCircle className="h-4 w-4 text-redstone" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">Loading store...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-dark">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-neon-green/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-blue-purple-gradient bg-clip-text text-transparent">
              indusnetwork Store
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enhance your gaming experience with premium ranks, exclusive items, and powerful upgrades
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card/50 border-border/50"
                />
              </div>
              <Button variant="outline" className="border-primary-blue/30 text-primary-blue">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Store Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8 bg-card/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary-blue data-[state=active]:text-white">
                All Items
              </TabsTrigger>
              <TabsTrigger value="ranks" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <Crown className="mr-2 h-4 w-4" />
                Ranks
              </TabsTrigger>
              <TabsTrigger value="kits" className="data-[state=active]:bg-emerald data-[state=active]:text-black">
                <Sword className="mr-2 h-4 w-4" />
                Kits
              </TabsTrigger>
              <TabsTrigger value="currency" className="data-[state=active]:bg-primary-blue data-[state=active]:text-white">
                <Coins className="mr-2 h-4 w-4" />
                Currency
              </TabsTrigger>
              <TabsTrigger value="cosmetics" className="data-[state=active]:bg-primary-purple data-[state=active]:text-white">
                <Sparkles className="mr-2 h-4 w-4" />
                Cosmetics
              </TabsTrigger>
              <TabsTrigger value="items" className="data-[state=active]:bg-diamond data-[state=active]:text-black">
                <Package className="mr-2 h-4 w-4" />
                Items
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory} className="space-y-8">
              {/* Popular Items */}
              {selectedCategory === "all" && (
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="h-6 w-6 text-neon-green" />
                    <h2 className="text-2xl font-bold">Popular Items</h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {storeItems.filter(item => item.popular).map((item) => {
                      const Icon = getItemIcon(item);
                      const purchaseStatus = getPurchaseStatus(item.id);
                      
                      return (
                        <Card key={item.id} className="gaming-card group relative overflow-hidden">
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-primary-blue/20 text-primary-blue border-primary-blue/30 glow-blue">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          </div>
                          
                          {purchaseStatus && (
                            <div className="absolute top-4 left-4">
                              {getPurchaseStatusIcon(purchaseStatus)}
                            </div>
                          )}

                          <CardHeader>
                            <div className="flex items-center justify-center mb-4">
                              {getItemImage(item) ? (
                                <img
                                  src={getItemImage(item)!}
                                  alt={item.name}
                                  className="h-16 w-16 group-hover:animate-pulse-glow"
                                />
                              ) : (
                                <Icon className={`h-12 w-12 ${categoryColors[item.category]} group-hover:animate-pulse-glow`} />
                              )}
                            </div>
                            <CardTitle className="text-xl">{item.name}</CardTitle>
                            <div className="text-3xl font-bold text-primary-blue">₹{item.price}</div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="mb-4 text-sm">
                              {item.description}
                            </CardDescription>
                            <Button 
                              className="w-full btn-primary text-white font-bold"
                              onClick={() => {
                                setSelectedItem(item);
                                setPurchaseModal(true);
                              }}
                              disabled={!auth.isAuthenticated || purchaseStatus === "completed"}
                            >
                              {purchaseStatus === "completed" ? "Owned" : 
                               !auth.isAuthenticated ? "Login to Purchase" : "Purchase"}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* All Items Grid */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {selectedCategory === "all" ? "All Items" : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`}
                  </h2>
                  <div className="text-muted-foreground">
                    {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredItems.map((item) => {
                    const Icon = getItemIcon(item);
                    const purchaseStatus = getPurchaseStatus(item.id);
                    
                    return (
                      <Card key={item.id} className="gaming-card group relative overflow-hidden">
                        {item.popular && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                              Popular
                            </Badge>
                          </div>
                        )}
                        
                        {purchaseStatus && (
                          <div className="absolute top-4 left-4">
                            {getPurchaseStatusIcon(purchaseStatus)}
                          </div>
                        )}

                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-center mb-2">
                            {getItemImage(item) ? (
                              <img
                                src={getItemImage(item)!}
                                alt={item.name}
                                className="h-12 w-12 group-hover:animate-float"
                              />
                            ) : (
                              <Icon className={`h-10 w-10 ${categoryColors[item.category]} group-hover:animate-float`} />
                            )}
                          </div>
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <div className="text-2xl font-bold text-primary-blue">₹{item.price}</div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="mb-4 text-xs line-clamp-2">
                            {item.description}
                          </CardDescription>
                          <Button 
                            size="sm"
                            className="w-full bg-blue-purple-gradient hover:glow-blue text-white font-bold"
                            onClick={() => {
                              setSelectedItem(item);
                              setPurchaseModal(true);
                            }}
                            disabled={!auth.isAuthenticated || purchaseStatus === "completed"}
                          >
                            {purchaseStatus === "completed" ? "Owned" : 
                             !auth.isAuthenticated ? "Login Required" : "Buy Now"}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {filteredItems.length === 0 && (
                  <div className="text-center py-16">
                    <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No items found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or category filter</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Purchase Modal */}
      <Dialog open={purchaseModal} onOpenChange={setPurchaseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-neon-green" />
              Confirm Purchase
            </DialogTitle>
            <DialogDescription>
              Review your purchase details before proceeding
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <Card className="border-neon-green/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {(() => {
                      const Icon = getItemIcon(selectedItem);
                      return <Icon className={`h-12 w-12 ${categoryColors[selectedItem.category]}`} />;
                    })()}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{selectedItem.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{selectedItem.description}</p>
                      <div className="text-2xl font-bold text-neon-green">₹{selectedItem.price}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {purchaseResult && (
                <Alert variant={purchaseResult.success ? "default" : "destructive"}>
                  <AlertDescription>{purchaseResult.message}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setPurchaseModal(false)}
                  disabled={purchasing}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 btn-primary text-white font-bold"
                  onClick={handlePurchase}
                  disabled={purchasing || !auth.isAuthenticated}
                >
                  {purchasing ? (
                    <>
                      <Zap className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Purchase ₹{selectedItem.price}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
