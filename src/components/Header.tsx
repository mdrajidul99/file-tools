import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Moon, Sun, Search, Menu, X, Globe } from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onOpenSearch }) => {
  const { theme, toggleTheme, language, setLanguage, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.allTools, path: '/tools' },
    { label: t.nav.categories, path: '/categories' },
    { label: t.nav.howToUse, path: '/how-to-use' },
    { label: t.nav.about, path: '/about' },
    { label: t.nav.contact, path: '/contact' },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-colors dark:border-slate-800/80 dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleNav('/')}
            className="group flex items-center gap-3 text-left focus:outline-none"
          >
            <img
              src="https://pxdrop.online/raw/db2q5e281qec73f6opbg"
              alt="File Tools Logo"
              className="h-10 w-10 rounded-xl object-contain shadow-xs transition-transform duration-200 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                File Tools
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-500 transition hover:border-indigo-300 hover:bg-white hover:text-indigo-600 sm:px-4 sm:py-2 sm:text-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-indigo-700 dark:hover:bg-slate-900 dark:hover:text-indigo-400"
            title="Search tools"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">{t.nav.searchPlaceholder.slice(0, 24)}...</span>
            <kbd className="hidden rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-mono text-slate-600 sm:inline dark:bg-slate-800 dark:text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:border-indigo-400 hover:bg-white hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-600 dark:hover:text-indigo-400"
            title="Switch Language"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="h-5 w-5 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-900"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white/95 px-4 pt-2 pb-6 backdrop-blur-md lg:hidden dark:border-slate-800 dark:bg-slate-950/95">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
