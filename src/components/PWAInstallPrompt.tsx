import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '@/utils/analytics';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Allaqachon o'rnatilganligini tekshirish
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      
      // PWA da ishlatilganini tracking
      trackEvent('pwa_in_use', {
        platform: getPlatform(),
        display_mode: 'standalone',
      });
      
      return;
    }

    // Install prompt ni ushlash
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // 3 soniya kutib ko'rsatish
      setTimeout(() => {
        setShowPrompt(true);
        trackEvent('pwa_install_prompt_shown', {
          platform: getPlatform(),
          page: window.location.pathname,
          user_agent: navigator.userAgent,
        });
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // PWA o'rnatilganda
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      trackEvent('pwa_installed_success', {
        platform: getPlatform(),
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
      });
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Install tugmasi bosilganda tracking
    trackEvent('pwa_install_button_clicked', {
      platform: getPlatform(),
      page: window.location.pathname,
    });

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    // User qarorini tracking
    trackEvent('pwa_install_user_choice', {
      outcome: outcome, // 'accepted' or 'dismissed'
      platform: getPlatform(),
      page: window.location.pathname,
    });

    if (outcome === 'accepted') {
      console.log('✅ User accepted PWA install');
      trackEvent('pwa_install_accepted', {
        platform: getPlatform(),
      });
    } else {
      console.log('❌ User dismissed PWA install');
      trackEvent('pwa_install_rejected', {
        platform: getPlatform(),
      });
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleClose = () => {
    setShowPrompt(false);
    
    // X tugmasi yoki "Keyinroq" tugmasi bosilganda tracking
    trackEvent('pwa_install_prompt_closed', {
      platform: getPlatform(),
      page: window.location.pathname,
      action: 'manual_close',
    });
  };

  // Agar allaqachon o'rnatilgan bo'lsa yoki prompt yo'q bo'lsa
  if (isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <Card className="shadow-2xl border-2 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Download className="w-5 h-5 text-primary" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">
                    Ilovani o'rnatish
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Tegstop ilovasini telefoningizga o'rnating va tezroq kirish imkoniyatiga ega bo'ling
                  </p>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={handleInstall}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      O'rnatish
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleClose}
                    >
                      Keyinroq
                    </Button>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="flex-shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

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