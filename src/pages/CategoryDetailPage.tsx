import React from 'react';
import { useApp } from '../context/AppContext';
import { CategoryId } from '../types';
import { CATEGORIES, TOOLS } from '../data/toolsRegistry';
import { Icon } from '../components/Icon';
import { AdsterraAd } from '../components/AdsterraAd';
import { ChevronRight, ArrowRight, Star } from 'lucide-react';

interface Props {
  categoryId: CategoryId;
  onNavigate: (path: string) => void;
}

export const CategoryDetailPage: React.FC<Props> = ({ categoryId, onNavigate }) => {
  const { language, t, isFavorite, toggleFavorite } = useApp();

  const category = CATEGORIES.find((c) => c.id === categoryId);
  const categoryTools = TOOLS.filter((t) => t.categoryId === categoryId);

  if (!category) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold">Category not found</h2>
        <button
          onClick={() => onNavigate('/categories')}
          className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
        >
          View All Categories
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <button onClick={() => onNavigate('/')} className="hover:text-indigo-600">
          {t.nav.home}
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <button onClick={() => onNavigate('/categories')} className="hover:text-indigo-600">
          {t.nav.categories}
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-semibold text-slate-900 dark:text-white">
          {category.name[language]}
        </span>
      </nav>

      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <Icon name={category.iconName} className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {category.name[language]}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              {category.description[language]}
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 self-start sm:self-auto font-mono">
          {categoryTools.length} Utilities Available
        </div>
      </div>

      {/* Tools in Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categoryTools.map((tool) => (
          <div
            key={tool.id}
            className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400">
                  <Icon name={tool.iconName} className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  {tool.badge && (
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {tool.badge}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(tool.id);
                    }}
                    className={`p-1 transition ${
                      isFavorite(tool.id)
                        ? 'text-amber-500'
                        : 'text-slate-300 hover:text-amber-500 dark:text-slate-600'
                    }`}
                  >
                    <Star className="h-4 w-4 fill-current" />
                  </button>
                </div>
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

      <AdsterraAd slot="banner" />
    </div>
  );
};
