import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { fine } from "@/lib/fine";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface AuthFormProps {
  isAdmin?: boolean;
}

export function AuthForm({ isAdmin = false }: AuthFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      toast({
        title: "Validation Error",
        description: "Phone number is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!isAdmin && !name) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate a consistent email and password based on the phone number
      const email = isAdmin 
        ? `admin_${phoneNumber}@collegeevent.app` 
        : `student_${phoneNumber}@collegeevent.app`;
      const password = `secure_${phoneNumber}_password`;
      
      // Check if user exists in our database
      const existingUsers = await fine.table("users").select().eq("phoneNumber", phoneNumber);
      
      if (isAdmin) {
        // Admin login
        const adminUser = existingUsers.find(user => user.role === "admin");
        
        if (!adminUser) {
          toast({
            title: "Authentication Error",
            description: "Invalid admin credentials",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        // First try to create the account in Fine's auth system
        try {
          await fine.auth.signUp.email({
            email,
            password,
            name: adminUser.name,
          });
          console.log("Admin account created in Fine auth system");
        } catch (error: any) {
          // If error is not because user already exists, show error
          if (!error.message?.includes("already exists")) {
            console.error("Error creating admin in Fine auth:", error);
          }
        }
        
        // Then try to sign in
        try {
          await fine.auth.signIn.email({
            email,
            password,
          });
          navigate("/admin-dashboard");
          toast({
            title: "Success",
            description: "Admin logged in successfully",
          });
        } catch (error) {
          console.error("Admin login error:", error);
          toast({
            title: "Authentication Error",
            description: "Failed to login. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        // Student login/signup
        let userId;
        
        if (existingUsers.length === 0) {
          // Create new user in our database
          const newUser = await fine.table("users").insert({
            name,
            phoneNumber,
            role: "student"
          }).select();
          
          userId = newUser[0].id;
        } else {
          userId = existingUsers[0].id;
        }
        
        // First try to create the account in Fine's auth system
        try {
          await fine.auth.signUp.email({
            email,
            password,
            name: name || existingUsers[0]?.name || "Student User",
          });
          console.log("Student account created in Fine auth system");
        } catch (error: any) {
          // If error is not because user already exists, show error
          if (!error.message?.includes("already exists")) {
            console.error("Error creating student in Fine auth:", error);
          }
        }
        
        // Then try to sign in
        try {
          await fine.auth.signIn.email({
            email,
            password,
          });
          navigate("/");
          toast({
            title: "Success",
            description: "Logged in successfully",
          });
        } catch (error) {
          console.error("Student login error:", error);
          toast({
            title: "Authentication Error",
            description: "Failed to login. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Authentication Error",
        description: "There was an error during authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isAdmin ? "Admin Login" : "Student Login"}</CardTitle>
        <CardDescription>
          {isAdmin 
            ? "Enter your credentials to access the admin dashboard" 
            : "Enter your details to access college events"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {!isAdmin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isAdmin ? "Logging in..." : "Logging in..."}
              </>
            ) : (
              isAdmin ? "Login as Admin" : "Login / Sign Up"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}