import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { Download, Search } from "lucide-react";
import { fine } from "@/lib/fine";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  id: number;
  userName: string;
  phoneNumber: string;
  eventName: string;
  amount: number;
  date: string;
  status: string;
  transactionId: string | null;
  screenshot: string | null;
}

interface AdminPaymentTableProps {
  payments: Payment[];
  onRefresh: () => void;
}

export function AdminPaymentTable({ payments, onRefresh }: AdminPaymentTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { toast } = useToast();

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesSearch = 
      payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.phoneNumber.includes(searchTerm) ||
      payment.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const updatePaymentStatus = async (paymentId: number, newStatus: string) => {
    try {
      await fine.table("payments").update({ status: newStatus }).eq("id", paymentId);
      toast({
        title: "Status Updated",
        description: `Payment status has been updated to ${newStatus}`,
      });
      onRefresh();
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    }
  };

  const downloadReport = () => {
    // In a real app, this would generate a CSV or PDF
    const csvContent = [
      ["ID", "Student Name", "Phone", "Event", "Amount", "Date", "Status"].join(","),
      ...filteredPayments.map(p => 
        [p.id, p.userName, p.phoneNumber, p.eventName, p.amount, p.date, p.status].join(",")
      )
    ].join("\\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments-report.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full sm:w-[200px]"
            />
          </div>
        </div>
        
        <Button onClick={downloadReport} className="flex items-center gap-2">
          <Download size={16} />
          Download Report
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{payment.userName}</div>
                      <div className="text-sm text-muted-foreground">{payment.phoneNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>{payment.eventName}</TableCell>
                  <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{formatDate(payment.date)}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        payment.status === "completed"
                          ? "bg-green-500"
                          : payment.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {payment.status === "pending" && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-green-500 text-white hover:bg-green-600"
                            onClick={() => updatePaymentStatus(payment.id, "completed")}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-red-500 text-white hover:bg-red-600"
                            onClick={() => updatePaymentStatus(payment.id, "rejected")}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {payment.status !== "pending" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updatePaymentStatus(payment.id, "pending")}
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No payments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}