import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeDisplay } from "./qr-code-display";
import { useToast } from "@/hooks/use-toast";
import { fine } from "@/lib/fine";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface PaymentFormProps {
  eventId: number;
  eventName: string;
  amount: number;
  userId: string; // This is the Fine SDK user ID
}

export function PaymentForm({ eventId, eventName, amount, userId }: PaymentFormProps) {
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionId && !screenshot) {
      toast({
        title: "Validation Error",
        description: "Please provide either a transaction ID or a payment screenshot",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Extract phone number from email (email format: student_PHONENUMBER@collegeevent.app)
      const email = fine.auth.session()?.user?.email || '';
      const phoneNumber = email.includes('_') ? email.split('_')[1].split('@')[0] : '';
      
      // Get the user's database ID from the phone number
      const users = await fine.table("users").select().eq("phoneNumber", phoneNumber);
      
      if (users.length === 0) {
        throw new Error("User not found");
      }
      
      const dbUserId = users[0].id;
      
      const payment = {
        userId: dbUserId,
        eventId,
        amount,
        transactionId: transactionId || null,
        screenshot: screenshot || null,
        status: "pending"
      };
      
      const result = await fine.table("payments").insert(payment).select();
      
      toast({
        title: "Payment Submitted",
        description: "Your payment has been submitted for verification",
      });
      
      navigate("/payment-success", { 
        state: { 
          paymentId: result[0].id,
          eventName 
        } 
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment for {eventName}</CardTitle>
        <CardDescription>Amount: ₹{amount.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <QRCodeDisplay amount={amount} />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="transactionId">UPI Transaction ID</Label>
            <Input
              id="transactionId"
              placeholder="Enter your UPI transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="screenshot">Or Upload Payment Screenshot</Label>
            <Input
              id="screenshot"
              type="file"
              accept="image/*"
              onChange={handleScreenshotChange}
            />
            {screenshot && (
              <div className="mt-2">
                <img 
                  src={screenshot} 
                  alt="Payment Screenshot" 
                  className="max-h-40 rounded-md border"
                />
              </div>
            )}
          </div>
          
          <CardFooter className="px-0 pt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Payment"
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}