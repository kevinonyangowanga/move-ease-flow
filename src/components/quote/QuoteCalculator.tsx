import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calculator, Plus, Minus, MapPin, Calendar as CalendarIcon, DollarSign, Package, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Item {
  id: string;
  name: string;
  category: 'furniture' | 'boxes' | 'appliances' | 'fragile' | 'other';
  quantity: number;
  weight: number;
  volume: number;
  fragile: boolean;
  requiresDisassembly: boolean;
}

export const QuoteCalculator = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [quote, setQuote] = useState({
    moveType: 'local' as const,
    originAddress: '',
    destinationAddress: '',
    moveDate: null as Date | null,
    items: [] as Item[],
    services: {
      packing: false,
      storage: false,
      rush: false,
    },
    totalWeight: 0,
    totalVolume: 0,
    distance: 0,
    basePrice: 0,
    servicesPrice: 0,
    totalPrice: 0,
  });

  const totalSteps = 4;

  const commonItems = [
    { name: "Sofa", category: "furniture" as const, weight: 100, volume: 40, fragile: false, requiresDisassembly: false },
    { name: "Dining Table", category: "furniture" as const, weight: 80, volume: 30, fragile: false, requiresDisassembly: true },
    { name: "TV (Large)", category: "appliances" as const, weight: 40, volume: 15, fragile: true, requiresDisassembly: false },
    { name: "Refrigerator", category: "appliances" as const, weight: 250, volume: 60, fragile: false, requiresDisassembly: false },
    { name: "Boxes (Medium)", category: "boxes" as const, weight: 30, volume: 8, fragile: false, requiresDisassembly: false },
  ];

  useEffect(() => {
    calculatePrice();
  }, [quote.moveType, quote.distance, quote.items, quote.services, quote.moveDate]);

  const calculatePrice = () => {
    const baseRates = { local: 120, long_distance: 1.25, international: 3.0 };
    const totalWeight = quote.items.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
    const totalVolume = quote.items.reduce((sum, item) => sum + (item.volume * item.quantity), 0);
    
    let basePrice = 0;
    if (quote.moveType === 'local') {
      basePrice = baseRates.local * Math.ceil(totalVolume / 100);
    } else {
      basePrice = quote.distance * baseRates[quote.moveType];
    }

    let servicesPrice = 0;
    if (quote.services.packing) servicesPrice += 50 * quote.items.length;
    if (quote.services.storage) servicesPrice += 150;
    if (quote.services.rush) basePrice *= 1.25;

    const fragileItems = quote.items.filter(item => item.fragile);
    servicesPrice += fragileItems.length * 25;

    const disassemblyItems = quote.items.filter(item => item.requiresDisassembly);
    servicesPrice += disassemblyItems.length * 75;

    if (quote.moveDate && (quote.moveDate.getDay() === 0 || quote.moveDate.getDay() === 6)) {
      basePrice *= 1.15;
    }

    const totalPrice = basePrice + servicesPrice;

    setQuote(prev => ({
      ...prev,
      totalWeight,
      totalVolume,
      basePrice,
      servicesPrice,
      totalPrice,
    }));
  };

  const addItem = (itemData: Omit<Item, "id" | "quantity">) => {
    const newItem: Item = {
      id: Math.random().toString(36).substr(2, 9),
      ...itemData,
      quantity: 1,
    };
    setQuote(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const updateItemQuantity = (id: string, change: number) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as Item[]
    }));
  };

  const saveQuote = async () => {
    if (!user) {
      toast.error("Please sign in to save your quote");
      return;
    }

    setSaving(true);
    try {
      const orderNumber = `MV${Date.now().toString().slice(-8)}`;
      
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          move_type: quote.moveType,
          origin_address: quote.originAddress,
          destination_address: quote.destinationAddress,
          distance_miles: quote.distance,
          move_date: quote.moveDate?.toISOString().split('T')[0],
          move_time: '09:00:00',
          base_price: quote.basePrice,
          additional_services_price: quote.servicesPrice,
          total_price: quote.totalPrice,
        })
        .select()
        .single();

      if (error) throw error;

      if (quote.items.length > 0) {
        const orderItems = quote.items.map(item => ({
          order_id: order.id,
          category: item.category,
          name: item.name,
          quantity: item.quantity,
          weight_lbs: item.weight,
          volume_cubic_ft: item.volume,
          fragile: item.fragile,
          requires_disassembly: item.requiresDisassembly,
        }));

        await supabase.from('order_items').insert(orderItems);
      }

      toast.success("Quote saved successfully!");
    } catch (error: any) {
      toast.error("Failed to save quote: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="mr-2 h-5 w-5" />
            Get Your Moving Quote
          </CardTitle>
          <CardDescription>
            Step {step} of {totalSteps}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={(step / totalSteps) * 100} className="w-full" />
        </CardContent>
      </Card>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Moving Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Type of Move</Label>
              <Select value={quote.moveType} onValueChange={(value: any) => setQuote(prev => ({ ...prev, moveType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local Move</SelectItem>
                  <SelectItem value="long_distance">Long Distance</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Address</Label>
                <Input
                  placeholder="Enter origin address"
                  value={quote.originAddress}
                  onChange={(e) => setQuote(prev => ({ ...prev, originAddress: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>To Address</Label>
                <Input
                  placeholder="Enter destination address"
                  value={quote.destinationAddress}
                  onChange={(e) => setQuote(prev => ({ ...prev, destinationAddress: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Move Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {quote.moveDate ? format(quote.moveDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={quote.moveDate || undefined}
                    onSelect={(date) => setQuote(prev => ({ ...prev, moveDate: date || null }))}
                    disabled={(date) => date < new Date()}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button onClick={nextStep} disabled={!quote.originAddress || !quote.destinationAddress}>
              Continue
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Add Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {commonItems.map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => addItem(item)}
                  className="h-auto p-3 text-left justify-start"
                >
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.weight}lbs • {item.volume}ft³
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            {quote.items.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Selected Items:</h4>
                {quote.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                    <span>{item.name}</span>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => updateItemQuantity(item.id, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button size="sm" variant="outline" onClick={() => updateItemQuantity(item.id, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={prevStep}>Previous</Button>
              <Button onClick={nextStep} disabled={quote.items.length === 0}>Continue</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={quote.services.packing}
                  onCheckedChange={(checked) => 
                    setQuote(prev => ({ ...prev, services: { ...prev.services, packing: !!checked } }))
                  }
                />
                <Label>Full Packing Service (+$50 per item)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={quote.services.storage}
                  onCheckedChange={(checked) => 
                    setQuote(prev => ({ ...prev, services: { ...prev.services, storage: !!checked } }))
                  }
                />
                <Label>Temporary Storage (+$150)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={quote.services.rush}
                  onCheckedChange={(checked) => 
                    setQuote(prev => ({ ...prev, services: { ...prev.services, rush: !!checked } }))
                  }
                />
                <Label>Rush Service (+25%)</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={prevStep}>Previous</Button>
              <Button onClick={nextStep}>Continue</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Your Quote
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 bg-gradient-primary rounded-lg text-primary-foreground">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Total Estimate</h3>
                <p className="text-4xl font-bold">{formatPrice(quote.totalPrice)}</p>
              </div>
              
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>{formatPrice(quote.basePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Services & Add-ons:</span>
                  <span>{formatPrice(quote.servicesPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>{quote.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Weight:</span>
                  <span>{quote.totalWeight} lbs</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={prevStep}>Previous</Button>
              {user ? (
                <Button onClick={saveQuote} disabled={saving}>
                  {saving ? "Saving..." : "Save Quote"}
                </Button>
              ) : (
                <Button asChild>
                  <a href="/auth">Sign In to Save</a>
                </Button>
              )}
              <Button asChild>
                <a href="/booking">Book Move</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};