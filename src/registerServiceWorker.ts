import { trackEvent } from './utils/analytics';

export function registerServiceWorker() {
  // Development da service worker ni disable qilish
  if (import.meta.env.DEV) {
    console.log('⚠️ Service Worker disabled in development mode');
    return;
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration.scope);
          
          // PWA installed tracking
          trackEvent('pwa_service_worker_registered', {
            scope: registration.scope,
          });

          // Yangilanishlarni FAQAT log qilish, xabar ko'rsatmaslik
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Faqat console log, xabar yo'q
                  console.log('🔄 Yangilanish mavjud (background da yangilanadi)');
                  
                  trackEvent('pwa_update_available', {
                    version: 'v1',
                  });

                  // XABAR YO'Q! Faqat avtomatik yangilanadi
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
          
          trackEvent('pwa_service_worker_error', {
            error: error.message,
          });
        });
    });

    // PWA install prompt ni to'xtatish
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      console.log('💡 PWA install prompt blocked');
    });

    // PWA installed
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA successfully installed');
      
      trackEvent('pwa_installed', {
        platform: getPlatform(),
        timestamp: new Date().toISOString(),
      });
    });
  }
}

function getPlatform(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'iOS';
  } else if (/android/.test(userAgent)) {
    return 'Android';
  } else if (/windows/.test(userAgent)) {
    return 'Windows';
  } else if (/mac/.test(userAgent)) {
    return 'macOS';
  }
  
  return 'Unknown';
}