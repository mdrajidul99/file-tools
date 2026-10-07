import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdsterraAd } from '../components/AdsterraAd';
import { Mail, Send, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t } = useApp();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleComposeMailto = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${t.contact.emailVal}?subject=${encodeURIComponent(
      subject || 'Inquiry regarding File Tools'
    )}&body=${encodeURIComponent(
      `Name: ${name}\n\nMessage:\n${message}\n\nSent via File Tools web interface`
    )}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {t.contact.title}
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
          {t.contact.subtitle}
        </p>
      </div>

      {/* Direct Contact Card */}
      <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/70 to-white p-8 dark:border-indigo-900/60 dark:from-slate-900 dark:to-indigo-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {t.contact.developerLabel}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.contact.developerVal}
            </h2>
            <div className="pt-2 flex items-center gap-2">
              <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <a
                href={`mailto:${t.contact.emailVal}`}
                className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                {t.contact.emailVal}
              </a>
            </div>
          </div>
          <a
            href={`mailto:${t.contact.emailVal}`}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition self-start sm:self-auto"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Open Email App</span>
          </a>
        </div>
      </div>

      {/* Mailto Composer Template */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
          Feedback & Inquiries
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          {t.contact.note}
        </p>

        <form onSubmit={handleComposeMailto} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.contact.form.name}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.contact.form.subject}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Feedback / Feature Request"
                className="w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.contact.form.message}
            </label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message or suggestion here..."
              rows={5}
              className="w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs sm:text-sm text-slate-900 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 shadow-sm transition"
            >
              <Send className="h-4 w-4" />
              <span>{t.contact.form.send}</span>
            </button>
          </div>
        </form>
      </div>

      <AdsterraAd slot="banner" />
    </div>
  );
};
