import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Moon, Sun, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { trackEvent, trackAuth, trackButtonClick } from "@/utils/analytics";

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    const previousLanguage = i18n.language;
    i18n.changeLanguage(lng);
    setMobileMenuOpen(false);

    // Til o'zgarishini tracking
    trackEvent('language_change', {
      from_language: previousLanguage,
      to_language: lng,
      location: location.pathname,
      device: mobileMenuOpen ? 'mobile' : 'desktop',
    });
  };

  const handleLogout = () => {
    // Logout tracking
    trackAuth('logout', 'navbar');
    trackEvent('navbar_logout', {
      from_page: location.pathname,
      device: mobileMenuOpen ? 'mobile' : 'desktop',
    });

    // Logout qilish (localStorage.clear() logout() ichida)
    logout();
    setMobileMenuOpen(false);

    // Login sahifasiga yo'naltirish (navigate ishlatish - reload yo'q!)
    navigate('/login', { replace: true });
  };

  // Theme toggle tracking
  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    toggleTheme();

    trackEvent('theme_toggle', {
      from_theme: theme,
      to_theme: newTheme,
      location: location.pathname,
      device: mobileMenuOpen ? 'mobile' : 'desktop',
    });
  };

  // Navigation tracking
  const handleNavClick = (path: string, label: string) => {
    trackEvent('navbar_navigation', {
      from_page: location.pathname,
      to_page: path,
      link_label: label,
      device: mobileMenuOpen ? 'mobile' : 'desktop',
    });

    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  // Mobile menu toggle tracking
  const handleMobileMenuToggle = () => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);

    trackEvent('mobile_menu_toggle', {
      action: newState ? 'open' : 'close',
      page: location.pathname,
    });
  };

  // Logo click tracking
  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      trackButtonClick('navbar_logo', 'navigation');
      trackEvent('logo_click', {
        from_page: location.pathname,
      });
    }
  };


  const navLinks = [
    { path: "/", label: t("nav.home") },
    { path: "/my-records", label: t("nav.myRecords") },
    { path: "/add-record", label: t("nav.addRecord") },
    { path: "/bulk-upload", label: t("nav.bulkUpload") }, // Yangi
    { path: "/profile", label: t("nav.profile") },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={handleLogoClick}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-primary"
            >
              {t("app.title")}
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                onClick={() => handleNavClick(link.path, link.label)}
              >
                <Button
                  variant={isActive(link.path) ? "default" : "ghost"}
                  className="relative"
                >
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary rounded-md -z-10"
                    />
                  )}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Language Switcher */}
            <div className="flex items-center space-x-1 bg-secondary rounded-lg p-1">
              {["uz", "ru", "en"].map((lng) => (
                <button
                  key={lng}
                  onClick={() => changeLanguage(lng)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    i18n.language === lng
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lng.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              className="rounded-full"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: theme === "dark" ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </motion.div>
            </Button>

            {/* User Info & Logout */}
            {user && (
              <div className="flex items-center space-x-2 ml-2 pl-2 border-l border-border">
                <span className="text-sm text-muted-foreground">
                  {user.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-destructive hover:text-destructive"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={handleMobileMenuToggle}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4 space-y-2"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => handleNavClick(link.path, link.label)}
                >
                  <Button
                    variant={isActive(link.path) ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}

              {/* Mobile Language Switcher */}
              <div className="flex items-center space-x-2 pt-2">
                {["uz", "ru", "en"].map((lng) => (
                  <button
                    key={lng}
                    onClick={() => changeLanguage(lng)}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      i18n.language === lng
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {lng.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Mobile Theme Toggle */}
              <Button
                variant="outline"
                onClick={handleThemeToggle}
                className="w-full"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 mr-2" />
                ) : (
                  <Sun className="h-5 w-5 mr-2" />
                )}
                {t(`theme.${theme === "light" ? "dark" : "light"}`)}
              </Button>

              {/* Mobile Logout */}
              {user && (
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  {t("nav.logout")}
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};