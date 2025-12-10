import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Send,
  CheckCircle2,
  XCircle,
  LogOut,
  RefreshCw,
  Shield,
  Ban,
  Sparkles,
  MessageCircle
} from "lucide-react";
import { Helmet } from "react-helmet";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/hooks/api";
import { trackEvent } from "@/utils/analytics";

// Telegram username - bu yerda o'zgartirishingiz mumkin
const TELEGRAM_USERNAME = "saparboykayumov";

export default function PendingApproval() {
  const navigate = useNavigate();
  const { token, logout, setAuth, user } = useAuthStore();
  const [status, setStatus] = useState<string>("pending");
  const [userData, setUserData] = useState<any>(null);
  const [checking, setChecking] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    trackEvent("page_view", {
      page_title: "Pending Approval",
      page_location: window.location.href,
    });

    if (!token) {
      navigate("/login");
      return;
    }

    checkStatus();

    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      if (autoRefresh) {
        checkStatus();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [token, navigate, autoRefresh]);

  const checkStatus = async () => {
    setChecking(true);
    try {
      const response = await api.get("/auth/status");
      const data = response.data;

      setUserData(data);
      setStatus(data.status);

      // Update auth store
      if (user) {
        setAuth({ ...user, status: data.status }, token);
      }

      // Agar approved bo'lsa, bosh sahifaga yo'naltirish
      if (data.status === "approved") {
        toast.success("Tabriklaymiz! Sizning arizangiz tasdiqlandi!");
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error: any) {
      console.error("Status check error:", error);
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.info("Tizimdan chiqdingiz");
  };

  const handleTelegramClick = () => {
    trackEvent("click_telegram_contact", {
      button_location: "pending_approval_page",
      destination: `https://t.me/${TELEGRAM_USERNAME}`,
    });
    window.open(`https://t.me/${TELEGRAM_USERNAME}`, "_blank");
  };

  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          title: "Arizangiz ko'rib chiqilmoqda",
          description: "Sizning arizangiz admin tomonidan ko'rib chiqilmoqda. Odatda bu jarayon 24 soat ichida yakunlanadi.",
          bgGradient: "from-amber-500/20 via-orange-500/10 to-yellow-500/20",
          iconBg: "bg-gradient-to-br from-amber-400 to-orange-500",
          borderColor: "border-amber-200 dark:border-amber-800",
          textColor: "text-amber-700 dark:text-amber-300",
        };
      case "approved":
        return {
          icon: CheckCircle2,
          title: "Arizangiz tasdiqlandi!",
          description: "Tabriklaymiz! Endi platformadan to'liq foydalanishingiz mumkin.",
          bgGradient: "from-emerald-500/20 via-green-500/10 to-teal-500/20",
          iconBg: "bg-gradient-to-br from-emerald-400 to-green-500",
          borderColor: "border-emerald-200 dark:border-emerald-800",
          textColor: "text-emerald-700 dark:text-emerald-300",
        };
      case "rejected":
        return {
          icon: XCircle,
          title: "Arizangiz rad etildi",
          description: "Afsuski, sizning arizangiz rad etildi. Qo'shimcha ma'lumot uchun admin bilan bog'laning.",
          bgGradient: "from-red-500/20 via-rose-500/10 to-pink-500/20",
          iconBg: "bg-gradient-to-br from-red-400 to-rose-500",
          borderColor: "border-red-200 dark:border-red-800",
          textColor: "text-red-700 dark:text-red-300",
        };
      case "blocked":
        return {
          icon: Ban,
          title: "Hisobingiz bloklangan",
          description: "Sizning hisobingiz bloklangan. Sababi haqida ma'lumot olish uchun admin bilan bog'laning.",
          bgGradient: "from-slate-500/20 via-gray-500/10 to-zinc-500/20",
          iconBg: "bg-gradient-to-br from-slate-400 to-gray-500",
          borderColor: "border-slate-200 dark:border-slate-800",
          textColor: "text-slate-700 dark:text-slate-300",
        };
      default:
        return {
          icon: Shield,
          title: "Status aniqlanmadi",
          description: "Iltimos, sahifani yangilang yoki admin bilan bog'laning.",
          bgGradient: "from-blue-500/20 via-indigo-500/10 to-violet-500/20",
          iconBg: "bg-gradient-to-br from-blue-400 to-indigo-500",
          borderColor: "border-blue-200 dark:border-blue-800",
          textColor: "text-blue-700 dark:text-blue-300",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background p-4 relative overflow-hidden">
      <Helmet>
        <title>Ariza holati - Tegstop.uz</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br ${statusConfig.bgGradient} rounded-full blur-3xl opacity-50`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br ${statusConfig.bgGradient} rounded-full blur-3xl opacity-50`} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className={`shadow-2xl border-2 ${statusConfig.borderColor} backdrop-blur-sm bg-card/95`}>
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`mx-auto w-24 h-24 ${statusConfig.iconBg} rounded-full flex items-center justify-center mb-4 shadow-xl`}
            >
              <StatusIcon className="h-12 w-12 text-white" />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CardTitle className={`text-2xl font-bold ${statusConfig.textColor}`}>
                  {statusConfig.title}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {statusConfig.description}
                </CardDescription>
              </motion.div>
            </AnimatePresence>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* User Info Card */}
            {userData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 bg-secondary/50 rounded-xl space-y-3 border"
              >
                <div className="flex items-center gap-3 pb-3 border-b">
                  {userData.avatar ? (
                    <img src={userData.avatar} alt="" className="w-12 h-12 rounded-full" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">
                        {userData.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{userData.name}</p>
                    <p className="text-sm text-muted-foreground">{userData.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Do'kon:</span>
                    <p className="font-medium truncate">{userData.storeName || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Telefon:</span>
                    <p className="font-medium">{userData.phone || "-"}</p>
                  </div>
                </div>

                {userData.referralCode && (
                  <div className="pt-2 border-t">
                    <span className="text-muted-foreground text-sm">Sizning referal kodingiz:</span>
                    <p className="font-mono font-bold text-primary">{userData.referralCode}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Telegram Contact - Professional Design */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative overflow-hidden rounded-xl border-2 border-blue-200 dark:border-blue-800"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-sky-500/10" />
              <div className="relative p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-700 dark:text-blue-300">
                      Admin bilan bog'laning
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Tez javob olish uchun Telegram orqali yozing
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleTelegramClick}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Telegram: @{TELEGRAM_USERNAME}
                </Button>
              </div>
            </motion.div>

            {/* Status info for pending */}
            {status === "pending" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Har 30 soniyada avtomatik yangilanadi</span>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-2 pt-2"
            >
              <Button
                variant="outline"
                onClick={checkStatus}
                disabled={checking}
                className="flex-1"
              >
                {checking ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Yangilash
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Chiqish
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        {/* Footer info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-muted-foreground mt-4"
        >
          Tegstop.uz - Firibgarlardan himoya platformasi
        </motion.p>
      </motion.div>
    </div>
  );
}
