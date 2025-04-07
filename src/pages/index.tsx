import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { EventCard } from "@/components/ui/event-card";
import { fine } from "@/lib/fine";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await fine.table("events").select();
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">College Events</h1>
        <p className="text-muted-foreground mb-8">
          Browse and register for upcoming college events
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                name={event.name}
                description={event.description}
                date={event.date}
                fee={event.fee}
                imageUrl={event.imageUrl}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No events available at the moment</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;