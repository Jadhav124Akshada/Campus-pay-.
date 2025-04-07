import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { AdminPaymentTable } from "@/components/ui/admin-payment-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fine } from "@/lib/fine";
import { Loader2, Users, CreditCard, CheckCircle, Clock } from "lucide-react";

export default function AdminDashboardPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPayments: 0,
    completedPayments: 0,
    pendingPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { data: session } = fine.auth.useSession();

  useEffect(() => {
    // Check if the current user is an admin
    const checkAdminStatus = async () => {
      if (session?.user?.id) {
        try {
          // Extract phone number from email (email format: admin_PHONENUMBER@collegeevent.app)
          const email = session.user.email;
          const phoneNumber = email.includes('_') ? email.split('_')[1].split('@')[0] : '';
          
          // Get the user's role from our users table
          const users = await fine.table("users").select().eq("phoneNumber", phoneNumber);
          
          if (users.length > 0 && users[0].role === "admin") {
            setIsAdmin(true);
            fetchData();
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [session]);

  const fetchData = async () => {
    try {
      // Get all users who are students
      const studentsData = await fine.table("users").select().eq("role", "student");
      
      // Get all payments with user and event details
      const paymentsData = await fine.table("payments").select();
      
      // Get all events
      const eventsData = await fine.table("events").select();
      
      // Get all users
      const usersData = await fine.table("users").select();
      
      // Combine data
      const paymentsWithDetails = paymentsData.map(payment => {
        const user = usersData.find(u => u.id === payment.userId);
        const event = eventsData.find(e => e.id === payment.eventId);
        
        return {
          ...payment,
          userName: user?.name || "Unknown User",
          phoneNumber: user?.phoneNumber || "Unknown",
          eventName: event?.name || "Unknown Event"
        };
      });
      
      // Calculate stats
      const completedPayments = paymentsData.filter(p => p.status === "completed");
      const pendingPayments = paymentsData.filter(p => p.status === "pending");
      
      setPayments(paymentsWithDetails);
      setStats({
        totalStudents: studentsData.length,
        totalPayments: paymentsData.length,
        completedPayments: completedPayments.length,
        pendingPayments: pendingPayments.length
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin
  if (!session?.user) {
    return <Navigate to="/admin-login" />;
  }

  if (!isAdmin && !loading) {
    return <Navigate to="/admin-login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Manage student payments and event registrations
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStudents}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalPayments}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Completed Payments</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedPayments}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingPayments}</div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminPaymentTable payments={payments} onRefresh={fetchData} />
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}