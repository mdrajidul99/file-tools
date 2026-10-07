import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Home } from 'lucide-react';

interface Props {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<Props> = ({ onNavigate }) => {
  const { t } = useApp();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl font-black text-indigo-600 dark:text-indigo-400">404</div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Page Not Found
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
        The tool or page you requested does not exist or may have been moved.
      </p>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-xs"
        >
          <Home className="h-4 w-4" />
          <span>{t.common.backToHome}</span>
        </button>
        <button
          onClick={() => onNavigate('/tools')}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition"
        >
          <span>{t.common.backToTools}</span>
        </button>
      </div>
    </div>
  );
};
