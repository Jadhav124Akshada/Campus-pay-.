import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { PaymentHistoryItem } from "@/components/ui/payment-history-item";
import { fine } from "@/lib/fine";
import { Loader2 } from "lucide-react";

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = fine.auth.useSession();

  useEffect(() => {
    const fetchPayments = async () => {
      if (!session?.user?.id) return;
      
      try {
        // Extract phone number from email (email format: student_PHONENUMBER@collegeevent.app)
        const email = session.user.email;
        const phoneNumber = email.includes('_') ? email.split('_')[1].split('@')[0] : '';
        
        // Get the user's database ID from the phone number
        const users = await fine.table("users").select().eq("phoneNumber", phoneNumber);
        
        if (users.length === 0) {
          throw new Error("User not found");
        }
        
        const dbUserId = users[0].id;
        
        // Get payments for the current user
        const paymentsData = await fine.table("payments").select().eq("userId", dbUserId);
        
        // Get event details for each payment
        const paymentsWithEvents = await Promise.all(
          paymentsData.map(async (payment) => {
            const eventData = await fine.table("events").select().eq("id", payment.eventId);
            return {
              ...payment,
              eventName: eventData[0]?.name || "Unknown Event"
            };
          })
        );
        
        setPayments(paymentsWithEvents);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [session]);

  if (!session?.user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Payment History</h1>
        <p className="text-muted-foreground mb-8">
          View all your event payments and their status
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => (
              <PaymentHistoryItem
                key={payment.id}
                id={payment.id}
                eventName={payment.eventName}
                amount={payment.amount}
                date={payment.createdAt}
                status={payment.status}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted rounded-lg">
            <p className="text-xl">You haven't made any payments yet</p>
            <p className="text-muted-foreground mt-2">
              Register for an event to see your payment history here
            </p>
          </div>
        )}
      </main>
    </div>
  );
}