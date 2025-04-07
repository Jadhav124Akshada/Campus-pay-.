import { AuthForm } from "@/components/ui/auth-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">College Event Payment</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            Back to Events
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-8">Student Login</h2>
          <AuthForm />
          
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Are you an admin?{" "}
              <Button 
                variant="link" 
                className="p-0" 
                onClick={() => navigate("/admin-login")}
              >
                Login as Admin
              </Button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}