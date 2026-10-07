import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, Theme } from '../types';
import { translations } from '../i18n/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  favorites: string[];
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  recentTools: string[];
  addRecentTool: (toolId: string) => void;
  clearRecentTools: () => void;
  t: typeof translations.en;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('filetools_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Language state
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('filetools_lang');
    return saved === 'bn' ? 'bn' : 'en';
  });

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('filetools_favorites');
      return saved ? JSON.parse(saved) : ['img-to-jpg', 'pdf-merge', 'image-compress', 'ocr-image-to-text'];
    } catch {
      return [];
    }
  });

  // Recent tools state
  const [recentTools, setRecentTools] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('filetools_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('filetools_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('filetools_lang', lang);
  };

  const toggleFavorite = (toolId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId];
      localStorage.setItem('filetools_favorites', JSON.stringify(next));
      return next;
    });
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);

  const addRecentTool = (toolId: string) => {
    setRecentTools((prev) => {
      const filtered = prev.filter((id) => id !== toolId);
      const next = [toolId, ...filtered].slice(0, 8);
      localStorage.setItem('filetools_recent', JSON.stringify(next));
      return next;
    });
  };

  const clearRecentTools = () => {
    setRecentTools([]);
    localStorage.removeItem('filetools_recent');
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        toggleTheme,
        favorites,
        toggleFavorite,
        isFavorite,
        recentTools,
        addRecentTool,
        clearRecentTools,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
