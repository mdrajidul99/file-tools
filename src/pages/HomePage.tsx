import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, TOOLS } from '../data/toolsRegistry';
import { Icon } from '../components/Icon';
import { AdsterraAd, AdsterraSlot1 } from '../components/AdsterraAd';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Layers,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSearch }) => {
  const { language, t } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const popularTools = TOOLS.filter(
    (t) => t.badge === 'Popular' || t.badge === 'Essential'
  ).slice(0, 8);

  const filteredTools =
    activeFilter === 'all'
      ? popularTools
      : TOOLS.filter((t) => t.categoryId === activeFilter || t.tags.includes(activeFilter)).slice(
          0,
          8
        );

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          {/* Main Headline */}
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-white">
            <span>{t.hero.titleHighlight} </span>
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              {t.hero.titleEnd}
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.subtagline}
          </p>

          {/* Prominent Search Bar Trigger */}
          <div className="mx-auto mt-8 max-w-xl">
            <button
              onClick={onOpenSearch}
              className="group flex w-full items-center justify-between rounded-2xl border border-slate-300 bg-white p-3.5 sm:p-4 text-left shadow-lg shadow-indigo-100/40 transition hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none"
            >
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-indigo-600 transition group-hover:scale-110 dark:text-indigo-400" />
                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {t.nav.searchPlaceholder}
                </span>
              </div>
              <span className="hidden sm:inline rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                Explore All Tools
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Top Banner Advertisement */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdsterraAd slot="banner" />
      </div>

      {/* 3. 10 Main Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-slate-200/80 pb-4 dark:border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            <span>{language === 'bn' ? 'ফাইল ইউটিলিটি প্ল্যাটফর্ম' : 'File Utility Suite'}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {language === 'bn' ? 'টুলস ক্যাটাগরি সমূহ' : 'Explore by Category'}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {language === 'bn'
              ? 'আপনার প্রয়োজনীয় ফাইল টুল সহজে খুঁজে পেতে নিচের ক্যাটাগরিগুলো থেকে বেছে নিন'
              : 'Browse all available categories to quickly find and launch the right tool for your files'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate(`/category/${cat.id}`)}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700 cursor-pointer"
            >
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/70 dark:text-indigo-400">
                  <Icon name={cat.iconName} className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition">
                  {cat.name[language]}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {cat.description[language]}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <span>{cat.toolCount} Tools</span>
                <span className="flex items-center text-indigo-600 group-hover:translate-x-1 transition dark:text-indigo-400">
                  {t.common.viewTools}
                  <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Popular & Featured Tools */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Featured File Utilities
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Instant in-browser processing with zero setup
            </p>
          </div>
          <button
            onClick={() => onNavigate('/tools')}
            className="self-start sm:self-auto flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition"
          >
            <span>{t.common.viewAll}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { id: 'all', label: t.hero.quickFilters.all },
            { id: 'pdf', label: t.hero.quickFilters.pdf },
            { id: 'image', label: t.hero.quickFilters.image },
            { id: 'compress', label: t.hero.quickFilters.compress },
            { id: 'convert', label: t.hero.quickFilters.convert },
            { id: 'ocr', label: t.hero.quickFilters.ocr },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400">
                    <Icon name={tool.iconName} className="h-5 w-5" />
                  </div>
                  {tool.badge && (
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition">
                  {tool.name[language]}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {tool.description[language]}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onNavigate(`/tool/${tool.slug}`)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-600 hover:text-white dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-indigo-600 dark:hover:text-white transition"
                >
                  <span>Launch Tool</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dedicated Second Advertisement Placement (Slot 1: 320x50 Banner) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdsterraSlot1 />
      </div>

      {/* 6. Why Browser-Side Processing Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40 p-8 sm:p-12 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Why File Tools is Different
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We engineered our utilities to run directly inside your client browser using WebAssembly and modern Web Crypto. Your documents and personal files never touch remote cloud servers.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-xs backdrop-blur-xs dark:border-slate-800 dark:bg-slate-950/60 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">100% Private</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Files are processed strictly in your local memory. Zero uploads to external servers.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-xs backdrop-blur-xs dark:border-slate-800 dark:bg-slate-950/60 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Blazing Fast</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Zero upload delays. Conversions happen in milliseconds powered by your device hardware.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-xs backdrop-blur-xs dark:border-slate-800 dark:bg-slate-950/60 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Completely Free</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                No sign-up, no hidden fees, no credit card requirements, and no daily file quotas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
