import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useThemeStore } from "@/store/useThemeStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { trackPageView } from "@/utils/analytics";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import MyRecords from "@/pages/MyRecords";
import AddRecord from "@/pages/AddRecord";
import NotFound from "@/pages/NotFound";
import Profile from "./pages/Profil";
import BulkUpload from "@/pages/BulkUpload";
import "./lib/i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 0, // Har doim fresh data
    },
  },
});

// Route o'zgarishlarini kuzatuvchi komponent
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

const App = () => {
  const { isAuthenticated } = useAuthStore();

  // Theme avtomatik zustand persist orqali yuklanadi, qayta o'rnatish shart emas

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Google Analytics Script */}
        <Helmet>
          <script 
            async 
            src="https://www.googletagmanager.com/gtag/js?id=G-78JNRPT98X"
          />
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-78JNRPT98X', {
                send_page_view: false
              });
            `}
          </script>
        </Helmet>

        <Toaster />
        <Sonner />
        <PWAInstallPrompt />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AnalyticsTracker />
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login />
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bulk-upload"
              element={
                <ProtectedRoute>
                  <BulkUpload />
                </ProtectedRoute>
              }
/>
            <Route
              path="/my-records"
              element={
                <ProtectedRoute>
                  <MyRecords />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-record"
              element={
                <ProtectedRoute>
                  <AddRecord />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;