import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, TOOLS } from '../data/toolsRegistry';
import { Icon } from '../components/Icon';
import { AdsterraAd } from '../components/AdsterraAd';
import { Search, ArrowRight, Star, Filter } from 'lucide-react';

interface Props {
  onNavigate: (path: string) => void;
}

export const AllToolsPage: React.FC<Props> = ({ onNavigate }) => {
  const { language, t, isFavorite, toggleFavorite } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCat = selectedCategory === 'all' || tool.categoryId === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesCat;

    const matchesQuery =
      tool.name.en.toLowerCase().includes(query) ||
      tool.name.bn.toLowerCase().includes(query) ||
      tool.description.en.toLowerCase().includes(query) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(query));

    return matchesCat && matchesQuery;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            All File Utilities ({TOOLS.length})
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Browse our complete directory of browser-native converters, editors, and security tools
          </p>
        </div>

        {/* Filter Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter tools by keyword..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 focus:outline-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          All ({TOOLS.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {cat.name[language]} ({cat.toolCount})
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
            {t.common.noToolsFound}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Clear filters and view all tools
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
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
                      title={isFavorite(tool.id) ? t.common.removeFavorite : t.common.saveFavorite}
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
      )}

      {/* Adsterra Advertisement */}
      <AdsterraAd slot="banner" />
    </div>
  );
};
