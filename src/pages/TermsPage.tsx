import React from 'react';
import { useApp } from '../context/AppContext';
import { AdsterraAd } from '../components/AdsterraAd';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
          <FileText className="h-4 w-4" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {t.terms.title}
        </h1>
        <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          {t.terms.lastUpdated}
        </p>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {t.terms.intro}
        </p>
      </div>

      <div className="space-y-6">
        {t.terms.sections.map((sec, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900"
          >
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{sec.title}</h2>
            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {sec.content}
            </p>
          </div>
        ))}
      </div>

      <AdsterraAd slot="banner" />
    </div>
  );
};
