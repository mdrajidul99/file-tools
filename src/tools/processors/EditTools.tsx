import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolInfo } from '../../types';
import { FileUploader } from '../../components/FileUploader';
import { readFileAsText, downloadString } from '../../utils/fileUtils';
import { Copy, Check, Download, AlertCircle, Type, RefreshCw, FileText } from 'lucide-react';

interface Props {
  tool: ToolInfo;
}

export const EditTools: React.FC<Props> = ({ tool }) => {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (selected: File[]) => {
    setFiles(selected);
    setError(null);
    if (selected.length > 0) {
      try {
        const content = await readFileAsText(selected[0]);
        setText(content);
      } catch (e: any) {
        setError('Failed to read file content.');
      }
    }
  };

  const transformCase = (type: 'upper' | 'lower' | 'title' | 'sentence' | 'slug') => {
    if (!text) return;
    if (type === 'upper') {
      setText(text.toUpperCase());
    } else if (type === 'lower') {
      setText(text.toLowerCase());
    } else if (type === 'title') {
      setText(
        text.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        )
      );
    } else if (type === 'sentence') {
      setText(
        text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase())
      );
    } else if (type === 'slug') {
      setText(
        text
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
    }
  };

  const transformLines = (type: 'trim' | 'remove-empty' | 'dedup' | 'sort') => {
    if (!text) return;
    const lines = text.split('\n');

    if (type === 'trim') {
      setText(lines.map((l) => l.trim()).join('\n'));
    } else if (type === 'remove-empty') {
      setText(lines.filter((l) => l.trim().length > 0).join('\n'));
    } else if (type === 'dedup') {
      const set = new Set(lines);
      setText(Array.from(set).join('\n'));
    } else if (type === 'sort') {
      const sorted = [...lines].sort((a, b) => a.localeCompare(b));
      setText(sorted.join('\n'));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <FileUploader
        files={files}
        onFilesChange={handleFileChange}
        acceptedExtensions={['.txt', '.md', '.log', '.csv']}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Case Conversion & Formatting
          </span>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              onClick={() => transformCase('upper')}
              className="rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition"
            >
              UPPERCASE
            </button>
            <button
              onClick={() => transformCase('lower')}
              className="rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition"
            >
              lowercase
            </button>
            <button
              onClick={() => transformCase('title')}
              className="rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition"
            >
              Title Case
            </button>
            <button
              onClick={() => transformCase('sentence')}
              className="rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition"
            >
              Sentence case
            </button>
            <button
              onClick={() => transformCase('slug')}
              className="rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition"
            >
              slug-format
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Line Utilities
          </span>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              onClick={() => transformLines('remove-empty')}
              className="rounded-lg border border-slate-200 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 transition"
            >
              Remove Blank Lines
            </button>
            <button
              onClick={() => transformLines('dedup')}
              className="rounded-lg border border-slate-200 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 transition"
            >
              Deduplicate Lines
            </button>
            <button
              onClick={() => transformLines('sort')}
              className="rounded-lg border border-slate-200 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 transition"
            >
              Sort Alphabetically
            </button>
            <button
              onClick={() => transformLines('trim')}
              className="rounded-lg border border-slate-200 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 transition"
            >
              Trim Spaces
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or write text here..."
          rows={10}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 leading-relaxed"
        />

        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-slate-500">
            {text.length} characters • {text.split('\n').length} lines
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? t.common.copied : t.common.copyToClipboard}
            </button>
            <button
              onClick={() => downloadString(text, 'formatted_text.txt')}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm"
            >
              <Download className="h-3.5 w-3.5" /> Download .TXT
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
