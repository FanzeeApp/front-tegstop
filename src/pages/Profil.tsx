import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Phone, UserCircle, LogOut, Shield, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet";
import { Navbar } from "@/components/Navbar";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/hooks/api";
import { trackAuth, trackEvent, trackError } from "@/utils/analytics";
import { useEffect } from "react";

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  // User ma'lumotni olish
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.get("user/profile");
      return res.data;
    },
    retry: 1, // Faqat 1 marta qayta urinish
    refetchOnWindowFocus: false, // Window focus bo'lganda refetch qilmaslik
    staleTime: 5 * 60 * 1000, // 5 daqiqa uchun cache
  });

  // Sahifa yuklanganda tracking
  useEffect(() => {
    trackEvent('page_view', {
      page_title: 'Profil - Foydalanuvchi Ma\'lumotlari',
      page_location: window.location.href,
    });
  }, []);

  // Ma'lumot yuklanganda tracking
  useEffect(() => {
    if (data) {
      trackEvent('profile_loaded', {
        user_role: data?.role || 'user',
        has_phone: !!data?.phone,
      });
    }
  }, [data]);

  // Xatolik yuz berganda tracking
  useEffect(() => {
    if (isError) {
      trackError("Profil ma'lumotlarini yuklashda xatolik", "Profile/useQuery");
      trackEvent('profile_load_failed', {
        error_type: 'api_error',
      });
    }
  }, [isError]);

  const handleLogout = () => {
    // Logout tracking
    trackAuth('logout', 'manual');
    trackEvent('logout_from_profile', {
      user_role: data?.role || 'user',
    });

    // Logout qilish (localStorage.clear() logout() ichida)
    logout();

    // Login sahifasiga yo'naltirish (navigate ishlatish - reload yo'q!)
    navigate('/login', { replace: true });
  };

  // Yuklanayotgan payt - Optimized skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Profil - Tegstop.uz | Firibgarlardan Himoya</title>
        </Helmet>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-24 h-24 rounded-full bg-muted animate-pulse" />
                <div className="h-8 bg-muted rounded w-32 mx-auto mb-2 animate-pulse" />
                <div className="h-4 bg-muted rounded w-48 mx-auto animate-pulse" />
              </CardHeader>
              <Separator />
              <CardContent className="pt-6 space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-secondary/50">
                    <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                      <div className="h-6 bg-muted rounded w-40 animate-pulse" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Xatolik paytida - Improved error state
  if (isError || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Xatolik - Tegstop.uz</title>
        </Helmet>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="py-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mx-auto mb-4 w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center"
                >
                  <Shield className="w-10 h-10 text-destructive" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-destructive">
                  {t("common.error") || "Xatolik yuz berdi"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Profil ma'lumotlarini yuklashda muammo yuz berdi.
                </p>
                <Button onClick={() => window.location.reload()}>
                  Qayta urinish
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Profil - {data?.name} | Tegstop.uz</title>
        <meta 
          name="description" 
          content="Foydalanuvchi profili va shaxsiy ma'lumotlar. Tegstop.uz platformasida firibgarlardan himoya." 
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://tegstop.uz/profile" />
      </Helmet>

      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-4 w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <UserCircle className="w-16 h-16 text-primary" />
              </motion.div>
              <CardTitle className="text-3xl font-bold">
                {t("profile.title") || "Profile"}
              </CardTitle>
              <CardDescription>
                {t("profile.userInfo") || "User Information"}
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {t("profile.name") || "Full Name"}
                  </p>
                  <p className="text-lg font-semibold">{data?.name}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {t("profile.username") || "Username"}
                  </p>
                  <p className="text-lg font-semibold">{data?.username}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center space-x-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {t("profile.phone") || "Phone"}
                  </p>
                  <p className="text-lg font-semibold">{data?.phone}</p>
                </div>
              </motion.div>

              {data?.role && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center space-x-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {t("profile.role") || "Role"}
                    </p>
                    <p className="text-lg font-semibold capitalize">
                      {data?.role}
                    </p>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="pt-4"
              >
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full"
                  size="lg"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  {t("profile.logoutButton") || "Logout"}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;