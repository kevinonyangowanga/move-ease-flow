import { OrderTracking } from "@/components/tracking/OrderTracking";
import { Navigation } from "@/components/layout/Navigation";

const TrackingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Track Your Move
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated on your move progress. Real-time tracking with detailed status updates.
          </p>
        </div>
        <OrderTracking />
      </main>
    </div>
  );
};

export default TrackingPage;