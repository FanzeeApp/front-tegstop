import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Store, Phone, Gift, Loader2, CheckCircle2, ArrowRight, Lock, AtSign, Eye, EyeOff } from "lucide-react";
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
import { api } from "@/hooks/api";
import { trackEvent, trackError } from "@/utils/analytics";

export default function Onboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const referralCodeFromUrl = searchParams.get("ref");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    storeName: "",
    phone: "+998",
    username: "",
    password: "",
    confirmPassword: "",
    referralCode: referralCodeFromUrl || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    trackEvent("page_view", {
      page_title: "Onboarding - Ro'yxatdan o'tish",
      page_location: window.location.href,
    });

    // Token yo'q bo'lsa login sahifasiga yo'naltirish
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name || formData.name.length < 2) {
        newErrors.name = "Ism kamida 2 ta belgidan iborat bo'lishi kerak";
      }
      if (!formData.storeName || formData.storeName.length < 2) {
        newErrors.storeName = "Do'kon nomi kamida 2 ta belgidan iborat bo'lishi kerak";
      }
    }

    if (currentStep === 2) {
      const phoneRegex = /^\+998[0-9]{9}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Telefon raqam noto'g'ri formatda (+998XXXXXXXXX)";
      }
    }

    if (currentStep === 3) {
      // Username validation
      if (!formData.username || formData.username.length < 3) {
        newErrors.username = "Username kamida 3 ta belgidan iborat bo'lishi kerak";
      } else if (formData.username.length > 20) {
        newErrors.username = "Username maksimum 20 ta belgi bo'lishi mumkin";
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username = "Username faqat harf, raqam va _ belgilardan iborat bo'lishi kerak";
      }

      // Password validation
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = "Parol kamida 6 ta belgidan iborat bo'lishi kerak";
      }

      // Confirm password validation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Parollar mos kelmayapti";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      trackEvent("onboarding_step_completed", { step });
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    trackEvent("onboarding_submit_attempt", {
      hasReferral: !!formData.referralCode,
    });

    try {
      await api.post("/auth/onboarding", {
        name: formData.name,
        storeName: formData.storeName,
        phone: formData.phone,
        username: formData.username.toLowerCase(),
        password: formData.password,
        referralCode: formData.referralCode || undefined,
      });

      trackEvent("onboarding_success", {
        hasReferral: !!formData.referralCode,
      });

      toast.success("Ro'yxatdan o'tish muvaffaqiyatli tugallandi!");

      // Pending approval sahifasiga yo'naltirish
      navigate("/pending-approval");
    } catch (error: any) {
      console.error("Onboarding error:", error);
      const errorMessage =
        error.response?.data?.message || "Xatolik yuz berdi. Qaytadan urinib ko'ring.";
      trackError(errorMessage, "Onboarding/handleSubmit");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Shaxsiy", icon: User },
    { number: 2, title: "Aloqa", icon: Phone },
    { number: 3, title: "Kirish", icon: Lock },
    { number: 4, title: "Bonus", icon: Gift },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background p-4">
      <Helmet>
        <title>Ro'yxatdan o'tish - Tegstop.uz</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-xl border-2">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mb-4 shadow-lg"
            >
              {step === 1 && <User className="h-10 w-10 text-white" />}
              {step === 2 && <Phone className="h-10 w-10 text-white" />}
              {step === 3 && <Lock className="h-10 w-10 text-white" />}
              {step === 4 && <Gift className="h-10 w-10 text-white" />}
            </motion.div>

            {/* Progress Steps */}
            <div className="flex justify-center gap-1 mb-4">
              {steps.map((s) => (
                <div key={s.number} className="flex items-center">
                  <div
                    className={`h-2 w-10 sm:w-14 rounded-full transition-all duration-300 ${
                      s.number <= step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                </div>
              ))}
            </div>

            <CardTitle className="text-2xl font-bold">
              {step === 1 && "Shaxsiy ma'lumotlar"}
              {step === 2 && "Aloqa ma'lumotlari"}
              {step === 3 && "Kirish ma'lumotlari"}
              {step === 4 && "Referal kod (ixtiyoriy)"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Ism va do'kon nomingizni kiriting"}
              {step === 2 && "Telefon raqamingizni kiriting"}
              {step === 3 && "Username va parol yarating"}
              {step === 4 && "Sizni taklif qilgan odamning kodi"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    To'liq ism
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ism Familiya"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeName" className="flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    Do'kon / Biznes nomi
                  </Label>
                  <Input
                    id="storeName"
                    placeholder="Masalan: Texno Market"
                    value={formData.storeName}
                    onChange={(e) =>
                      setFormData({ ...formData, storeName: e.target.value })
                    }
                    className={errors.storeName ? "border-red-500" : ""}
                  />
                  {errors.storeName && (
                    <p className="text-sm text-red-500">{errors.storeName}</p>
                  )}
                </div>

                <Button onClick={handleNext} className="w-full">
                  Davom etish
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* Step 2: Phone */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Telefon raqam
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+998901234567"
                    value={formData.phone}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (!value.startsWith("+998")) {
                        value = "+998";
                      }
                      if (value.length <= 13) {
                        setFormData({ ...formData, phone: value });
                      }
                    }}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Format: +998XXXXXXXXX
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    Orqaga
                  </Button>
                  <Button onClick={handleNext} className="flex-1">
                    Davom etish
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Username & Password */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <AtSign className="w-4 h-4" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    placeholder="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })
                    }
                    className={errors.username ? "border-red-500" : ""}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Faqat kichik harflar, raqamlar va _ belgisi
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Parol
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Kamida 6 ta belgi"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Parolni tasdiqlang
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Parolni qayta kiriting"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    Orqaga
                  </Button>
                  <Button onClick={handleNext} className="flex-1">
                    Davom etish
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Referral Code */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="referralCode" className="flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    Referal kod (ixtiyoriy)
                  </Label>
                  <Input
                    id="referralCode"
                    placeholder="Masalan: ADMI6E3F"
                    value={formData.referralCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        referralCode: e.target.value.toUpperCase(),
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Agar sizni kimdir taklif qilgan bo'lsa, uning kodini kiriting
                  </p>
                </div>

                {/* Bonus Info */}
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                    Referal bonus tizimi:
                  </h4>
                  <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Ro'yxatdan o'tganingizda: <strong>5,000 so'm</strong>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Birinchi firibgar qo'shganingizda: <strong>5,000 so'm</strong>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    Orqaga
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-primary to-primary/80"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Yuklanmoqda...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Tugatish
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
