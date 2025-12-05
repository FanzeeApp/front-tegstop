import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Calendar, AlertCircle } from "lucide-react";
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
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { useFraudsters } from "@/hooks/useFraudster";
import { trackEvent, trackSearch, trackError } from "@/utils/analytics";

export default function Home() {
  const { t } = useTranslation();
  const { getFraudsterSearch } = useFraudsters();

  const [searchParams, setSearchParams] = useState({
    passportSeriya: "",
    passportCode: "",
  });
  const [searched, setSearched] = useState(false);

  // Query faqat button bosilganda ishlaydi
  const { data, isFetching, refetch } = getFraudsterSearch({
    passportSeriya: searchParams.passportSeriya,
    passportCode: searchParams.passportCode,
  });

  // Debug log - faqat development da
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('=== SEARCH DEBUG ===');
      console.log('Search params:', searchParams);
      console.log('Search data:', data);
      console.log('Data type:', Array.isArray(data) ? 'Array' : typeof data);
      console.log('Data length:', data?.length);
      console.log('===================');
    }
  }, [data, searchParams]);

  // Sahifa yuklanganda tracking
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

    // Qidiruv tracking
    trackSearch(`${searchParams.passportSeriya}${searchParams.passportCode}`);
    trackEvent('search_fraudster', {
      passport_series: searchParams.passportSeriya,
      search_type: 'passport',
    });

    setSearched(true);
    refetch(); // backendga so'rov faqat shu yerda ketadi
  };

  // Qidiruv natijalari yuklanganda tracking
  useEffect(() => {
    if (searched && !isFetching && data !== undefined) {
      trackEvent('search_results', {
        results_count: data?.length || 0,
        has_results: (data?.length || 0) > 0,
        passport_series: searchParams.passportSeriya,
      });
    }
  }, [searched, isFetching, data]);

  const getStatusText = (type: string) =>
    type === "NasiyaMijoz"
      ? t("record.statusNasiya")
      : t("record.statusUnpaid");

  const getStatusColor = (type: string) =>
    type === "NasiyaMijoz" ? "text-warning" : "text-destructive";

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Qidiruv - Tegstop.uz | Firibgarlardan Himoya</title>
        <meta 
          name="description" 
          content="Passport ma'lumotlari bo'yicha firibgar va qarzdorlarni qidiring. O'zbekistondagi firibgarlikdan himoya platformasi." 
        />
        <link rel="canonical" href="https://tegstop.uz" />
      </Helmet>

      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">{t("search.title")}</h1>
          <p className="text-muted-foreground">{t("app.title")}</p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {t("search.title")}
              </CardTitle>
              <CardDescription>
                {t("search.passportSeries")} {t("search.passportCode")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passportSeriya">
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
                      <SelectTrigger>
                        <SelectValue placeholder={t("search.passportSeries")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AD">AD</SelectItem>
                        <SelectItem value="AC">AC</SelectItem>
                        <SelectItem value="AE">AE</SelectItem>
                        <SelectItem value="AB">AB</SelectItem>
                        <SelectItem value="KA">KA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passportCode">
                      {t("search.passportCode")}
                    </Label>
                    <Input
                      id="passportCode"
                      type="text"
                      placeholder="1234567"
                      maxLength={7}
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

                <Button type="submit" className="w-full" disabled={isFetching}>
                  <Search className="mr-2 h-4 w-4" />
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              {data && data.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.map((item: any) => (
                    <Card
                      key={item.id}
                      className="shadow-lg border-2 border-primary/20"
                    >
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                        <CardTitle className="text-lg font-semibold">
                          {item.name} {item.surname}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle
                            className={`h-5 w-5 ${getStatusColor(item.type)}`}
                          />
                          <p
                            className={`font-semibold ${getStatusColor(
                              item.type
                            )}`}
                          >
                            {getStatusText(item.type)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          <p>
                            {item.user?.name || "N/A"}{" "}
                            {item.addedBy
                              ? `(qo'shgan: ${item.addedBy.name})`
                              : ""}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          <p>
                            {new Date(item.createdAt).toLocaleDateString(
                              "uz-UZ",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="shadow-lg border-2 border-muted text-center py-12">
                  <CardContent>
                    <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-xl font-semibold">
                      {t("search.notFound")}
                    </p>
                    <p className="text-muted-foreground">
                      {t("search.notFoundDesc")}
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}