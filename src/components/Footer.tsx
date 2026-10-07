import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/toolsRegistry';
import { Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language } = useApp();

  return (
    <footer className="border-t border-slate-200 bg-white transition-colors dark:border-slate-800/80 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Developer Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <img
                src="https://pxdrop.online/raw/db2q5e281qec73f6opbg"
                alt="File Tools"
                className="h-9 w-9 rounded-xl object-contain shadow-xs"
              />
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t.siteName}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              {t.subtagline}
            </p>

            <div className="mt-5 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="font-semibold text-slate-700 dark:text-slate-300">
                {t.developerCredit}
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-indigo-500" />
                <a
                  href={`mailto:${t.developerEmail}`}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  {t.developerEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t.footer.quickLinks}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/tools')}
                  className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
                >
                  {t.nav.allTools}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/categories')}
                  className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
                >
                  {t.nav.categories}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/how-to-use')}
                  className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
                >
                  {t.nav.howToUse}
                </button>
              </li>
            </ul>
          </div>

          {/* Categories Highlights */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t.footer.categories}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate(`/category/${cat.id}`)}
                    className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition text-left"
                  >
                    {cat.name[language]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & About */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t.footer.legal}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/privacy')}
                  className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
                >
                  {t.nav.privacy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/terms')}
                  className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
                >
                  {t.nav.terms}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
                >
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-100 pt-6 text-xs text-slate-500 sm:flex-row dark:border-slate-900 dark:text-slate-400">
          <p>{t.footer.copyright}</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            <span>{t.developerCredit}</span>
            <span>•</span>
            <a
              href={`mailto:${t.developerEmail}`}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {t.developerEmail}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
