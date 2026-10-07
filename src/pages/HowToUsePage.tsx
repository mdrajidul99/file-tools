import React from 'react';
import { useApp } from '../context/AppContext';
import { AdsterraAd } from '../components/AdsterraAd';
import { ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';

export const HowToUsePage: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {t.howToUse.title}
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {t.howToUse.subtitle}
        </p>
      </div>

      {/* 4 Step Visual Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {t.howToUse.steps.map((step) => (
          <div
            key={step.num}
            className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-bold text-white shadow-xs">
              {step.num}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {step.title}
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Privacy Guarantee Box */}
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-8 dark:border-emerald-950 dark:bg-emerald-950/30">
        <div className="flex items-center gap-3 mb-3">
          <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold text-emerald-950 dark:text-emerald-200">
            {t.howToUse.privacyNoteTitle}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-300 leading-relaxed">
          {t.howToUse.privacyNoteDesc}
        </p>
      </div>

      {/* FAQs */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
          <HelpCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.howToUse.faqTitle}
          </h2>
        </div>

        <div className="space-y-4">
          {t.howToUse.faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0" />
                {faq.q}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      <AdsterraAd slot="banner" />
    </div>
  );
};
