import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TOOLS } from '../data/toolsRegistry';
import { Icon } from './Icon';
import { Search, X, ArrowRight, Star } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (slug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectTool }) => {
  const { language, t, isFavorite, toggleFavorite } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard navigation & Esc listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();
  const filteredTools = trimmed
    ? TOOLS.filter((tool) => {
        const nameEn = tool.name.en.toLowerCase();
        const nameBn = tool.name.bn.toLowerCase();
        const descEn = tool.description.en.toLowerCase();
        const descBn = tool.description.bn.toLowerCase();
        const tags = tool.tags.join(' ').toLowerCase();
        const category = tool.categoryId.toLowerCase();
        const extensions = (tool.acceptedExtensions || []).join(' ').toLowerCase();

        return (
          nameEn.includes(trimmed) ||
          nameBn.includes(trimmed) ||
          descEn.includes(trimmed) ||
          descBn.includes(trimmed) ||
          tags.includes(trimmed) ||
          category.includes(trimmed) ||
          extensions.includes(trimmed)
        );
      })
    : TOOLS.slice(0, 8); // show popular default suggestions

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3.5 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.nav.searchPlaceholder}
            className="ml-3 flex-1 bg-transparent text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="mr-2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden rounded bg-slate-100 px-2 py-1 text-xs font-mono text-slate-500 sm:inline dark:bg-slate-800">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 sm:p-3">
          {filteredTools.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {t.common.noToolsFound}
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Try searching for 'PDF', 'Compress', 'JPG', 'Crop', or 'JSON'
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {!query && (
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Popular Tools
                </div>
              )}
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="group flex items-center justify-between rounded-xl p-2.5 transition hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40"
                >
                  <button
                    onClick={() => {
                      onSelectTool(tool.slug);
                      onClose();
                    }}
                    className="flex flex-1 items-center gap-3 text-left focus:outline-none"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100/70 text-indigo-600 transition group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-900/40 dark:text-indigo-400">
                      <Icon name={tool.iconName} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {tool.name[language]}
                        </span>
                        {tool.badge && (
                          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {tool.description[language]}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 pl-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tool.id);
                      }}
                      className={`rounded-lg p-1.5 transition ${
                        isFavorite(tool.id)
                          ? 'text-amber-500'
                          : 'text-slate-300 hover:text-amber-500 dark:text-slate-600'
                      }`}
                      title={isFavorite(tool.id) ? t.common.removeFavorite : t.common.saveFavorite}
                    >
                      <Star className="h-4 w-4 fill-current" />
                    </button>
                    <button
                      onClick={() => {
                        onSelectTool(tool.slug);
                        onClose();
                      }}
                      className="rounded-lg p-1.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
