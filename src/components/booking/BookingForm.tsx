import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, User, MapPin, CreditCard, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookingData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Move Details
  fromAddress: string;
  fromCity: string;
  fromState: string;
  fromZip: string;
  toAddress: string;
  toCity: string;
  toState: string;
  toZip: string;
  
  // Schedule
  moveDate: string;
  timeSlot: string;
  
  // Services
  homeSize: string;
  services: string[];
  specialInstructions: string;
  
  // Payment
  paymentMethod: string;
  agreeToTerms: boolean;
}

export const BookingForm = () => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    fromAddress: "",
    fromCity: "",
    fromState: "",
    fromZip: "",
    toAddress: "",
    toCity: "",
    toState: "",
    toZip: "",
    moveDate: "",
    timeSlot: "",
    homeSize: "",
    services: [],
    specialInstructions: "",
    paymentMethod: "",
    agreeToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const { toast } = useToast();

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const timeSlots = [
    "8:00 AM - 12:00 PM",
    "12:00 PM - 4:00 PM", 
    "4:00 PM - 8:00 PM",
    "Flexible"
  ];

  const homeSizes = [
    "Studio/1BR",
    "2 Bedroom",
    "3 Bedroom", 
    "4+ Bedroom",
    "Office"
  ];

  const services = [
    { id: "packing", label: "Full Packing Service" },
    { id: "unpacking", label: "Unpacking Service" },
    { id: "storage", label: "Temporary Storage" },
    { id: "insurance", label: "Extra Insurance" },
    { id: "disassembly", label: "Furniture Disassembly/Assembly" }
  ];

  const handleInputChange = (field: keyof BookingData, value: string | boolean) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setBookingData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const submitBooking = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const generatedId = "MV-" + Math.random().toString(36).substr(2, 9).toUpperCase();
      setBookingId(generatedId);
      setIsBooked(true);
      setIsSubmitting(false);
      
      toast({
        title: "Booking Confirmed!",
        description: `Your booking ID is ${generatedId}`,
      });
    }, 2000);
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (isBooked) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-large bg-gradient-card border-0 text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-secondary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Your move has been successfully scheduled.
            </p>
            <div className="bg-primary/5 p-4 rounded-lg mb-6">
              <p className="font-semibold">Booking ID: {bookingId}</p>
              <p className="text-sm text-muted-foreground">Save this ID for tracking your move</p>
            </div>
            <div className="space-y-2 text-left mb-6">
              <p><strong>Date:</strong> {bookingData.moveDate}</p>
              <p><strong>Time:</strong> {bookingData.timeSlot}</p>
              <p><strong>From:</strong> {bookingData.fromAddress}, {bookingData.fromCity}</p>
              <p><strong>To:</strong> {bookingData.toAddress}, {bookingData.toCity}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button variant="hero" asChild>
                <a href="/tracking">Track Your Move</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/">Back to Home</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-large bg-gradient-card border-0">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <CalendarDays className="h-6 w-6 text-primary" />
            Book Your Move
          </CardTitle>
          <CardDescription>
            Complete your booking in {totalSteps} easy steps
          </CardDescription>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {step} of {totalSteps}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-6">
                <User className="h-12 w-12 text-primary mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <p className="text-muted-foreground">Tell us who you are</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={bookingData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={bookingData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={bookingData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-6">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Moving Details</h3>
                <p className="text-muted-foreground">Where are you moving from and to?</p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-primary">From Address</h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Street Address"
                    value={bookingData.fromAddress}
                    onChange={(e) => handleInputChange("fromAddress", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="City"
                    value={bookingData.fromCity}
                    onChange={(e) => handleInputChange("fromCity", e.target.value)}
                  />
                  <Input
                    placeholder="State"
                    value={bookingData.fromState}
                    onChange={(e) => handleInputChange("fromState", e.target.value)}
                  />
                  <Input
                    placeholder="Zip"
                    value={bookingData.fromZip}
                    onChange={(e) => handleInputChange("fromZip", e.target.value)}
                  />
                </div>
                
                <h4 className="font-semibold text-primary pt-4">To Address</h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Street Address"
                    value={bookingData.toAddress}
                    onChange={(e) => handleInputChange("toAddress", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="City"
                    value={bookingData.toCity}
                    onChange={(e) => handleInputChange("toCity", e.target.value)}
                  />
                  <Input
                    placeholder="State"
                    value={bookingData.toState}
                    onChange={(e) => handleInputChange("toState", e.target.value)}
                  />
                  <Input
                    placeholder="Zip"
                    value={bookingData.toZip}
                    onChange={(e) => handleInputChange("toZip", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-6">
                <CalendarDays className="h-12 w-12 text-primary mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Schedule & Services</h3>
                <p className="text-muted-foreground">When and what services do you need?</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="moveDate">Moving Date</Label>
                  <Input
                    id="moveDate"
                    type="date"
                    value={bookingData.moveDate}
                    onChange={(e) => handleInputChange("moveDate", e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Time Slot</Label>
                  <Select value={bookingData.timeSlot} onValueChange={(value) => handleInputChange("timeSlot", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Home Size</Label>
                  <Select value={bookingData.homeSize} onValueChange={(value) => handleInputChange("homeSize", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select home size" />
                    </SelectTrigger>
                    <SelectContent>
                      {homeSizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label>Additional Services</Label>
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={service.id}
                        checked={bookingData.services.includes(service.id)}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                      />
                      <Label htmlFor={service.id} className="text-sm">
                        {service.label}
                      </Label>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Any special requirements or instructions..."
                    value={bookingData.specialInstructions}
                    onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-6">
                <CreditCard className="h-12 w-12 text-primary mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Payment & Confirmation</h3>
                <p className="text-muted-foreground">Review and confirm your booking</p>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold">Booking Summary</h4>
                <p><strong>Name:</strong> {bookingData.firstName} {bookingData.lastName}</p>
                <p><strong>Date:</strong> {bookingData.moveDate} at {bookingData.timeSlot}</p>
                <p><strong>From:</strong> {bookingData.fromAddress}, {bookingData.fromCity}</p>
                <p><strong>To:</strong> {bookingData.toAddress}, {bookingData.toCity}</p>
                <p><strong>Home Size:</strong> {bookingData.homeSize}</p>
                {bookingData.services.length > 0 && (
                  <p><strong>Services:</strong> {bookingData.services.length} additional service(s)</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={bookingData.paymentMethod} onValueChange={(value) => handleInputChange("paymentMethod", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="cash">Cash on Delivery</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={bookingData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions
                </Label>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            <div className="flex-1" />
            {step < totalSteps ? (
              <Button onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button 
                onClick={submitBooking}
                disabled={isSubmitting || !bookingData.agreeToTerms}
                variant="hero"
                size="lg"
              >
                {isSubmitting ? "Processing..." : "Confirm Booking"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};