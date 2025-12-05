// Google Analytics 4 utility funksiyalari

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      params?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

const GA_MEASUREMENT_ID = 'G-78JNRPT98X';

// gtag mavjudligini tekshiruvchi yordamchi funksiya
const isGAAvailable = () => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Sahifa ko‘rinishini kuzatish
export const trackPageView = (url: string) => {
  if (!isGAAvailable()) return;

  window.gtag!('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Event yuborish
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (!isGAAvailable()) return;

  window.gtag!('event', eventName, eventParams);
};

// Tugma bosilishini kuzatish
export const trackButtonClick = (
  buttonName: string,
  category: string = 'engagement'
) => {
  trackEvent('button_click', {
    event_category: category,
    event_label: buttonName,
  });
};

// Login / Logout kuzatish
export const trackAuth = (action: 'login' | 'logout', method = 'email') => {
  trackEvent(action, {
    method,
  });
};

// Ma'lumot qo'shish / o'chirish / tahrirlash
export const trackRecord = (action: 'add' | 'edit' | 'delete') => {
  trackEvent(`record_${action}`, {
    event_category: 'records',
  });
};

// Form yuborishni kuzatish
export const trackFormSubmit = (formName: string) => {
  trackEvent('form_submit', {
    event_category: 'forms',
    event_label: formName,
  });
};

// Qidiruv kuzatish
export const trackSearch = (searchTerm: string) => {
  trackEvent('search', {
    search_term: searchTerm,
  });
};

// Xatolikni kuzatish
export const trackError = (message: string, location: string) => {
  trackEvent('error', {
    event_category: 'errors',
    event_label: message,
    error_location: location,
  });
};
