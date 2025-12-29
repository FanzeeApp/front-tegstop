import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Foydalanish shartlari - Tegstop.uz</title>
        <meta name="description" content="Tegstop.uz platformasining foydalanish shartlari" />
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
          <h1 className="text-3xl font-bold mb-2">FOYDALANISH SHARTLARI</h1>
          <h2 className="text-xl text-muted-foreground mb-8">TEGSTOP PLATFORMASI</h2>

          <p className="text-sm text-muted-foreground mb-8">Oxirgi yangilangan: 2025-yil</p>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">1. UMUMIY QOIDALAR</h3>
            <p>
              TEGSTOP platformasidan foydalanish orqali siz ushbu Foydalanish shartlariga rozilik
              bildirasiz. Agar siz ushbu shartlarga rozi bo'lmasangiz, platformadan foydalanmang.
            </p>
            <p>
              Platforma firibgarlarni aniqlash va tadbirkorlarni himoya qilish maqsadida yaratilgan
              axborot tizimi hisoblanadi.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">2. PLATFORMADAN FOYDALANISH</h3>

            <h4 className="text-lg font-medium mt-4 mb-2">2.1 Ro'yxatdan o'tish</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Platformadan foydalanish uchun ro'yxatdan o'tish talab qilinadi</li>
              <li>Siz haqiqiy va to'g'ri ma'lumotlar taqdim etishingiz shart</li>
              <li>Foydalanuvchi 18 yoshdan katta bo'lishi kerak</li>
              <li>Bir shaxs faqat bitta hisob yaratishi mumkin</li>
            </ul>

            <h4 className="text-lg font-medium mt-4 mb-2">2.2 Ruxsat etilgan harakatlar</h4>
            <ul className="list-none space-y-1">
              <li>✅ Firibgarlar haqida haqiqiy ma'lumot qo'shish</li>
              <li>✅ Pasport raqami bo'yicha qidiruv</li>
              <li>✅ O'z yozuvlarini boshqarish</li>
              <li>✅ Referal dasturida ishtirok etish</li>
            </ul>

            <h4 className="text-lg font-medium mt-4 mb-2">2.3 Taqiqlangan harakatlar</h4>
            <ul className="list-none space-y-1">
              <li>❌ Yolg'on yoki asossiz ma'lumotlar qo'shish</li>
              <li>❌ Boshqa foydalanuvchilarning hisoblariga kirish</li>
              <li>❌ Tizimni buzish yoki hujum qilish</li>
              <li>❌ Shaxsiy ma'lumotlarni noqonuniy to'plash</li>
              <li>❌ Platformani boshqa maqsadlarda ishlatish</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">3. FOYDALANUVCHI MAS'ULIYATI</h3>
            <p>Foydalanuvchi quyidagilar uchun to'liq mas'uliyat oladi:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Qo'shilgan ma'lumotlarning haqiqiyligi va to'g'riligi</li>
              <li>Hisobning xavfsizligi (parol, login)</li>
              <li>Platformadan foydalanish natijasida kelib chiqadigan oqibatlar</li>
              <li>Uchinchi shaxslarning huquqlarini hurmat qilish</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">4. PLATFORMA MAS'ULIYATI</h3>
            <p>TEGSTOP platformasi:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Ma'lumotlarning to'g'riligi va haqiqiyligiga kafolat bermaydi</li>
              <li>Foydalanuvchilar tomonidan qo'shilgan ma'lumotlar uchun javobgar emas</li>
              <li>Xizmat ko'rsatishni istalgan vaqtda to'xtatish huquqini saqlab qoladi</li>
              <li>Texnik nosozliklar uchun javobgarlikni cheklab qo'yadi</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">5. SHAXSIY MA'LUMOTLAR</h3>
            <p>
              Shaxsiy ma'lumotlarni qayta ishlash va himoya qilish bo'yicha batafsil ma'lumot uchun
              bizning <a href="/privacy-policy" className="text-primary underline">Maxfiylik siyosati</a>ni
              o'qing.
            </p>
            <p>Platformadan foydalanish orqali siz:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Maxfiylik siyosati bilan tanishganingizni tasdiqlaysiz</li>
              <li>Ma'lumotlaringizni ko'rsatilgan maqsadlarda qayta ishlashga rozilik bildirasiz</li>
              <li>18 yoshdan katta ekanligingizni tasdiqlaysiz</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">6. REFERAL DASTURI</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Har bir taklif qilingan foydalanuvchi tasdiqlanganda bonus beriladi</li>
              <li>Bonuslar faqat haqiqiy foydalanuvchilar uchun beriladi</li>
              <li>Soxta hisoblar yaratish taqiqlanadi va bonuslar bekor qilinadi</li>
              <li>Platforma referal shartlarini o'zgartirish huquqini saqlab qoladi</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">7. INTELLEKTUAL MULK</h3>
            <p>
              TEGSTOP platformasi, uning dizayni, logotipi va kontenti platforma egasining
              intellektual mulki hisoblanadi. Ruxsatsiz nusxalash yoki tarqatish taqiqlanadi.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">8. NIZOLARNI HAL QILISH</h3>
            <p>
              Ushbu shartlardan kelib chiqadigan barcha nizolar O'zbekiston Respublikasi
              qonunchiligiga muvofiq hal qilinadi.
            </p>
            <p>
              Nizolarni sudga murojaat qilishdan oldin muzokaralar yo'li bilan hal qilishga
              harakat qiling: support@tegstop.uz
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">9. O'ZGARISHLAR</h3>
            <p>
              Biz ushbu Foydalanish shartlarini vaqti-vaqti bilan yangilashimiz mumkin.
              Muhim o'zgarishlar haqida email orqali xabar beriladi.
            </p>
            <p>
              Yangilanishlardan keyin platformadan foydalanishni davom ettirsangiz,
              yangi shartlarga rozilik bildirilgan hisoblanadi.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">10. ALOQA</h3>
            <ul className="list-none space-y-2">
              <li><strong>Email:</strong> support@tegstop.uz</li>
              <li><strong>Telegram:</strong> @tegstop_support</li>
              <li><strong>Veb-sayt:</strong> https://tegstop.uz</li>
            </ul>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            © 2025 TEGSTOP. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </div>
  );
}
