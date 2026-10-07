import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { HomePage } from './pages/HomePage';
import { AllToolsPage } from './pages/AllToolsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { ToolPage } from './pages/ToolPage';
import { HowToUsePage } from './pages/HowToUsePage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { TOOLS } from './data/toolsRegistry';
import { CategoryId } from './types';

// Helper to extract clean app route from current window location
function getCurrentRoute(): string {
  // Check hash first: e.g. "#/tool/image-to-jpg"
  const hash = window.location.hash;
  if (hash.startsWith('#/')) {
    return hash.slice(1);
  } else if (hash.startsWith('#')) {
    return hash.slice(1) || '/';
  }

  // Next check pathname (stripping repo subpath "/file-tools")
  let path = window.location.pathname;
  if (path.startsWith('/file-tools/')) {
    path = path.replace('/file-tools', '');
  } else if (path === '/file-tools') {
    path = '/';
  }
  return path || '/';
}

const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(getCurrentRoute);
  const [searchOpen, setSearchOpen] = useState(false);

  // Sync with browser navigation (popstate & hashchange)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getCurrentRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (path: string) => {
    if (!path.startsWith('/')) path = `/${path}`;
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route Dispatcher
  const renderCurrentView = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '') {
      return (
        <HomePage
          onNavigate={navigate}
          onOpenSearch={() => setSearchOpen(true)}
        />
      );
    }

    // 2. All Tools
    if (currentPath === '/tools') {
      return <AllToolsPage onNavigate={navigate} />;
    }

    // 3. Categories
    if (currentPath === '/categories') {
      return <CategoriesPage onNavigate={navigate} />;
    }

    // 4. Category Detail: /category/:id
    if (currentPath.startsWith('/category/')) {
      const catId = currentPath.replace('/category/', '').split('/')[0] as CategoryId;
      return <CategoryDetailPage categoryId={catId} onNavigate={navigate} />;
    }

    // 5. Tool Detail: /tool/:slug
    if (currentPath.startsWith('/tool/')) {
      const slug = currentPath.replace('/tool/', '').split('/')[0];
      const foundTool = TOOLS.find((t) => t.slug === slug || t.id === slug);
      if (foundTool) {
        return <ToolPage tool={foundTool} onNavigate={navigate} />;
      }
      return <NotFoundPage onNavigate={navigate} />;
    }

    // 6. Informational Pages
    if (currentPath === '/how-to-use') {
      return <HowToUsePage />;
    }
    if (currentPath === '/privacy') {
      return <PrivacyPolicyPage />;
    }
    if (currentPath === '/terms') {
      return <TermsPage />;
    }
    if (currentPath === '/about') {
      return <AboutPage />;
    }
    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    // Default 404
    return <NotFoundPage onNavigate={navigate} />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <Header
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <main className="flex-1">{renderCurrentView()}</main>

      <Footer onNavigate={navigate} />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectTool={(slug) => navigate(`/tool/${slug}`)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
