import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Calculator, MapPin, Home, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuoteData {
  fromZip: string;
  toZip: string;
  homeSize: string;
  moveDate: string;
  distance: number;
  services: string[];
}

export const QuoteCalculator = () => {
  const [step, setStep] = useState(1);
  const [quoteData, setQuoteData] = useState<QuoteData>({
    fromZip: "",
    toZip: "",
    homeSize: "",
    moveDate: "",
    distance: 0,
    services: []
  });
  const [quote, setQuote] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const homeSizes = [
    { value: "studio", label: "Studio/1BR", multiplier: 1 },
    { value: "2br", label: "2 Bedroom", multiplier: 1.5 },
    { value: "3br", label: "3 Bedroom", multiplier: 2 },
    { value: "4br", label: "4+ Bedroom", multiplier: 2.5 },
    { value: "office", label: "Office", multiplier: 1.2 }
  ];

  const additionalServices = [
    { id: "packing", label: "Full Packing Service", price: 300 },
    { id: "unpacking", label: "Unpacking Service", price: 200 },
    { id: "storage", label: "Temporary Storage", price: 150 },
    { id: "insurance", label: "Extra Insurance", price: 100 },
    { id: "disassembly", label: "Furniture Disassembly/Assembly", price: 250 }
  ];

  const calculateDistance = (fromZip: string, toZip: string) => {
    // Simplified distance calculation (in real app, use Google Maps API)
    const distance = Math.abs(parseInt(fromZip) - parseInt(toZip)) * 0.1;
    return Math.max(distance, 10); // Minimum 10 miles
  };

  const calculateQuote = () => {
    setLoading(true);
    
    setTimeout(() => {
      const distance = calculateDistance(quoteData.fromZip, quoteData.toZip);
      const homeSize = homeSizes.find(size => size.value === quoteData.homeSize);
      const baseCost = 500;
      const distanceCost = distance * 2.5;
      const sizeCost = baseCost * (homeSize?.multiplier || 1);
      const servicesCost = quoteData.services.reduce((total, serviceId) => {
        const service = additionalServices.find(s => s.id === serviceId);
        return total + (service?.price || 0);
      }, 0);

      const totalQuote = Math.round(baseCost + distanceCost + sizeCost + servicesCost);
      setQuote(totalQuote);
      setQuoteData(prev => ({ ...prev, distance }));
      setLoading(false);
      
      toast({
        title: "Quote Calculated!",
        description: `Your estimated moving cost is $${totalQuote}`,
      });
    }, 2000);
  };

  const handleServiceToggle = (serviceId: string) => {
    setQuoteData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      calculateQuote();
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-large bg-gradient-card border-0">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Calculator className="h-6 w-6 text-primary" />
            Moving Quote Calculator
          </CardTitle>
          <CardDescription>
            Get an instant estimate for your move in {totalSteps} easy steps
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
                <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Where are you moving?</h3>
                <p className="text-muted-foreground">Enter your origin and destination zip codes</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromZip">From Zip Code</Label>
                  <Input
                    id="fromZip"
                    placeholder="12345"
                    value={quoteData.fromZip}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, fromZip: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toZip">To Zip Code</Label>
                  <Input
                    id="toZip"
                    placeholder="67890"
                    value={quoteData.toZip}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, toZip: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-6">
                <Home className="h-12 w-12 text-primary mx-auto mb-2" />
                <h3 className="text-lg font-semibold">What size home are you moving?</h3>
                <p className="text-muted-foreground">Select the size that best describes your current home</p>
              </div>
              
              <Select value={quoteData.homeSize} onValueChange={(value) => setQuoteData(prev => ({ ...prev, homeSize: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select home size" />
                </SelectTrigger>
                <SelectContent>
                  {homeSizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-6">
                <Calendar className="h-12 w-12 text-primary mx-auto mb-2" />
                <h3 className="text-lg font-semibold">When do you want to move?</h3>
                <p className="text-muted-foreground">Select your preferred moving date</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="moveDate">Moving Date</Label>
                <Input
                  id="moveDate"
                  type="date"
                  value={quoteData.moveDate}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, moveDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-6">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Additional Services</h3>
                <p className="text-muted-foreground">Select any additional services you need</p>
              </div>
              
              <div className="space-y-3">
                {additionalServices.map((service) => (
                  <div key={service.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Checkbox
                      id={service.id}
                      checked={quoteData.services.includes(service.id)}
                      onCheckedChange={() => handleServiceToggle(service.id)}
                    />
                    <div className="flex-1">
                      <label htmlFor={service.id} className="text-sm font-medium cursor-pointer">
                        {service.label}
                      </label>
                      <p className="text-sm text-muted-foreground">+${service.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {quote && (
            <div className="text-center p-6 bg-gradient-primary rounded-lg text-primary-foreground animate-fade-in">
              <h3 className="text-2xl font-bold mb-2">Your Estimated Quote</h3>
              <p className="text-4xl font-bold mb-2">${quote}</p>
              <p className="text-sm opacity-90">
                Distance: {quoteData.distance.toFixed(0)} miles • Services: {quoteData.services.length}
              </p>
              <Button variant="secondary" size="lg" className="mt-4" asChild>
                <a href="/booking">Book Your Move</a>
              </Button>
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
              <Button 
                onClick={nextStep}
                disabled={
                  (step === 1 && (!quoteData.fromZip || !quoteData.toZip)) ||
                  (step === 2 && !quoteData.homeSize) ||
                  (step === 3 && !quoteData.moveDate)
                }
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={calculateQuote}
                disabled={loading}
                variant="hero"
                size="lg"
              >
                {loading ? "Calculating..." : "Get Quote"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};