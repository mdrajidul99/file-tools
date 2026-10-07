import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolInfo } from '../../types';
import { FileUploader } from '../../components/FileUploader';
import { downloadString } from '../../utils/fileUtils';
import { createWorker } from 'tesseract.js';
import {
  ScanText,
  Copy,
  Check,
  Download,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  Globe,
} from 'lucide-react';

interface Props {
  tool: ToolInfo;
}

export const OcrTool: React.FC<Props> = ({ tool }) => {
  const { t, language } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [selectedLang, setSelectedLang] = useState<'eng' | 'ben' | 'spa' | 'fra'>('eng');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunOcr = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setError(null);
    setProgress(0);
    setStatusMessage('Initializing in-browser OCR engine...');

    try {
      const worker = await createWorker(selectedLang, 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round((m.progress || 0) * 100));
            setStatusMessage(`Extracting text characters... ${Math.round((m.progress || 0) * 100)}%`);
          } else {
            setStatusMessage(m.status);
          }
        },
      });

      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      const ret = await worker.recognize(imageUrl);
      await worker.terminate();
      URL.revokeObjectURL(imageUrl);

      if (!ret.data.text.trim()) {
        setExtractedText('(No text detected in this image)');
      } else {
        setExtractedText(ret.data.text);
      }
    } catch (err: any) {
      console.error('OCR Error:', err);
      setError(
        err?.message ||
          'Failed to perform OCR recognition. Please verify image clarity and network connectivity for language files.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setFiles([]);
    setExtractedText('');
    setProgress(0);
    setStatusMessage('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      {!extractedText && (
        <>
          <FileUploader
            files={files}
            onFilesChange={setFiles}
            acceptedExtensions={['.jpg', '.jpeg', '.png', '.webp', '.bmp']}
            disabled={isProcessing}
          />

          {files.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Recognition Language:
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Select the primary language of text in the photo
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-indigo-500" />
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value as any)}
                    disabled={isProcessing}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="eng">English (Latin)</option>
                    <option value="ben">Bengali (বাংলা)</option>
                    <option value="spa">Spanish (Español)</option>
                    <option value="fra">French (Français)</option>
                  </select>
                </div>
              </div>

              {/* Progress bar during OCR */}
              {isProcessing && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span>{statusMessage}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleRunOcr}
                  disabled={isProcessing}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>{t.common.extracting}</span>
                    </>
                  ) : (
                    <>
                      <ScanText className="h-4 w-4" />
                      <span>Extract Text (OCR)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {extractedText && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs dark:border-emerald-950 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-6 w-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Extracted Text Result
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? t.common.copied : t.common.copyToClipboard}
              </button>
              <button
                onClick={() => downloadString(extractedText, 'ocr_result.txt')}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition"
              >
                <Download className="h-3.5 w-3.5" />
                {t.common.downloadTxt}
              </button>
              <button
                onClick={handleReset}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300"
              >
                {t.common.tryAnother}
              </button>
            </div>
          </div>

          <textarea
            readOnly
            value={extractedText}
            rows={10}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 leading-relaxed"
          />
        </div>
      )}
    </div>
  );
};
