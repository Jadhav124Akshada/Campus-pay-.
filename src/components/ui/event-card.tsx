import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/utils";

interface EventCardProps {
  id: number;
  name: string;
  description: string | null;
  date: string;
  fee: number;
  imageUrl: string | null;
}

export function EventCard({ id, name, description, date, fee, imageUrl }: EventCardProps) {
  const navigate = useNavigate();
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img 
          src={imageUrl || "https://images.unsplash.com/photo-1523580494863-6f3031224c94"} 
          alt={name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Calendar size={16} />
          <span>{formatDate(date)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2">{description}</p>
        <div className="mt-4 font-semibold text-lg">₹{fee.toFixed(2)}</div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => navigate(`/event/${id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}