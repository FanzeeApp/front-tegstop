/**
 * Barcha cache va storage ni tozalash
 */
export const clearAllCache = async () => {
    try {
      // 1. LocalStorage tozalash
      localStorage.clear();
      
      // 2. SessionStorage tozalash
      sessionStorage.clear();
      
      // 3. Service Worker Cache tozalash
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CLEAR_CACHE'
        });
      }
      
      // 4. Cache Storage API tozalash
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }
      
      // 5. IndexedDB tozalash (agar ishlatilsa)
      if ('indexedDB' in window) {
        const databases = await indexedDB.databases();
        databases.forEach(db => {
          if (db.name) {
            indexedDB.deleteDatabase(db.name);
          }
        });
      }
      
      console.log('✅ All cache cleared successfully');
      return true;
    } catch (error) {
      console.error('❌ Error clearing cache:', error);
      return false;
    }
  };
  
  /**
   * Faqat user data tozalash (theme ni saqlab qolish)
   */
  export const clearUserData = () => {
    const theme = localStorage.getItem('theme-storage');
    const language = localStorage.getItem('i18nextLng');
    
    // Barcha storage tozalash
    localStorage.clear();
    sessionStorage.clear();
    
    // Theme va tilni qaytarish
    if (theme) localStorage.setItem('theme-storage', theme);
    if (language) localStorage.setItem('i18nextLng', language);
    
    console.log('✅ User data cleared, theme preserved');
  };