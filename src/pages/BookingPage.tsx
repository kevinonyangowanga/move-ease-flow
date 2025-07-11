import { BookingForm } from "@/components/booking/BookingForm";
import { Navigation } from "@/components/layout/Navigation";

const BookingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Book Your Move
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Schedule your moving day with our professional team. Easy booking process with flexible scheduling options.
          </p>
        </div>
        <BookingForm />
      </main>
    </div>
  );
};

export default BookingPage;