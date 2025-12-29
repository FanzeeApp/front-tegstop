import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Maxfiylik siyosati - Tegstop.uz</title>
        <meta name="description" content="Tegstop.uz platformasining maxfiylik siyosati" />
      </Helmet>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Orqaga
        </Button>

        <div className="prose dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-2">MAXFIYLIK SIYOSATI</h1>
          <h2 className="text-xl text-muted-foreground mb-8">TEGSTOP PLATFORMASI</h2>

          <p className="text-sm text-muted-foreground mb-8">Oxirgi yangilangan: 2025-yil</p>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">1. KIRISH</h3>
            <p>
              Ushbu Maxfiylik siyosati TEGSTOP platformasi ("biz", "bizning", "Platforma") tomonidan
              foydalanuvchilarning ("siz", "sizning", "Foydalanuvchi") shaxsiy ma'lumotlarini qanday
              yig'ishi, ishlatishi, saqlashi va himoya qilishini tushuntiradi.
            </p>
            <p>
              Platformadan foydalanish orqali siz ushbu Maxfiylik siyosati shartlariga rozilik bildirasiz.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">2. BIZ HAQIMIZDA</h3>
            <ul className="list-none space-y-2">
              <li><strong>Platforma nomi:</strong> TEGSTOP</li>
              <li><strong>Veb-sayt:</strong> https://tegstop.uz</li>
              <li><strong>Maqsad:</strong> Firibgarlarni aniqlash va tadbirkorlarni himoya qilish tizimi</li>
              <li><strong>Bog'lanish:</strong> tegstopuz@gmail.com</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">3. YIG'ILADIGAN MA'LUMOTLAR</h3>

            <h4 className="text-lg font-medium mt-4 mb-2">3.1 Siz taqdim etgan ma'lumotlar</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-4 py-2 text-left">Ma'lumot</th>
                    <th className="border border-border px-4 py-2 text-left">Maqsad</th>
                    <th className="border border-border px-4 py-2 text-left">Majburiy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-border px-4 py-2">Ism-familiya</td><td className="border border-border px-4 py-2">Identifikatsiya</td><td className="border border-border px-4 py-2">Ha</td></tr>
                  <tr><td className="border border-border px-4 py-2">Telefon raqami</td><td className="border border-border px-4 py-2">Aloqa va verifikatsiya</td><td className="border border-border px-4 py-2">Ha</td></tr>
                  <tr><td className="border border-border px-4 py-2">Elektron pochta</td><td className="border border-border px-4 py-2">Xabarnomalar</td><td className="border border-border px-4 py-2">Yo'q</td></tr>
                  <tr><td className="border border-border px-4 py-2">Do'kon nomi</td><td className="border border-border px-4 py-2">Biznes identifikatsiyasi</td><td className="border border-border px-4 py-2">Ha</td></tr>
                  <tr><td className="border border-border px-4 py-2">Parol</td><td className="border border-border px-4 py-2">Tizimga kirish</td><td className="border border-border px-4 py-2">Ha</td></tr>
                </tbody>
              </table>
            </div>

            <h4 className="text-lg font-medium mt-4 mb-2">3.2 Avtomatik yig'iladigan ma'lumotlar</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>IP manzil:</strong> Xavfsizlik va suiiste'molni aniqlash uchun</li>
              <li><strong>Brauzer turi:</strong> Texnik moslik uchun</li>
              <li><strong>Kirish vaqti:</strong> Xavfsizlik monitoringi uchun</li>
              <li><strong>Qurilma ma'lumotlari:</strong> Xizmat sifatini oshirish uchun</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">4. MA'LUMOTLARDAN FOYDALANISH</h3>

            <h4 className="text-lg font-medium mt-4 mb-2">4.1 Asosiy maqsadlar</h4>
            <ol className="list-decimal pl-6 space-y-1">
              <li><strong>Xizmat ko'rsatish:</strong> Platformaning asosiy funktsiyalarini ta'minlash</li>
              <li><strong>Autentifikatsiya:</strong> Foydalanuvchini aniqlash va kirish huquqini berish</li>
              <li><strong>Xavfsizlik:</strong> Firibgarlik va suiiste'molni oldini olish</li>
              <li><strong>Aloqa:</strong> Muhim xabarlar va yangilanishlar haqida xabar berish</li>
            </ol>

            <h4 className="text-lg font-medium mt-4 mb-2">4.2 Biz ISHLATMAYMIZ</h4>
            <ul className="list-none space-y-1">
              <li>❌ Reklama va marketing</li>
              <li>❌ Uchinchi shaxslarga sotish</li>
              <li>❌ Profil yaratish va kuzatish</li>
              <li>❌ Avtomatlashtirilgan qaror qabul qilish</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">5. MA'LUMOTLARNI SAQLASH VA HIMOYA QILISH</h3>

            <h4 className="text-lg font-medium mt-4 mb-2">5.1 Saqlash muddati</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-4 py-2 text-left">Ma'lumot turi</th>
                    <th className="border border-border px-4 py-2 text-left">Muddat</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-border px-4 py-2">Hisob ma'lumotlari</td><td className="border border-border px-4 py-2">Hisobni o'chirishgacha</td></tr>
                  <tr><td className="border border-border px-4 py-2">Firibgar ma'lumotlari</td><td className="border border-border px-4 py-2">5 yil</td></tr>
                  <tr><td className="border border-border px-4 py-2">Kirish loglari</td><td className="border border-border px-4 py-2">6 oy</td></tr>
                </tbody>
              </table>
            </div>

            <h4 className="text-lg font-medium mt-4 mb-2">5.2 Xavfsizlik choralari</h4>
            <ul className="list-none space-y-1">
              <li>✅ Parollar: bcrypt algoritmi bilan hash qilinadi</li>
              <li>✅ Pasport raqamlari: HMAC-SHA256 hash (original saqlanmaydi)</li>
              <li>✅ Barcha ulanishlar: HTTPS/TLS orqali</li>
              <li>✅ JWT token autentifikatsiya</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">6. SIZNING HUQUQLARINGIZ</h3>
            <p>O'zbekiston Respublikasining "Shaxsiy ma'lumotlar to'g'risida"gi Qonuniga muvofiq:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Kirish huquqi</strong> - O'z ma'lumotlaringizni ko'rish</li>
              <li><strong>Tuzatish huquqi</strong> - Noto'g'ri ma'lumotlarni to'g'rilash</li>
              <li><strong>O'chirish huquqi</strong> - Ma'lumotlaringizni o'chirishni so'rash</li>
              <li><strong>E'tiroz huquqi</strong> - Qayta ishlashga e'tiroz bildirish</li>
            </ul>
            <p className="mt-4">
              Huquqlaringizni amalga oshirish uchun: <strong>tegstopuz@gmail.com</strong>
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">7. ALOQA MA'LUMOTLARI</h3>
            <ul className="list-none space-y-2">
              <li><strong>Email:</strong> tegstopuz@gmail.com</li>
              <li><strong>Xavfsizlik:</strong> tegstopuz@gmail.com</li>
              <li><strong>Telegram:</strong> @tegstop_support</li>
              <li><strong>Veb-sayt:</strong> https://tegstop.uz</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">8. HUQUQIY ASOS</h3>
            <p>Ushbu Maxfiylik siyosati quyidagi qonunchilik hujjatlariga asoslanadi:</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>O'zbekiston Respublikasining "Shaxsiy ma'lumotlar to'g'risida"gi Qonuni (2019-yil)</li>
              <li>O'zbekiston Respublikasining "Axborotlashtirish to'g'risida"gi Qonuni</li>
              <li>O'zbekiston Respublikasining "Elektron tijorat to'g'risida"gi Qonuni</li>
            </ol>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            © 2025 TEGSTOP. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </div>
  );
}
