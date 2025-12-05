import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Download } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { api } from "@/hooks/api";
import { trackEvent, trackError } from "@/utils/analytics";

interface UploadResult {
  success: number;
  failed: number;
  errors: string[];
}

export default function BulkUpload() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [maintenance, setMaintenance] = useState(true);


  // File tanlash
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;

    // Faqat Excel fayllar
    const validTypes = [
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'text/csv', // .csv
    ];

    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Faqat Excel yoki CSV fayl yuklang!");
      trackError("Invalid file type", "BulkUpload/handleFileChange");
      return;
    }

    // Fayl hajmi (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("Fayl hajmi 10MB dan kichik bo'lishi kerak!");
      trackError("File too large", "BulkUpload/handleFileChange");
      return;
    }

    setFile(selectedFile);
    setResult(null);
    
    trackEvent('bulk_upload_file_selected', {
      file_type: selectedFile.type,
      file_size: selectedFile.size,
    });
  };

  // Upload qilish
  const handleUpload = async () => {
    if (!file) {
      toast.error("Iltimos, fayl tanlang!");
      return;
    }

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Progress simulation (real progress backend dan kelishi kerak)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      trackEvent('bulk_upload_started', {
        file_name: file.name,
        file_size: file.size,
      });

      // API ga yuborish
      const response = await api.post('/fraudster/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      clearInterval(progressInterval);
      setProgress(100);

      const uploadResult: UploadResult = response.data;
      setResult(uploadResult);

      trackEvent('bulk_upload_completed', {
        success_count: uploadResult.success,
        failed_count: uploadResult.failed,
      });

      if (uploadResult.success > 0) {
        toast.success(`${uploadResult.success} ta yozuv muvaffaqiyatli qo'shildi!`);
      }

      if (uploadResult.failed > 0) {
        toast.warning(`${uploadResult.failed} ta yozuvda xatolik bo'ldi`);
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      
      const errorMessage = error.response?.data?.message || "Yuklashda xatolik yuz berdi";
      toast.error(errorMessage);
      
      trackError(errorMessage, "BulkUpload/handleUpload");
      
      setResult({
        success: 0,
        failed: 1,
        errors: [errorMessage],
      });
    } finally {
      setUploading(false);
    }
  };

  // Template yuklab olish
  const downloadTemplate = () => {
    trackEvent('bulk_upload_template_download', {});

    // Template CSV yaratish
    const csvContent = `Passport Seriya,Passport Code,Ism,Familiya,Turi,Oylar Soni
AD,1234567,Ali,Valiyev,NasiyaMijoz,3
AB,7654321,Vali,Aliyev,TolovQilinmagan,`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tegstop_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Ko'p Yozuv Yuklash - Tegstop.uz</title>
        <meta name="description" content="Excel yoki CSV fayl orqali ko'p yozuvlarni birdan yuklash" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <Navbar />
      {maintenance && (
  <div className="
absolute left-0 right-0 
top-[64px] md:top-[72px] 
h-full 
bg-black/60 backdrop-blur-sm 
z-40 flex flex-col items-center justify-center 
text-center text-white
"
>

    {/* Spinner */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center space-y-5"
    >
      <div className="relative">
        <div className="h-20 w-20 rounded-full border-4 border-t-transparent border-blue-500 animate-spin"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-10 w-10 bg-blue-400/60 rounded-full blur-md"
          ></motion.div>
        </div>
      </div>

      <h2 className="text-3xl font-bold drop-shadow-md">
        Texnik ishlar olib borilmoqda
      </h2>

      <p className="max-w-sm text-gray-300 text-sm">
        Ushbu sahifa vaqtincha ishlamaydi. Iltimos, keyinroq urinib ko‘ring.
      </p>
    </motion.div>
  </div>
)}


      <div className="relative max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Ko'p Yozuv Yuklash</h1>
          <p className="text-muted-foreground">
            Excel yoki CSV fayl orqali bir necha yozuvni birdan qo'shing
          </p>
        </motion.div>

        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                {t("bulkUpload.uploadTitle")}
              </CardTitle>
              <CardDescription>
                {t("bulkUpload.uploadDescription")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Template Download */}
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Download className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      {t("bulkUpload.templateDownload")}
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                      {t("bulkUpload.templateDescription")}
                    </p>
                    <Button onClick={downloadTemplate} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Template.csv
                    </Button>
                  </div>
                </div>
              </div>

              {/* File Input */}
              <div className="space-y-2">
                <Label htmlFor="file">Fayl tanlang</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="cursor-pointer"
                />
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Tanlangan: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {/* Progress Bar */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Yuklanmoqda...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full"
                size="lg"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Yuklanmoqda...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Yuklash
                  </>
                )}
              </Button>

              {/* Result */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-3"
                >
                  {/* Success */}
                  {result.success > 0 && (
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-100">
                          {result.success} ta yozuv muvaffaqiyatli qo'shildi
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Errors */}
                  {result.failed > 0 && (
                    <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                      <div className="flex items-start gap-3 mb-2">
                        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-red-900 dark:text-red-100 mb-2">
                            {result.failed} ta yozuvda xatolik
                          </p>
                          {result.errors.length > 0 && (
                            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                              {result.errors.slice(0, 5).map((error, idx) => (
                                <li key={idx}>• {error}</li>
                              ))}
                              {result.errors.length > 5 && (
                                <li className="font-semibold">
                                  ... va yana {result.errors.length - 5} ta xatolik
                                </li>
                              )}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Yo'riqnoma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-bold text-primary">1.</span>
                <p>Template faylni yuklab oling va to'ldiring</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-primary">2.</span>
                <p>Passport Seriya: AD, AB, KA, AE, AC</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-primary">3.</span>
                <p>Passport Code: 7 raqamli son (masalan: 1234567)</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-primary">4.</span>
                <p>Turi: NasiyaMijoz yoki TolovQilinmagan</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-primary">5.</span>
                <p>Oylar Soni: faqat NasiyaMijoz uchun (1-12)</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>



    </div>
  );
}