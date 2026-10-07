import React from 'react';
import { useApp } from '../context/AppContext';
import { AdsterraAd } from '../components/AdsterraAd';
import { Mail } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {t.about.title}
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {t.about.subtitle}
        </p>
      </div>

      {/* Developer Information Card */}
      <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-white p-8 dark:border-indigo-900/60 dark:from-slate-900 dark:to-indigo-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="https://pxdrop.online/raw/db2q5e281qec73f6opbg"
              alt="File Tools Logo"
              className="h-16 w-16 rounded-2xl object-contain shadow-xs"
            />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Engineering Team
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.about.devCompany}
              </h2>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <Mail className="h-3.5 w-3.5 text-indigo-500" />
                <a
                  href={`mailto:${t.about.devEmail}`}
                  className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {t.about.devEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purpose & Mission */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {t.about.storyTitle}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {t.about.storyDesc}
        </p>
      </div>

      {/* Guiding Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {t.about.guidingPrinciples.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 text-center"
          >
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold">
              {idx + 1}
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <AdsterraAd slot="banner" />
    </div>
  );
};
