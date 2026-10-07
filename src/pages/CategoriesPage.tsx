import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/toolsRegistry';
import { Icon } from '../components/Icon';
import { AdsterraAd } from '../components/AdsterraAd';
import { ChevronRight } from 'lucide-react';

interface Props {
  onNavigate: (path: string) => void;
}

export const CategoriesPage: React.FC<Props> = ({ onNavigate }) => {
  const { language, t } = useApp();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          All Tool Categories
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Explore specialized toolkits tailored for images, PDFs, documents, archives, data, and security
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onNavigate(`/category/${cat.id}`)}
            className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700 cursor-pointer"
          >
            <div>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/70 dark:text-indigo-400">
                <Icon name={cat.iconName} className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition">
                {cat.name[language]}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {cat.description[language]}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-mono">
                {cat.toolCount} Tools
              </span>
              <span className="flex items-center text-indigo-600 group-hover:translate-x-1 transition dark:text-indigo-400">
                {t.common.viewTools}
                <ChevronRight className="h-4 w-4 ml-0.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      <AdsterraAd slot="banner" />
    </div>
  );
};
