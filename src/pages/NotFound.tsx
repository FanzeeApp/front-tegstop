import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { trackEvent, trackError } from "@/utils/analytics";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // 404 xatolik tracking
    trackError(`404 - Sahifa topilmadi: ${location.pathname}`, "NotFound");
    trackEvent('page_not_found', {
      page_location: window.location.href,
      attempted_path: location.pathname,
      referrer: document.referrer || 'direct',
    });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Helmet>
        <title>404 - Sahifa Topilmadi | Tegstop.uz</title>
        <meta name="description" content="Kechirasiz, siz qidirayotgan sahifa topilmadi." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
        <a 
          href="/" 
          className="text-blue-500 underline hover:text-blue-700"
          onClick={() => {
            trackEvent('click_return_home_from_404', {
              from_path: location.pathname,
            });
          }}
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;