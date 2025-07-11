import { QuoteCalculator } from "@/components/quote/QuoteCalculator";
import { Navigation } from "@/components/layout/Navigation";

const QuotePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Get Your Moving Quote
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get an instant, accurate quote for your move. Our smart calculator provides transparent pricing with no hidden fees.
          </p>
        </div>
        <QuoteCalculator />
      </main>
    </div>
  );
};

export default QuotePage;