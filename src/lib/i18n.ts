import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uz from '@/locales/uz.json';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';

// localStorage dan saqlangan tilni olish
const getSavedLanguage = (): string => {
  try {
    const saved = localStorage.getItem('language');
    if (saved && ['uz', 'ru', 'en'].includes(saved)) {
      return saved;
    }
  } catch (e) {
    // localStorage mavjud emas
  }
  return 'uz';
};

i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uz },
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: getSavedLanguage(),
  fallbackLng: 'uz',
  interpolation: {
    escapeValue: false,
  },
});

// Til o'zgarganda localStorage ga saqlash
i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('language', lng);
  } catch (e) {
    // localStorage mavjud emas
  }
});

export default i18n;
