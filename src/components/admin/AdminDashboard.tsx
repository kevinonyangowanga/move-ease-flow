import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Truck, 
  DollarSign, 
  Search,
  Eye,
  Edit,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  fromAddress: string;
  toAddress: string;
  moveDate: string;
  status: "confirmed" | "in_progress" | "completed" | "cancelled";
  estimatedValue: number;
  crew: string;
}

interface DashboardStats {
  totalBookings: number;
  todayMoves: number;
  revenue: number;
  activeCrews: number;
}

const mockBookings: Booking[] = [
  {
    id: "MV-ABC123",
    customerName: "John Smith",
    customerPhone: "(555) 123-4567",
    fromAddress: "123 Oak St, Springfield, IL",
    toAddress: "456 Pine Ave, Chicago, IL",
    moveDate: "2024-03-15",
    status: "in_progress",
    estimatedValue: 1200,
    crew: "Team Alpha"
  },
  {
    id: "MV-DEF456",
    customerName: "Sarah Johnson",
    customerPhone: "(555) 987-6543",
    fromAddress: "789 Maple Dr, Aurora, IL",
    toAddress: "321 Cedar Ln, Naperville, IL",
    moveDate: "2024-03-16",
    status: "confirmed",
    estimatedValue: 800,
    crew: "Team Beta"
  },
  {
    id: "MV-GHI789",
    customerName: "Mike Davis",
    customerPhone: "(555) 456-7890",
    fromAddress: "654 Birch Ave, Rockford, IL",
    toAddress: "987 Elm St, Peoria, IL",
    moveDate: "2024-03-14",
    status: "completed",
    estimatedValue: 1500,
    crew: "Team Gamma"
  },
  {
    id: "MV-JKL012",
    customerName: "Emily Wilson",
    customerPhone: "(555) 234-5678",
    fromAddress: "147 Willow Way, Joliet, IL",
    toAddress: "258 Ash Blvd, Elgin, IL",
    moveDate: "2024-03-17",
    status: "confirmed",
    estimatedValue: 950,
    crew: "Team Alpha"
  }
];

const mockStats: DashboardStats = {
  totalBookings: 45,
  todayMoves: 3,
  revenue: 28500,
  activeCrews: 4
};

export const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Calendar className="h-4 w-4" />;
      case "in_progress":
        return <Truck className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateBookingStatus = (bookingId: string, newStatus: Booking["status"]) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ));
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-medium bg-gradient-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <p className="text-3xl font-bold text-primary">{mockStats.totalBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-medium bg-gradient-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Moves</p>
                <p className="text-3xl font-bold text-secondary">{mockStats.todayMoves}</p>
              </div>
              <Truck className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-medium bg-gradient-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-3xl font-bold text-accent">${mockStats.revenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-medium bg-gradient-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Crews</p>
                <p className="text-3xl font-bold text-primary">{mockStats.activeCrews}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="crews">Crews</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-6">
          <Card className="shadow-large bg-gradient-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Booking Management
              </CardTitle>
              <CardDescription>
                Manage and track all customer bookings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="search">Search Bookings</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Filter by Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bookings Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Move Date</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Crew</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.customerName}</p>
                            <p className="text-sm text-muted-foreground">{booking.customerPhone}</p>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(booking.moveDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">{booking.fromAddress.split(',')[0]}</p>
                            <p className="text-muted-foreground">to {booking.toAddress.split(',')[0]}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusIcon(booking.status)}
                            {booking.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>${booking.estimatedValue}</TableCell>
                        <TableCell>{booking.crew}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <a href={`tel:${booking.customerPhone}`}>
                                <Phone className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details Modal */}
          {selectedBooking && (
            <Card className="shadow-large bg-gradient-card border-0">
              <CardHeader>
                <CardTitle>Booking Details - {selectedBooking.id}</CardTitle>
                <CardDescription>
                  Detailed information and status management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer Information</Label>
                    <div className="p-3 border rounded">
                      <p className="font-medium">{selectedBooking.customerName}</p>
                      <p className="text-sm text-muted-foreground">{selectedBooking.customerPhone}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Move Date & Crew</Label>
                    <div className="p-3 border rounded">
                      <p className="font-medium">{new Date(selectedBooking.moveDate).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">{selectedBooking.crew}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>From Address</Label>
                    <div className="p-3 border rounded">
                      <p className="text-sm">{selectedBooking.fromAddress}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>To Address</Label>
                    <div className="p-3 border rounded">
                      <p className="text-sm">{selectedBooking.toAddress}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateBookingStatus(selectedBooking.id, "confirmed")}
                  >
                    Mark Confirmed
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateBookingStatus(selectedBooking.id, "in_progress")}
                  >
                    Start Move
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateBookingStatus(selectedBooking.id, "completed")}
                  >
                    Complete Move
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedBooking(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="schedule">
          <Card className="shadow-large bg-gradient-card border-0">
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>
                Overview of today's moving schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings
                  .filter(booking => booking.moveDate === "2024-03-15")
                  .map(booking => (
                    <div key={booking.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{booking.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.fromAddress} → {booking.toAddress}
                        </p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      <p className="font-medium">{booking.crew}</p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crews">
          <Card className="shadow-large bg-gradient-card border-0">
            <CardHeader>
              <CardTitle>Crew Management</CardTitle>
              <CardDescription>
                Manage moving crews and assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {["Team Alpha", "Team Beta", "Team Gamma", "Team Delta"].map((team) => (
                  <Card key={team} className="border">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">{team}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Status: {team === "Team Alpha" ? "Active" : "Available"}
                      </p>
                      <p className="text-sm">
                        Current: {team === "Team Alpha" ? "John Smith Move" : "Standby"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="shadow-large bg-gradient-card border-0">
            <CardHeader>
              <CardTitle>Analytics & Reports</CardTitle>
              <CardDescription>
                Business performance and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Monthly Performance</h3>
                  <div className="p-4 border rounded">
                    <p>Total Moves: 42</p>
                    <p>Revenue: $28,500</p>
                    <p>Customer Satisfaction: 4.8/5</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Popular Routes</h3>
                  <div className="p-4 border rounded">
                    <p>Chicago ↔ Springfield: 12 moves</p>
                    <p>Aurora ↔ Naperville: 8 moves</p>
                    <p>Rockford ↔ Peoria: 6 moves</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};