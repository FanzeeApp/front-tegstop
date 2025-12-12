import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, User, Calendar, AlertCircle, Shield, Phone,
  Building2, MapPin, Clock, X, ChevronRight, AlertTriangle,
  CheckCircle2, UserCircle, ExternalLink, Users, History,
  MessageSquare, FileText
} from "lucide-react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { useFraudsters } from "@/hooks/useFraudster";
import { trackEvent, trackSearch, trackError } from "@/utils/analytics";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const { t } = useTranslation();
  const { getFraudsterSearch } = useFraudsters();
  const isMobile = useIsMobile();

  const [searchParams, setSearchParams] = useState({
    passportSeriya: "",
    passportCode: "",
  });
  const [searched, setSearched] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [userInfoOpen, setUserInfoOpen] = useState(false);

  const { data, isFetching, refetch } = getFraudsterSearch({
    passportSeriya: searchParams.passportSeriya,
    passportCode: searchParams.passportCode,
  });

  useEffect(() => {
    trackEvent('page_view', {
      page_title: 'Qidiruv - Asosiy Sahifa',
      page_location: window.location.href,
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchParams.passportSeriya || !searchParams.passportCode) {
      toast.error(t("common.error"));
      trackError("Qidiruv ma'lumotlari to'ldirilmagan", "Home/handleSearch");
      return;
    }

    if (searchParams.passportCode.length !== 7) {
      toast.error(t("addRecord.passportCodeHelper"));
      trackError("Passport raqami noto'g'ri formatda", "Home/handleSearch");
      return;
    }

    trackSearch(`${searchParams.passportSeriya}${searchParams.passportCode}`);
    trackEvent('search_fraudster', {
      passport_series: searchParams.passportSeriya,
      search_type: 'passport',
    });

    setSearched(true);
    refetch();
  };

  useEffect(() => {
    if (searched && !isFetching && data !== undefined) {
      trackEvent('search_results', {
        results_count: data?.length || 0,
        has_results: (data?.length || 0) > 0,
        passport_series: searchParams.passportSeriya,
      });
    }
  }, [searched, isFetching, data]);

  const getStatusConfig = (type: string) => {
    if (type === "Toza") {
      return {
        text: t("search.clean") || "Toza",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-950",
        borderColor: "border-green-200 dark:border-green-800",
        icon: CheckCircle2,
        badge: "default" as const,
      };
    }
    if (type === "NasiyaMijoz") {
      return {
        text: t("record.statusNasiya"),
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-50 dark:bg-amber-950",
        borderColor: "border-amber-200 dark:border-amber-800",
        icon: AlertTriangle,
        badge: "warning" as const,
      };
    }
    return {
      text: t("record.statusUnpaid"),
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950",
      borderColor: "border-red-200 dark:border-red-800",
      icon: AlertCircle,
      badge: "destructive" as const,
    };
  };

  const openUserInfo = (record: any) => {
    setSelectedRecord(record);
    setUserInfoOpen(true);
    trackEvent('view_added_by_user', {
      fraudster_id: record.id,
      user_id: record.user?.id,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      t("common.locale") || "uz-UZ",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // User Info Content - ikkala dialog/sheet uchun
  const UserInfoContent = ({ record }: { record: any }) => {
    const user = record?.user;
    const history = record?.history || [];

    return (
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Report Count */}
        {record.reportCount > 1 && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="font-bold text-orange-700 dark:text-orange-300">
                {record.reportCount} foydalanuvchi tomonidan qo'shilgan
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                Bu shaxs bir nechta foydalanuvchi tomonidan ro'yxatga olingan
              </p>
            </div>
          </div>
        )}

        {/* User Avatar & Name */}
        {user && (
          <>
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-3"
              >
                <UserCircle className="w-12 h-12 text-primary" />
              </motion.div>
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">
                {t("record.addedBy")} (birinchi)
              </p>
            </div>

            <Separator />

            {/* User Details */}
            <div className="space-y-3">
              {user.phone && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("profile.phone")}</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
              )}

              {user.username && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("profile.username")}</p>
                    <p className="font-medium">@{user.username}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("record.addedAt")}</p>
                  <p className="font-medium">{formatDate(record.createdAt)}</p>
                </div>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Record Info */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            {t("myRecords.title")}
          </h4>

          <div className={`p-4 rounded-xl border-2 ${getStatusConfig(record.type).borderColor} ${getStatusConfig(record.type).bgColor}`}>
            <div className="flex items-center gap-2 mb-2">
              {(() => {
                const StatusIcon = getStatusConfig(record.type).icon;
                return <StatusIcon className={`w-5 h-5 ${getStatusConfig(record.type).color}`} />;
              })()}
              <span className={`font-semibold ${getStatusConfig(record.type).color}`}>
                {getStatusConfig(record.type).text}
              </span>
            </div>
            <p className="text-sm">
              <span className="font-medium">{record.name} {record.surname}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              {record.passportSeriya}{record.passportCode}
            </p>
          </div>
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <History className="w-4 h-4" />
                Tarix ({history.length})
              </h4>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {history.map((h: any, idx: number) => (
                  <div
                    key={h.id || idx}
                    className="p-3 rounded-xl bg-secondary/30 border border-border/50 hover:border-border transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          h.action === 'mark_paid'
                            ? 'bg-green-100 dark:bg-green-900'
                            : h.action === 'auto_expire'
                            ? 'bg-blue-100 dark:bg-blue-900'
                            : h.type === 'TolovQilinmagan'
                            ? 'bg-red-100 dark:bg-red-900'
                            : 'bg-primary/10'
                        }`}>
                          {h.action === 'mark_paid' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : h.action === 'auto_expire' ? (
                            <Clock className="w-4 h-4 text-blue-600" />
                          ) : h.type === 'TolovQilinmagan' ? (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          ) : (
                            <UserCircle className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">
                            {h.user?.name || 'Foydalanuvchi'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {h.action === 'add'
                              ? `Qo'shdi: ${h.type === 'NasiyaMijoz' ? 'Nasiya mijoz' : 'To\'lov qilinmagan'}`
                              : h.action === 'mark_paid'
                              ? 'To\'langan deb belgiladi'
                              : h.action === 'auto_expire'
                              ? 'Muddat tugadi (avtomatik)'
                              : h.action}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {new Date(h.createdAt).toLocaleDateString('uz-UZ', {
                          day: 'numeric',
                          month: 'short',
                          year: '2-digit'
                        })}
                      </span>
                    </div>

                    {/* Izoh / Note - professional dizayn */}
                    {h.note && (
                      <div className="mt-3 ml-10">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border border-amber-200 dark:border-amber-800">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">
                                Izoh:
                              </p>
                              <p className="text-sm text-amber-800 dark:text-amber-200 break-words whitespace-pre-wrap">
                                {h.note}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Trust Badge */}
        {user && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-700 dark:text-green-300">
              {t("search.verifiedUser") || "Tasdiqlangan foydalanuvchi"}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t("search.title")} - Tegstop.uz | {t("app.title")}</title>
        <meta
          name="description"
          content="Passport ma'lumotlari bo'yicha firibgar va qarzdorlarni qidiring. O'zbekistondagi firibgarlikdan himoya platformasi."
        />
        <link rel="canonical" href="https://tegstop.uz" />
      </Helmet>

      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t("search.title")}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">{t("app.title")}</p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Search className="h-5 w-5" />
                {t("search.title")}
              </CardTitle>
              <CardDescription className="text-sm">
                {t("search.passportSeries")} & {t("search.passportCode")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passportSeriya" className="text-sm font-medium">
                      {t("search.passportSeries")}
                    </Label>
                    <Select
                      value={searchParams.passportSeriya}
                      onValueChange={(value) =>
                        setSearchParams({
                          ...searchParams,
                          passportSeriya: value,
                        })
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t("search.passportSeries")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AA">AA</SelectItem>
                        <SelectItem value="AB">AB</SelectItem>
                        <SelectItem value="AC">AC</SelectItem>
                        <SelectItem value="AD">AD</SelectItem>
                        <SelectItem value="AE">AE</SelectItem>
                        <SelectItem value="KA">KA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passportCode" className="text-sm font-medium">
                      {t("search.passportCode")}
                    </Label>
                    <Input
                      id="passportCode"
                      type="text"
                      placeholder="1234567"
                      maxLength={7}
                      className="h-12 text-lg font-mono tracking-wider"
                      value={searchParams.passportCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setSearchParams({
                          ...searchParams,
                          passportCode: value,
                        });
                      }}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  disabled={isFetching}
                >
                  <Search className="mr-2 h-5 w-5" />
                  {isFetching ? t("common.loading") : t("search.searchButton")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {searched && (
            <motion.div
              key={data?.length ? "found" : "notfound"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              {data && data.length > 0 ? (
                <div className="space-y-4">
                  {/* Results Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      {t("search.resultsFound") || `${data.length} ta natija topildi`}
                    </h2>
                  </div>

                  {/* Results List */}
                  <div className="space-y-3">
                    {data.map((item: any, index: number) => {
                      const statusConfig = getStatusConfig(item.type);
                      const StatusIcon = statusConfig.icon;

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className={`overflow-hidden border-2 ${statusConfig.borderColor} hover:shadow-lg transition-all duration-300`}>
                            {/* Status Header */}
                            <div className={`px-4 py-3 ${statusConfig.bgColor}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                                  <Badge variant={statusConfig.badge} className="font-semibold">
                                    {statusConfig.text}
                                  </Badge>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  #{index + 1}
                                </span>
                              </div>
                            </div>

                            <CardContent className="p-4">
                              {/* Person Info */}
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="space-y-3 flex-1">
                                  {/* Name */}
                                  <div>
                                    <h3 className="text-xl font-bold">
                                      {item.name} {item.surname}
                                    </h3>
                                    <p className="text-sm text-muted-foreground font-mono">
                                      {item.passportSeriya}{item.passportCode}
                                    </p>
                                  </div>

                                  {/* Report Count */}
                                  {item.reportCount > 1 && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Users className="w-4 h-4 text-orange-500" />
                                      <span className="text-orange-600 dark:text-orange-400 font-medium">
                                        {item.reportCount} foydalanuvchi qo'shgan
                                      </span>
                                    </div>
                                  )}

                                  {/* Note/Izoh - TolovQilinmagan uchun */}
                                  {item.type === 'TolovQilinmagan' && item.history?.[0]?.note && (
                                    <div className="p-3 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200 dark:border-red-800/50">
                                      <div className="flex items-start gap-2">
                                        <MessageSquare className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                                        <div className="min-w-0 flex-1">
                                          <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">
                                            Izoh:
                                          </p>
                                          <p className="text-sm text-red-700 dark:text-red-300 break-words line-clamp-2">
                                            {item.history[0].note}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Date */}
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(item.createdAt)}</span>
                                  </div>
                                </div>

                                {/* Added By User Card */}
                                <div
                                  onClick={() => openUserInfo(item)}
                                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all duration-300 min-w-[200px] group"
                                >
                                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                    <UserCircle className="w-7 h-7 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                      {t("record.addedBy")}
                                    </p>
                                    <p className="font-semibold truncate">
                                      {item.user?.name || "Noma'lum"}
                                    </p>
                                    <p className="text-xs text-primary group-hover:underline flex items-center gap-1">
                                      {t("search.viewDetails") || "Batafsil"}
                                      <ChevronRight className="w-3 h-3" />
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Not Found */
                <Card className="shadow-lg border-2 border-green-200 dark:border-green-800">
                  <CardContent className="py-12 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4"
                    >
                      <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">
                      {t("search.notFound")}
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {t("search.notFoundDesc")}
                    </p>
                    <Badge variant="outline" className="mt-4 border-green-500 text-green-600">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {t("search.clean") || "Toza"}
                    </Badge>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Info Modal - Mobile: Sheet, Desktop: Dialog */}
      {isMobile ? (
        <Sheet open={userInfoOpen} onOpenChange={setUserInfoOpen}>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
            <SheetHeader className="text-left pb-4">
              <SheetTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                {t("search.addedByInfo") || "Qo'shgan foydalanuvchi"}
              </SheetTitle>
            </SheetHeader>
            {selectedRecord && <UserInfoContent record={selectedRecord} />}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={userInfoOpen} onOpenChange={setUserInfoOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                {t("search.addedByInfo") || "Qo'shgan foydalanuvchi"}
              </DialogTitle>
            </DialogHeader>
            {selectedRecord && <UserInfoContent record={selectedRecord} />}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
