import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentForm } from "@/components/ui/payment-form";
import { fine } from "@/lib/fine";
import { formatDate } from "@/lib/utils";
import { Calendar, ArrowLeft, Loader2 } from "lucide-react";

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();
  const { data: session } = fine.auth.useSession();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        const eventData = await fine.table("events").select().eq("id", parseInt(id));
        
        if (eventData.length > 0) {
          setEvent(eventData[0]);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Event not found</p>
            <Button onClick={() => navigate("/")} className="mt-4">
              Back to Events
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")} 
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Events
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="rounded-lg overflow-hidden mb-6">
              <img 
                src={event.imageUrl || "https://images.unsplash.com/photo-1523580494863-6f3031224c94"} 
                alt={event.name} 
                className="w-full h-64 object-cover"
              />
            </div>

            <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
            
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Calendar size={18} />
              <span>{formatDate(event.date)}</span>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">About this event</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {event.description || "No description available for this event."}
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-1">Registration Fee</h2>
                  <p className="text-3xl font-semibold">₹{event.fee.toFixed(2)}</p>
                </div>

                {showPayment ? (
                  session?.user ? (
                    <PaymentForm 
                      eventId={event.id} 
                      eventName={event.name} 
                      amount={event.fee} 
                      userId={session.user.id}
                    />
                  ) : (
                    <div className="text-center py-4">
                      <p className="mb-4">Please login to make a payment</p>
                      <Button onClick={() => navigate("/login")}>
                        Login to Continue
                      </Button>
                    </div>
                  )
                ) : (
                  <Button 
                    className="w-full text-lg py-6" 
                    onClick={() => setShowPayment(true)}
                  >
                    Register Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}