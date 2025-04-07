import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface PaymentHistoryItemProps {
  id: number;
  eventName: string;
  amount: number;
  date: string;
  status: string;
}

export function PaymentHistoryItem({ id, eventName, amount, date, status }: PaymentHistoryItemProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{eventName}</CardTitle>
            <CardDescription>Payment ID: {id}</CardDescription>
          </div>
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">₹{amount.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">{formatDate(date)}</div>
        </div>
      </CardContent>
    </Card>
  );
}