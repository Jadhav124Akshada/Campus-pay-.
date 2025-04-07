import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentId, eventName } = location.state || {};

  useEffect(() => {
    if (!paymentId) {
      navigate("/");
    }
  }, [paymentId, navigate]);

  if (!paymentId) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6 pb-2 flex flex-col items-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Submitted!</h1>
            <p className="text-muted-foreground mb-4">
              Your payment for <strong>{eventName}</strong> has been submitted and is pending verification.
            </p>
            <div className="bg-muted p-4 rounded-md w-full mb-4">
              <p className="font-medium">Payment ID: {paymentId}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              You will receive a confirmation once your payment is verified.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              className="w-full" 
              onClick={() => navigate("/payment-history")}
            >
              View Payment History
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate("/")}
            >
              Back to Events
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}