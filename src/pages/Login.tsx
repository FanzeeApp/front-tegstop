import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { LogIn, Loader2, Send } from "lucide-react";
import { Helmet } from "react-helmet";
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
import { toast } from "sonner";
import { login } from "@/hooks/api";
import { trackAuth, trackEvent, trackError } from "@/utils/analytics";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  // Sahifa yuklanganda tracking
  useEffect(() => {
    trackEvent('page_view', {
      page_title: 'Login - Kirish',
      page_location: window.location.href,
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      toast.error(t("auth.invalidCredentials"));
      trackError("Login ma'lumotlari to'ldirilmagan", "Login/handleSubmit");
      return;
    }

    setLoading(true);

    // Login attempt tracking
    trackEvent('login_attempt', {
      method: 'username_password',
    });

    try {
      const response = await login(credentials);

      localStorage.setItem("token", response.token);
      setAuth(null, response.token);

      // Muvaffaqiyatli login tracking
      trackAuth('login', 'username_password');
      trackEvent('login_success', {
        method: 'username_password',
      });

      toast.success(t("common.success"));
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Login xatoligi tracking
      const errorMessage = error.response?.data?.message || t("auth.loginError");
      trackError(errorMessage, "Login/handleSubmit");
      trackEvent('login_failed', {
        method: 'username_password',
        error_type: error.response?.status || 'unknown',
      });

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Telegram tugmasi bosilganda tracking
  const handleTelegramClick = () => {
    trackEvent('click_telegram_register', {
      button_location: 'login_page',
      destination: 'https://t.me/saparboykayumov',
    });
    window.open("https://t.me/saparboykayumov", "_blank");
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
              <LogIn className="h-8 w-8 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-3xl font-bold">
              {t("auth.login")}
            </CardTitle>
            <CardDescription>{t("app.title")}</CardDescription>
          </CardHeader>

          <CardContent>
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
              <p className="text-center">Yoki ro'yxatdan o'tish</p>

              {/* Telegram orqali ro'yxatdan o'tish tugmasi */}
              <Button
                type="button"
                variant="secondary"
                className="w-full flex items-center gap-2 mt-2"
                onClick={handleTelegramClick}
              >
                <Send className="h-4 w-4" />
                {"Telegramdan yozing"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}