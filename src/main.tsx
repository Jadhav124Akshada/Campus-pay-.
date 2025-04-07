import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/layout/theme-provider";
import "./index.css";

// Pages
import Index from "./pages";
import LoginForm from "./pages/login";
import SignupForm from "./pages/signup";
import Logout from "./pages/logout";
import EventDetailsPage from "./pages/event-details";
import PaymentSuccessPage from "./pages/payment-success";
import PaymentHistoryPage from "./pages/payment-history";
import AdminLoginPage from "./pages/admin-login";
import AdminDashboardPage from "./pages/admin-dashboard";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Index />} />
            <Route path='/login' element={<LoginForm />} />
            <Route path='/signup' element={<SignupForm />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/event/:id' element={<EventDetailsPage />} />
            <Route path='/payment-success' element={<PaymentSuccessPage />} />
            <Route path='/payment-history' element={<PaymentHistoryPage />} />
            <Route path='/admin-login' element={<AdminLoginPage />} />
            <Route path='/admin-dashboard' element={<AdminDashboardPage />} />
          </Routes>
        </BrowserRouter>
        <Sonner />
        <Toaster />
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);