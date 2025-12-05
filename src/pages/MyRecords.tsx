import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FileText, Plus, Calendar, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { useFraudsters } from "@/hooks/useFraudster";
import { trackRecord, trackEvent, trackError, trackButtonClick } from "@/utils/analytics";

export default function MyRecords() {
  const { t } = useTranslation();
  const { getFraudsterMyCount, deleteFraudster } = useFraudsters();
  
  // Faqat 1 marta API call - useFraudster hook orqali
  const { data, isLoading, isError, refetch } = getFraudsterMyCount();

  // data endi to'g'ridan-to'g'ri array (hook ichida parse qilingan)
  const recordsData = data || [];
  
  // Debug log - faqat development da
  useEffect(() => {
    if (import.meta.env.DEV && recordsData.length > 0) {
      console.log('Fraudster data:', recordsData);
    }
  }, [recordsData]);

  // Sahifa yuklanganda tracking
  useEffect(() => {
    trackEvent('page_view', {
      page_title: 'Mening Yozuvlarim',
      page_location: window.location.href,
    });
  }, []);

  // Ma'lumotlar yuklanganda tracking
  useEffect(() => {
    if (data && !isLoading) {
      trackEvent('records_loaded', {
        records_count: recordsData.length,
      });
    }
  }, [data, isLoading]);

  // Xatolik yuz berganda tracking
  useEffect(() => {
    if (isError) {
      trackError("Yozuvlarni yuklashda xatolik", "MyRecords");
    }
  }, [isError]);

  // Yozuv o'chirish funksiyasi
  const handleDelete = async (record: any) => {
    if (confirm("Haqiqatan ham ushbu yozuvni o'chirmoqchimisiz?")) {
      trackEvent('delete_attempt', {
        record_id: record.id,
        record_type: record.type,
      });

      try {
        await deleteFraudster.mutateAsync(record.id);
        
        trackRecord('delete');
        trackEvent('record_deleted', {
          record_type: record.type,
          passport_series: record.passportSeriya,
        });

        toast.success("Yozuv muvaffaqiyatli o'chirildi");
        
        // Ma'lumotlarni yangilash
        refetch();
      } catch (err) {
        console.error(err);
        toast.error("O'chirishda xatolik yuz berdi");
        
        trackError("Yozuvni o'chirishda xatolik", "MyRecords/handleDelete");
        trackEvent('delete_failed', {
          record_id: record.id,
        });
      }
    } else {
      trackEvent('delete_cancelled', {
        record_id: record.id,
      });
    }
  };

  // "Yozuv qo'shish" tugmasi tracking
  const handleAddRecordClick = () => {
    trackButtonClick('add_record_from_my_records', 'navigation');
  };

  const getTypeLabel = (type: string) => {
    return type === "NasiyaMijoz"
      ? t("myRecords.typeNasiya")
      : t("myRecords.typeUnpaid");
  };

  const getTypeBadgeVariant = (type: string) => {
    return type === "NasiyaMijoz" ? "default" : "destructive";
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Helmet>
        <title>Mening Yozuvlarim - Tegstop.uz | Firibgarlardan Himoya</title>
        <meta 
          name="description" 
          content="Siz qo'shgan firibgar va qarzdorlar haqidagi barcha yozuvlaringizni ko'ring va boshqaring." 
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://tegstop.uz/my-records" />
      </Helmet>

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">{t("myRecords.title")}</h1>
            <p className="text-muted-foreground">
              {isLoading ? "..." : `${recordsData.length} ${t("myRecords.title").toLowerCase()}`}
            </p>
          </div>
          <Link to="/add-record" onClick={handleAddRecordClick}>
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              {t("nav.addRecord")}
            </Button>
          </Link>
        </motion.div>

        {/* Loading / Empty / Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {isLoading ? (
            // Optimized skeleton loader
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-8 bg-muted rounded mt-4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : isError ? (
            // Xatolik ko'rinishi
            <Card>
              <CardContent className="py-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-4"
                >
                  <FileText className="h-10 w-10 text-destructive" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-destructive">
                  {t("common.error")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Yozuvlarni yuklashda xatolik yuz berdi
                </p>
                <Button onClick={() => refetch()}>
                  Qayta urinish
                </Button>
              </CardContent>
            </Card>
          ) : recordsData.length === 0 ? (
            // Bo'sh holat
            <Card>
              <CardContent className="py-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4"
                >
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("myRecords.noRecords")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t("myRecords.noRecordsDesc")}
                </p>
                <Link to="/add-record" onClick={handleAddRecordClick}>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("nav.addRecord")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            // Yozuvlar ro'yxati
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {recordsData.map((record: any, index: number) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 border border-border bg-card">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-semibold">
                          {record.name} {record.surname}
                        </CardTitle>
                        <Badge variant={getTypeBadgeVariant(record.type)}>
                          {getTypeLabel(record.type)}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 text-sm">
                      {/* Passport Hash - Xavfsiz ko'rinish */}
                      <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-3 rounded-lg border border-primary/10">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground font-medium">
                            {t("myRecords.passport")}
                          </span>
                          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                            ✓ Himoyalangan
                          </span>
                        </div>
                        <div className="font-mono text-xs bg-black/5 dark:bg-white/5 p-2 rounded border border-dashed">
                          {record.passportSeriya && record.passportCode ? (
                            <span className="font-semibold">
                              {record.passportSeriya} {record.passportCode}
                            </span>
                          ) : record.passportHash ? (
                            <span className="text-muted-foreground">
                              {record.passportHash.substring(0, 8)}...
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              {record.passportPreview || "••••••"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Time - Agar NasiyaMijoz bo'lsa */}
                      {record.type === "NasiyaMijoz" && record.time && (
                        <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950 p-2 rounded-lg">
                          <span className="text-xs text-blue-700 dark:text-blue-300">
                            Muddat:
                          </span>
                          <span className="font-semibold text-blue-900 dark:text-blue-100">
                            {record.time} oy
                          </span>
                        </div>
                      )}

                      {/* Created Date */}
                      <div className="flex items-center text-muted-foreground text-xs pt-2 border-t">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>
                          {new Date(record.createdAt).toLocaleDateString(
                            "uz-UZ",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>

                      {/* DELETE BUTTON */}
                      <div className="mt-3 pt-3 border-t">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={() => handleDelete(record)}
                          disabled={deleteFraudster.isPending}
                        >
                          {deleteFraudster.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              O'chirilmoqda...
                            </>
                          ) : (
                            "O'chirish"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}