import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Helmet } from "react-helmet";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/useAuthStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { trackPageView } from "@/utils/analytics";
import "./lib/i18n";

// Lazy load pages
const Login = lazy(() => import("@/pages/Login"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const PendingApproval = lazy(() => import("@/pages/PendingApproval"));
const Home = lazy(() => import("@/pages/Home"));
const MyRecords = lazy(() => import("@/pages/MyRecords"));
const AddRecord = lazy(() => import("@/pages/AddRecord"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Profile = lazy(() => import("@/pages/Profil"));
const BulkUpload = lazy(() => import("@/pages/BulkUpload"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const Terms = lazy(() => import("@/pages/Terms"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-muted-foreground">Yuklanmoqda...</p>
    </div>
  </div>
);

// Google Client ID from environment
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minut cache
      gcTime: 10 * 60 * 1000, // 10 minut garbage collection
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

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Auth Routes */}
                <Route
                  path="/login"
                  element={
                    isAuthenticated ? <Navigate to="/" replace /> : <Login />
                  }
                />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/pending-approval" element={<PendingApproval />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />

                {/* Protected Routes */}
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

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
