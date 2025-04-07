import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { fine } from "@/lib/fine";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export function Header() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: session } = fine.auth.useSession();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (session?.user?.id) {
        try {
          // Extract phone number from email (email format: student_PHONENUMBER@collegeevent.app)
          const email = session.user.email;
          const phoneNumber = email.includes('_') ? email.split('_')[1].split('@')[0] : '';
          
          // Get the user's role from our users table
          const users = await fine.table("users").select().eq("phoneNumber", phoneNumber);
          if (users.length > 0) {
            setUserRole(users[0].role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    fetchUserRole();
  }, [session]);

  const handleLogout = async () => {
    await fine.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          College Event Payment
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link to="/" className="hover:text-primary-foreground/80">
            Events
          </Link>
          
          {session?.user && (
            <Link to="/payment-history" className="hover:text-primary-foreground/80">
              Payment History
            </Link>
          )}
          
          {userRole === "admin" && (
            <Link to="/admin-dashboard" className="hover:text-primary-foreground/80">
              Admin Dashboard
            </Link>
          )}
          
          {session?.user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>{session.user.name}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/login")}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}