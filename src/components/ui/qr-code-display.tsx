import { Card, CardContent } from "@/components/ui/card";

interface QRCodeDisplayProps {
  amount: number;
}

export function QRCodeDisplay({ amount }: QRCodeDisplayProps) {
  // In a real app, you would generate a dynamic QR code based on the amount
  // For this demo, we'll use a placeholder QR code
  const qrCodeUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png";
  
  return (
    <div className="flex flex-col items-center">
      <p className="text-center mb-2">Scan this QR code to pay ₹{amount.toFixed(2)}</p>
      <Card className="border-dashed">
        <CardContent className="p-4 flex justify-center">
          <img 
            src={qrCodeUrl} 
            alt="Payment QR Code" 
            className="w-48 h-48"
          />
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground mt-2 text-center">
        Pay using any UPI app like PhonePe, Google Pay, or Paytm
      </p>
    </div>
  );
}