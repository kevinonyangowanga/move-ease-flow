import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/layout/Navigation";
import { 
  Truck, 
  Shield, 
  Clock, 
  DollarSign, 
  Star, 
  CheckCircle,
  Calculator,
  Calendar,
  MapPin,
  Users,
  Package,
  Headphones
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: <Calculator className="h-8 w-8 text-primary" />,
      title: "Instant Quotes",
      description: "Get accurate pricing instantly with our smart calculator"
    },
    {
      icon: <Calendar className="h-8 w-8 text-secondary" />,
      title: "Easy Booking",
      description: "Schedule your move in minutes with our streamlined process"
    },
    {
      icon: <MapPin className="h-8 w-8 text-accent" />,
      title: "Real-time Tracking",
      description: "Track your belongings every step of the way"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Fully Insured",
      description: "Your items are protected with comprehensive insurance"
    },
    {
      icon: <Users className="h-8 w-8 text-secondary" />,
      title: "Professional Crew",
      description: "Experienced and trained moving professionals"
    },
    {
      icon: <Headphones className="h-8 w-8 text-accent" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support when you need it"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Happy Customers" },
    { number: "50,000+", label: "Successful Moves" },
    { number: "99.9%", label: "On-Time Delivery" },
    { number: "4.9/5", label: "Customer Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent leading-tight">
              Moving Made Simple
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Professional, reliable, and stress-free moving services. From local moves to long-distance relocations, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button variant="hero" size="xl" className="animate-bounce-gentle" asChild>
                <Link to="/quote">
                  <Calculator className="mr-2 h-5 w-5" />
                  Get Free Quote
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/booking">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Your Move
                </Link>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <p className="text-2xl md:text-3xl font-bold text-primary">{stat.number}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 px-4 bg-gradient-card">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose MoveEase?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We combine cutting-edge technology with professional service to make your move seamless and stress-free.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-medium hover:shadow-large transition-all duration-300 border-0 bg-background/50 backdrop-blur">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-muted/50 w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="shadow-large bg-gradient-primary text-primary-foreground border-0 hover:shadow-glow transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <Calculator className="h-12 w-12 mx-auto mb-4" />
                <CardTitle className="text-xl">Get Instant Quote</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-4 opacity-90">
                  Calculate your moving costs in seconds with our smart pricing tool.
                </p>
                <Button variant="secondary" className="w-full" asChild>
                  <Link to="/quote">Start Calculator</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-large bg-gradient-secondary text-secondary-foreground border-0 hover:shadow-glow transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <Calendar className="h-12 w-12 mx-auto mb-4" />
                <CardTitle className="text-xl">Book Your Move</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-4 opacity-90">
                  Schedule your moving day with our professional team in minutes.
                </p>
                <Button variant="outline" className="w-full bg-background text-foreground hover:bg-muted" asChild>
                  <Link to="/booking">Book Now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-large bg-gradient-card border-0 hover:shadow-medium transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-accent" />
                <CardTitle className="text-xl">Track Your Move</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-4 text-muted-foreground">
                  Stay updated with real-time tracking of your belongings.
                </p>
                <Button variant="accent" className="w-full" asChild>
                  <Link to="/tracking">Track Order</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Move with Confidence?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us with their most important moves.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="xl" asChild>
              <Link to="/quote">
                Get Your Free Quote
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <a href="tel:(555)123-4567">
                Call (555) 123-4567
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Truck className="h-6 w-6 mr-2" />
            <span className="text-lg font-semibold">MoveEase</span>
          </div>
          <p className="text-sm opacity-75">
            © 2024 MoveEase. Professional moving services you can trust.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
