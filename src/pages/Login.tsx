import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { LogIn, Loader2, Shield } from "lucide-react";
import { Helmet } from "react-helmet";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { api, login } from "@/hooks/api";
import { trackAuth, trackEvent, trackError } from "@/utils/analytics";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const referralCode = searchParams.get("ref");

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    trackEvent("page_view", {
      page_title: "Login - Kirish",
      page_location: window.location.href,
    });
  }, []);

  // Google OAuth Success
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Google autentifikatsiya xatoligi");
      return;
    }

    setGoogleLoading(true);
    trackEvent("login_attempt", { method: "google" });

    try {
      const response = await api.post("/auth/google", {
        token: credentialResponse.credential,
      });

      const { token, user, requiresOnboarding, status } = response.data;

      // Token saqlash
      localStorage.setItem("token", token);
      setAuth(user, token);

      trackAuth("login", "google");
      trackEvent("login_success", { method: "google", isNewUser: requiresOnboarding });

      // Onboarding kerakmi?
      if (requiresOnboarding) {
        toast.success("Xush kelibsiz! Iltimos, ma'lumotlaringizni to'ldiring.");
        navigate(referralCode ? `/onboarding?ref=${referralCode}` : "/onboarding");
        return;
      }

      // Status tekshirish
      if (status === "pending") {
        toast.info("Sizning arizangiz ko'rib chiqilmoqda.");
        navigate("/pending-approval");
        return;
      }

      if (status === "rejected") {
        toast.error("Sizning arizangiz rad etildi. Admin bilan bog'laning.");
        navigate("/pending-approval");
        return;
      }

      if (status === "approved") {
        toast.success("Xush kelibsiz!");
        navigate("/");
        return;
      }

      // Default
      navigate("/");
    } catch (error: any) {
      console.error("Google login error:", error);
      const errorMessage = error.response?.data?.message || "Google kirish xatoligi";
      trackError(errorMessage, "Login/handleGoogleSuccess");
      toast.error(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  // Google OAuth Error
  const handleGoogleError = () => {
    trackError("Google OAuth xatoligi", "Login/handleGoogleError");
    toast.error("Google bilan kirish xatoligi");
  };

  // Username/Password Login (legacy)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      toast.error(t("auth.invalidCredentials"));
      trackError("Login ma'lumotlari to'ldirilmagan", "Login/handleSubmit");
      return;
    }

    setLoading(true);
    trackEvent("login_attempt", { method: "username_password" });

    try {
      const response = await login(credentials);

      localStorage.setItem("token", response.token);
      setAuth(null, response.token);

      trackAuth("login", "username_password");
      trackEvent("login_success", { method: "username_password" });

      toast.success(t("common.success"));
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || t("auth.loginError");
      trackError(errorMessage, "Login/handleSubmit");
      trackEvent("login_failed", {
        method: "username_password",
        error_type: error.response?.status || "unknown",
      });

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <Helmet>
        <title>Kirish - Tegstop.uz | Firibgarlardan Himoya</title>
        <meta
          name="description"
          content="Tegstop.uz platformasiga kirish. Firibgarlar va qarzdorlar haqida ma'lumot qo'shish va qidirish."
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://tegstop.uz/login" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4"
            >
              <Shield className="h-8 w-8 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-3xl font-bold">Tegstop.uz</CardTitle>
            <CardDescription>Firibgarlardan himoya platformasi</CardDescription>
            {referralCode && (
              <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300">
                  Referal kod: <strong>{referralCode}</strong>
                </p>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Google Login Button */}
            <div className="flex justify-center">
              {googleLoading ? (
                <div className="flex items-center gap-2 py-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Google bilan kirilmoqda...</span>
                </div>
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  text="signin_with"
                  shape="rectangular"
                  theme="outline"
                  size="large"
                  width="350"
                  locale="uz"
                />
              )}
            </div>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                yoki
              </span>
            </div>

            {/* Legacy Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t("auth.username")}</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={t("auth.username")}
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("auth.password")}
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("common.loading")}
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    {t("auth.loginButton")}
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Platformaga kirish orqali{" "}
              <a href="/terms" className="underline hover:text-primary">
                foydalanish shartlari
              </a>
              {" "}va{" "}
              <a href="/privacy-policy" className="underline hover:text-primary">
                maxfiylik siyosati
              </a>
              ga rozilik bildirasiz.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
