import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import type { CreateRecordData } from "@/types";
import { useFraudsters } from "@/hooks/useFraudster";
import { 
  trackRecord, 
  trackFormSubmit, 
  trackError,
  trackEvent 
} from "@/utils/analytics";

export default function AddRecord() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createFraudster } = useFraudsters();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateRecordData>({
    name: "",
    surname: "",
    passportSeriya: "AD",
    passportCode: "",
    type: "NasiyaMijoz",
    time: 1,
  });

  // Sahifa yuklanganda tracking
  useEffect(() => {
    trackEvent('page_view', {
      page_title: 'Yozuuv Qo\'shish',
      page_location: window.location.href,
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validatsiya
    if (!formData.passportSeriya || !formData.passportCode) {
      toast.error(t("common.error"));
      // Xatolik tracking
      trackError("Passport ma'lumotlari to'ldirilmagan", "AddRecord/handleSubmit");
      return;
    }

    if (formData.passportCode.length !== 7) {
      toast.error(t("addRecord.passportCodeHelper"));
      // Xatolik tracking
      trackError("Passport raqami noto'g'ri formatda", "AddRecord/handleSubmit");
      return;
    }

    setLoading(true);

    // Form yuborish boshlanganda tracking
    trackEvent('form_start', {
      form_name: 'add_record',
      record_type: formData.type,
    });

    try {
      await createFraudster.mutateAsync(formData);
      
      // Muvaffaqiyatli qo'shilganda tracking
      trackRecord('add');
      trackFormSubmit('add_record_form');
      
      // Qo'shimcha ma'lumotlar bilan event
      trackEvent('record_created', {
        record_type: formData.type,
        passport_series: formData.passportSeriya,
        has_name: !!formData.name,
        has_surname: !!formData.surname,
        time_months: formData.type === 'NasiyaMijoz' ? formData.time : null,
      });

      toast.success(t("addRecord.success"));
      navigate("/my-records");
    } catch (error: any) {
      console.error("Create fraudster error:", error);
      
      // Xatolik tracking
      const errorMessage = error.response?.data?.message || t("addRecord.error");
      trackError(errorMessage, "AddRecord/handleSubmit");
      
      // Xatolik turi bo'yicha tracking
      trackEvent('form_error', {
        form_name: 'add_record',
        error_type: error.response?.status || 'unknown',
        error_message: errorMessage,
      });

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Passport seriyasi o'zgarganda tracking
  const handlePassportSeriesChange = (value: any) => {
    setFormData({ ...formData, passportSeriya: value });
    trackEvent('select_passport_series', {
      series: value,
    });
  };

  // Tip o'zgarganda tracking
  const handleTypeChange = (value: any) => {
    setFormData({ ...formData, type: value });
    trackEvent('select_record_type', {
      type: value,
    });
  };

  // Oy tanlanganda tracking
  const handleMonthChange = (value: string) => {
    setFormData({ ...formData, time: Number(value) });
    trackEvent('select_month', {
      months: Number(value),
    });
  };

  // Input o'zgarishlarini tracking (optional - faqat kerak bo'lsa)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
    // Faqat ma'lumot kiritilganda tracking
    if (e.target.value && !formData.name) {
      trackEvent('field_filled', { field: 'name' });
    }
  };

  const handleSurnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, surname: e.target.value });
    if (e.target.value && !formData.surname) {
      trackEvent('field_filled', { field: 'surname' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Yozuv Qo'shish - Tegstop.uz | Firibgarlardan Himoya</title>
        <meta 
          name="description" 
          content="Firibgar yoki qarzdor haqida ma'lumot qo'shing. Passport ma'lumotlari va to'lov turi bo'yicha yozuv yarating." 
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://tegstop.uz/add-record" />
      </Helmet>

      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">{t("addRecord.title")}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-lg border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {t("addRecord.title")}
              </CardTitle>
              <CardDescription>To'liq ma'lumotlarni kiriting</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Pasport ma'lumotlari */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passportSeriya">
                      {t("addRecord.passportSeries")}
                    </Label>
                    <Select
                      value={formData.passportSeriya}
                      onValueChange={handlePassportSeriesChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AD">AD</SelectItem>
                        <SelectItem value="AB">AB</SelectItem>
                        <SelectItem value="KA">KA</SelectItem>
                        <SelectItem value="AE">AE</SelectItem>
                        <SelectItem value="AC">AC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passportCode">
                      {t("addRecord.passportCode")}
                    </Label>
                    <Input
                      id="passportCode"
                      type="text"
                      placeholder="1234567"
                      maxLength={7}
                      value={formData.passportCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setFormData({ ...formData, passportCode: value });
                      }}
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("addRecord.passportCodeHelper")}
                    </p>
                  </div>
                </div>

                {/* Turini tanlash */}
                <div className="space-y-3">
                  <Label>{t("addRecord.type")}</Label>
                  <RadioGroup
                    value={formData.type}
                    onValueChange={handleTypeChange}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="NasiyaMijoz" id="nasiya" />
                      <Label htmlFor="nasiya" className="flex-1 cursor-pointer">
                        {t("addRecord.typeNasiya")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="TolovQilinmagan" id="unpaid" />
                      <Label htmlFor="unpaid" className="flex-1 cursor-pointer">
                        {t("addRecord.typeUnpaid")}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Nasiya uchun oylar soni */}
                {formData.type === "NasiyaMijoz" && (
                  <div className="space-y-2">
                    <Label htmlFor="time">Oyni tanlang</Label>
                    <Select
                      value={formData.time?.toString() || ""}
                      onValueChange={handleMonthChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Oyni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1} {i + 1 === 1 ? "oy" : "oy"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Ism / Familiya */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("addRecord.name")}</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t("addRecord.name")}
                      value={formData.name}
                      onChange={handleNameChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surname">{t("addRecord.surname")}</Label>
                    <Input
                      id="surname"
                      type="text"
                      placeholder={t("addRecord.surname")}
                      value={formData.surname}
                      onChange={handleSurnameChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Submit tugmasi */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t("common.loading")}
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-5 w-5" />
                      {t("addRecord.submit")}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}