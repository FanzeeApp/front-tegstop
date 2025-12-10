import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, Phone, UserCircle, LogOut, Shield,
  Copy, Check, DollarSign, Users, TrendingUp, Gift
} from "lucide-react";
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
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // User ma'lumotni olish
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.get("user/profile");
      return res.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  // Referal statistikasi
  const { data: referralData, isLoading: referralLoading } = useQuery({
    queryKey: ["referral-stats"],
    queryFn: async () => {
      const res = await api.get("referral/stats");
      return res.data;
    },
    enabled: !!data,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Referral kod
  const referralCode = referralData?.referralCode || data?.referralCode;

  useEffect(() => {
    trackEvent('page_view', {
      page_title: 'Profil - Foydalanuvchi Ma\'lumotlari',
      page_location: window.location.href,
    });
  }, []);

  useEffect(() => {
    if (data) {
      trackEvent('profile_loaded', {
        user_role: data?.role || 'user',
        has_phone: !!data?.phone,
      });
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      trackError("Profil ma'lumotlarini yuklashda xatolik", "Profile/useQuery");
    }
  }, [isError]);

  const handleLogout = () => {
    trackAuth('logout', 'manual');
    trackEvent('logout_from_profile', {
      user_role: data?.role || 'user',
    });
    logout();
    navigate('/login', { replace: true });
  };

  const copyReferralCode = async () => {
    if (!referralCode) return;

    try {
      await navigator.clipboard.writeText(referralCode);
      setCopiedCode(true);
      toast.success(t("profile.copied"));
      setTimeout(() => setCopiedCode(false), 2000);
      trackEvent('referral_code_copied', {
        code: referralCode,
      });
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const copyReferralLink = async () => {
    if (!referralCode) return;

    const link = `${window.location.origin}/register?ref=${referralCode}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(true);
      toast.success(t("profile.copied"));
      setTimeout(() => setCopiedLink(false), 2000);
      trackEvent('referral_link_copied', {
        code: referralCode,
      });
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const formatCurrency = (amount: number) => {
    return (amount / 100).toLocaleString() + " so'm";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>{t("profile.title")} - Tegstop.uz</title>
        </Helmet>
        <Navbar />
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {[1, 2].map((i) => (
                <Card key={i} className="shadow-lg">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted animate-pulse" />
                    <div className="h-8 bg-muted rounded w-32 mx-auto mb-2 animate-pulse" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-16 bg-muted rounded animate-pulse" />
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>{t("common.error")} - Tegstop.uz</title>
        </Helmet>
        <Navbar />
        <div className="container mx-auto px-4 py-6 sm:py-8">
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
                  {t("common.error")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t("profile.userInfo")}
                </p>
                <Button onClick={() => window.location.reload()}>
                  {t("common.retry")}
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
        <title>{t("profile.title")} - {data?.name} | Tegstop.uz</title>
        <meta
          name="description"
          content="Foydalanuvchi profili va referal tizim. Tegstop.uz platformasida firibgarlardan himoya."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <Navbar />
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {/* Left Column - User Info */}
            <Card className="shadow-lg">
              <CardHeader className="text-center pb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-3 sm:mb-4 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <UserCircle className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
                </motion.div>
                <CardTitle className="text-xl sm:text-2xl font-bold">
                  {data?.name}
                </CardTitle>
                <CardDescription>
                  {t("profile.userInfo")}
                </CardDescription>
              </CardHeader>

              <Separator />

              <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3 sm:space-x-4 p-2.5 sm:p-3 rounded-lg bg-secondary/50">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">{t("profile.name")}</p>
                    <p className="font-semibold text-sm sm:text-base truncate">{data?.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4 p-2.5 sm:p-3 rounded-lg bg-secondary/50">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <UserCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">{t("profile.username")}</p>
                    <p className="font-semibold text-sm sm:text-base truncate">{data?.username}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4 p-2.5 sm:p-3 rounded-lg bg-secondary/50">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">{t("profile.phone")}</p>
                    <p className="font-semibold text-sm sm:text-base truncate">{data?.phone}</p>
                  </div>
                </div>

                {data?.role && (
                  <div className="flex items-center space-x-3 sm:space-x-4 p-2.5 sm:p-3 rounded-lg bg-secondary/50">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-muted-foreground">{t("profile.role")}</p>
                      <Badge variant={data.role === 'admin' ? 'default' : 'secondary'} className="mt-1">
                        {data.role}
                      </Badge>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full mt-4 sm:mt-6 h-11 sm:h-12"
                  size="lg"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {t("profile.logoutButton")}
                </Button>
              </CardContent>
            </Card>

            {/* Right Column - Referral System */}
            <div className="space-y-4 sm:space-y-6">
              {/* Balance Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300 text-base sm:text-lg">
                      <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
                      {t("profile.balance")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {referralLoading ? (
                      <div className="h-12 bg-muted/50 rounded animate-pulse" />
                    ) : (
                      <div className="text-center">
                        <p className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(referralData?.balance || 0)}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                          {t("profile.totalEarned")}: {formatCurrency(referralData?.totalEarned || 0)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Referral Code Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                      {t("profile.referralCode")}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {t("profile.referralCodeDesc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 p-3 sm:p-4 bg-primary/5 rounded-lg border-2 border-dashed border-primary/20">
                      <code className="flex-1 text-xl sm:text-2xl font-bold text-center text-primary tracking-wider">
                        {referralCode || t("common.loading")}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={copyReferralCode}
                        className="shrink-0 h-9 w-9 sm:h-10 sm:w-10"
                        disabled={!referralCode}
                      >
                        {copiedCode ? (
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground text-center">
                      {t("profile.referralCodeDesc")}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                      {t("profile.invitedFriends")}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {t("profile.invitedFriendsDesc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {referralLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3 sm:space-y-4">
                        {/* Jami do'stlar soni */}
                        <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-xl">
                          <p className="text-4xl sm:text-5xl font-bold text-blue-600 dark:text-blue-400">
                            {referralData?.stats?.total || 0}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            {t("profile.totalInvited")}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <div className="flex flex-col items-center p-2.5 sm:p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                            <span className="text-xl sm:text-2xl font-bold text-green-600">
                              {referralData?.stats?.active || 0}
                            </span>
                            <span className="text-xs text-muted-foreground text-center">{t("profile.activeFriends")}</span>
                            <span className="text-xs text-green-600 mt-1">+10,000 so'm</span>
                          </div>

                          <div className="flex flex-col items-center p-2.5 sm:p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                            <span className="text-xl sm:text-2xl font-bold text-orange-600">
                              {referralData?.stats?.pending || 0}
                            </span>
                            <span className="text-xs text-muted-foreground text-center">{t("profile.pendingFriends")}</span>
                            <span className="text-xs text-orange-600 mt-1">+5,000 so'm</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Bonus Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
                  <CardContent className="pt-4 sm:pt-6">
                    <h4 className="font-semibold mb-2 sm:mb-3 text-purple-700 dark:text-purple-300 text-sm sm:text-base">
                      {t("profile.bonusSystem")}:
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 mt-0.5 shrink-0" />
                        <span>{t("profile.bonusRegistration")}: <strong>5,000 so'm</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 mt-0.5 shrink-0" />
                        <span>{t("profile.bonusFirstRecord")}: <strong>5,000 so'm</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 mt-0.5 shrink-0" />
                        <span>{t("profile.bonusTotal")}: <strong>10,000 so'm</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 mt-0.5 shrink-0" />
                        <span>{t("profile.bonusWithdraw")}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
