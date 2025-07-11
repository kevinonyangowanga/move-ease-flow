import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Package, Truck, MapPin, CheckCircle, Clock, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TrackingData {
  orderId: string;
  status: "confirmed" | "preparation" | "in_transit" | "delivered";
  customerName: string;
  moveDate: string;
  fromAddress: string;
  toAddress: string;
  estimatedArrival: string;
  currentLocation: string;
  crew: {
    name: string;
    phone: string;
  };
  timeline: {
    status: string;
    description: string;
    timestamp: string;
    completed: boolean;
  }[];
}

const mockTrackingData: TrackingData = {
  orderId: "MV-ABC123DEF",
  status: "in_transit",
  customerName: "John Smith",
  moveDate: "March 15, 2024",
  fromAddress: "123 Oak Street, Springfield, IL",
  toAddress: "456 Pine Avenue, Chicago, IL",
  estimatedArrival: "2:30 PM",
  currentLocation: "Route 55, 45 miles from destination",
  crew: {
    name: "Mike Johnson",
    phone: "(555) 987-6543"
  },
  timeline: [
    {
      status: "Booking Confirmed",
      description: "Your move has been scheduled and confirmed",
      timestamp: "March 10, 2024 - 10:30 AM",
      completed: true
    },
    {
      status: "Crew Assigned",
      description: "Professional moving crew assigned to your move",
      timestamp: "March 12, 2024 - 2:15 PM", 
      completed: true
    },
    {
      status: "Packing Started",
      description: "Crew arrived and began packing your items",
      timestamp: "March 15, 2024 - 8:00 AM",
      completed: true
    },
    {
      status: "In Transit",
      description: "Your items are currently being transported",
      timestamp: "March 15, 2024 - 11:30 AM",
      completed: true
    },
    {
      status: "Out for Delivery",
      description: "Crew is en route to your destination",
      timestamp: "Expected: March 15, 2024 - 2:30 PM",
      completed: false
    },
    {
      status: "Delivered",
      description: "Move completed successfully",
      timestamp: "Expected: March 15, 2024 - 5:00 PM",
      completed: false
    }
  ]
};

export const OrderTracking = () => {
  const [searchId, setSearchId] = useState("");
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!searchId.trim()) {
      toast({
        title: "Please enter a tracking ID",
        description: "Enter your booking ID to track your move",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate API search
    setTimeout(() => {
      if (searchId.toUpperCase().includes("MV-") || searchId === "demo") {
        setTrackingData(mockTrackingData);
        toast({
          title: "Order Found!",
          description: "Your move details have been loaded",
        });
      } else {
        toast({
          title: "Order Not Found",
          description: "Please check your booking ID and try again",
          variant: "destructive"
        });
      }
      setIsSearching(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparation":
        return "bg-yellow-100 text-yellow-800";
      case "in_transit":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case "confirmed":
        return 25;
      case "preparation":
        return 50;
      case "in_transit":
        return 75;
      case "delivered":
        return 100;
      default:
        return 0;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case "preparation":
        return <Package className="h-5 w-5 text-yellow-600" />;
      case "in_transit":
        return <Truck className="h-5 w-5 text-orange-600" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Section */}
      <Card className="shadow-large bg-gradient-card border-0">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Search className="h-6 w-6 text-primary" />
            Track Your Move
          </CardTitle>
          <CardDescription>
            Enter your booking ID to get real-time updates on your move
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 max-w-md mx-auto">
            <div className="flex-1 space-y-2">
              <Label htmlFor="trackingId">Booking ID</Label>
              <Input
                id="trackingId"
                placeholder="MV-ABC123DEF or 'demo'"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSearch}
                disabled={isSearching}
                variant="hero"
              >
                {isSearching ? "Searching..." : "Track"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Results */}
      {trackingData && (
        <div className="space-y-6 animate-fade-in">
          {/* Status Overview */}
          <Card className="shadow-medium bg-gradient-card border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Order #{trackingData.orderId}</CardTitle>
                  <CardDescription>{trackingData.customerName}</CardDescription>
                </div>
                <Badge className={getStatusColor(trackingData.status)}>
                  {getStatusIcon(trackingData.status)}
                  {trackingData.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">FROM</p>
                  <p className="font-medium">{trackingData.fromAddress}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">TO</p>
                  <p className="font-medium">{trackingData.toAddress}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">MOVE DATE</p>
                  <p className="font-medium">{trackingData.moveDate}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">ESTIMATED ARRIVAL</p>
                  <p className="font-medium">{trackingData.estimatedArrival}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Progress</p>
                  <p className="text-sm text-muted-foreground">{getStatusProgress(trackingData.status)}%</p>
                </div>
                <Progress value={getStatusProgress(trackingData.status)} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Current Status */}
          {trackingData.status === "in_transit" && (
            <Card className="shadow-medium bg-gradient-primary text-primary-foreground border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Truck className="h-8 w-8" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Currently In Transit</h3>
                    <p className="opacity-90">{trackingData.currentLocation}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-75">Crew Leader</p>
                    <p className="font-medium">{trackingData.crew.name}</p>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="mt-2"
                      asChild
                    >
                      <a href={`tel:${trackingData.crew.phone}`}>
                        <Phone className="h-4 w-4 mr-1" />
                        Call Crew
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card className="shadow-medium bg-gradient-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Move Timeline
              </CardTitle>
              <CardDescription>
                Detailed progress of your move
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trackingData.timeline.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`p-2 rounded-full ${
                        item.completed 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {item.completed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      {index < trackingData.timeline.length - 1 && (
                        <div className={`w-0.5 h-12 ${
                          item.completed ? "bg-primary" : "bg-muted"
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <h4 className={`font-medium ${
                        item.completed ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {item.status}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-1">
                        {item.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="shadow-medium bg-gradient-card border-0">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="outline" asChild>
                  <a href={`tel:${trackingData.crew.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Crew
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/booking">
                    Book Another Move
                  </a>
                </Button>
                <Button variant="secondary" asChild>
                  <a href="/">
                    Back to Home
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};