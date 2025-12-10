import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FileText, Plus, Calendar, Loader2, CheckCircle, Users } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MyRecords() {
  const { t } = useTranslation();
  const { getFraudsterMyCount, deleteFraudster, markAsPaid } = useFraudsters();
  const [markingPaidId, setMarkingPaidId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; record: any | null }>({
    open: false,
    record: null,
  });

  // Faqat 1 marta API call - useFraudster hook orqali
  const { data, isLoading, isError, refetch } = getFraudsterMyCount();

  // data endi to'g'ridan-to'g'ri array (hook ichida parse qilingan)
  const recordsData = data || [];

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

  // "To'ladi" deb belgilash
  const handleMarkAsPaid = async (record: any) => {
    setMarkingPaidId(record.id);

    trackEvent('mark_paid_attempt', {
      record_id: record.id,
      record_type: record.type,
    });

    try {
      await markAsPaid.mutateAsync(record.id);

      trackEvent('record_marked_paid', {
        record_type: record.type,
      });

      toast.success("Muvaffaqiyatli to'langan deb belgilandi ✅");
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
      trackError("To'langan deb belgilashda xatolik", "MyRecords/handleMarkAsPaid");
    } finally {
      setMarkingPaidId(null);
    }
  };

  // Yozuv o'chirish funksiyasi
  const handleDelete = async (record: any) => {
    setConfirmDialog({ open: true, record });
  };

  const confirmDelete = async () => {
    const record = confirmDialog.record;
    if (!record) return;

    setConfirmDialog({ open: false, record: null });

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
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("O'chirishda xatolik yuz berdi");
      trackError("Yozuvni o'chirishda xatolik", "MyRecords/handleDelete");
    }
  };

  // "Yozuv qo'shish" tugmasi tracking
  const handleAddRecordClick = () => {
    trackButtonClick('add_record_from_my_records', 'navigation');
  };

  const getTypeLabel = (type: string) => {
    if (type === "Toza") return t("search.clean");
    return type === "NasiyaMijoz"
      ? t("myRecords.typeNasiya")
      : t("myRecords.typeUnpaid");
  };

  const getTypeBadgeVariant = (type: string): "default" | "destructive" | "secondary" | "outline" => {
    if (type === "Toza") return "secondary";
    return type === "NasiyaMijoz" ? "default" : "destructive";
  };

  const getTypeBadgeClass = (type: string) => {
    if (type === "Toza") return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    if (type === "NasiyaMijoz") return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300";
    return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
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
                  {t("common.retry")}
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
                  key={record.id + '-' + record.historyId}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 border border-border bg-card">
                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg font-semibold">
                          {record.name} {record.surname}
                        </CardTitle>
                        <div className="flex flex-col gap-1 items-end">
                          {/* User status (o'zi belgilagan) */}
                          <Badge className={getTypeBadgeClass(record.userStatus)}>
                            {getTypeLabel(record.userStatus)}
                          </Badge>
                          {/* Agar global type farq qilsa */}
                          {record.currentType !== record.userStatus && (
                            <span className="text-[10px] text-muted-foreground">
                              Umumiy: {getTypeLabel(record.currentType)}
                            </span>
                          )}
                        </div>
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

                      {/* Report Count */}
                      {record.reportCount > 1 && (
                        <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-950 p-2 rounded-lg">
                          <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          <span className="text-xs text-orange-700 dark:text-orange-300">
                            {record.reportCount} foydalanuvchi tomonidan qo'shilgan
                          </span>
                        </div>
                      )}

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

                      {/* Action Buttons */}
                      <div className="mt-3 pt-3 border-t space-y-2">
                        {/* To'ladi tugmasi - faqat NasiyaMijoz yoki TolovQilinmagan uchun */}
                        {record.userStatus !== 'Toza' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                            onClick={() => handleMarkAsPaid(record)}
                            disabled={markingPaidId === record.id}
                          >
                            {markingPaidId === record.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Belgilanmoqda...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                To'ladi ✓
                              </>
                            )}
                          </Button>
                        )}

                        {/* Agar allaqachon to'lagan bo'lsa */}
                        {record.userStatus === 'Toza' && (
                          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 py-2">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">To'langan</span>
                          </div>
                        )}

                        {/* DELETE BUTTON */}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, record: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yozuvni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Haqiqatan ham "{confirmDialog.record?.name} {confirmDialog.record?.surname}" yozuvini o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
