import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolInfo } from '../../types';
import { FileUploader } from '../../components/FileUploader';
import { zipFiles } from '../../utils/zipUtils';
import { downloadBlob, downloadString, formatBytes } from '../../utils/fileUtils';
import { Download, RefreshCw, CheckCircle, AlertCircle, Archive, Minimize } from 'lucide-react';

interface Props {
  tool: ToolInfo;
}

export const CompressTools: React.FC<Props> = ({ tool }) => {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [zipName, setZipName] = useState<string>('archive.zip');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultZip, setResultZip] = useState<{ blob: Blob; name: string } | null>(null);

  // Text/Code minifier state
  const [inputCode, setInputCode] = useState<string>('');
  const [minifiedCode, setMinifiedCode] = useState<string>('');
  const [codeType, setCodeType] = useState<'generic' | 'json' | 'css' | 'js'>('generic');

  const [error, setError] = useState<string | null>(null);

  const handleCreateZip = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setError(null);
    try {
      const sanitizedName = zipName.endsWith('.zip') ? zipName : `${zipName}.zip`;
      const zipBlob = await zipFiles(files, sanitizedName);
      setResultZip({ blob: zipBlob, name: sanitizedName });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to create zip package.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMinifyCode = () => {
    setError(null);
    if (!inputCode.trim()) return;

    try {
      let output = inputCode;
      if (codeType === 'json') {
        output = JSON.stringify(JSON.parse(inputCode));
      } else {
        // Strip block comments /* ... */
        output = output.replace(/\/\*[\s\S]*?\*\//g, '');
        // Strip single line comments // ... (not inside quotes)
        output = output.replace(/(^|[^:])\/\/.*/g, '$1');
        // Collapse spaces & newlines
        output = output.replace(/\s+/g, ' ').trim();
        // Remove spaces around brackets and colons/semicolons
        output = output.replace(/\s*([{};:,])\s*/g, '$1');
      }
      setMinifiedCode(output);
    } catch (err: any) {
      setError('Minification error: ' + err.message);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResultZip(null);
    setInputCode('');
    setMinifiedCode('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Tool 1: ZIP Creator */}
      {tool.id === 'zip-creator' && (
        <>
          {!resultZip && (
            <>
              <FileUploader
                files={files}
                onFilesChange={setFiles}
                multiple={true}
                maxFiles={50}
                disabled={isProcessing}
              />

              {files.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      ZIP Archive Filename:
                    </label>
                    <input
                      type="text"
                      value={zipName}
                      onChange={(e) => setZipName(e.target.value)}
                      placeholder="archive.zip"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleCreateZip}
                      disabled={isProcessing}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Compressing into ZIP...</span>
                        </>
                      ) : (
                        <>
                          <Archive className="h-4 w-4" />
                          <span>Create ZIP Archive</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {resultZip && (
            <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs dark:border-emerald-950 dark:bg-slate-900 text-center">
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-6 w-6" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    ZIP Created Successfully
                  </h3>
                </div>
                <button
                  onClick={handleReset}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 transition"
                >
                  {t.common.tryAnother}
                </button>
              </div>

              <div className="my-6 inline-flex flex-col items-center justify-center rounded-2xl bg-indigo-50 p-6 dark:bg-indigo-950/50">
                <Archive className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-2" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">{resultZip.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {formatBytes(resultZip.blob.size)} • {files.length} files included
                </p>
              </div>

              <div>
                <button
                  onClick={() => downloadBlob(resultZip.blob, resultZip.name)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-500 transition"
                >
                  <Download className="h-4 w-4" />
                  Download .ZIP File
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Tool 2: Code & Text Minifier */}
      {tool.id === 'text-minifier' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Input Code / Text
              </span>
              <div className="flex gap-1.5 text-xs">
                {(['generic', 'json', 'css', 'js'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setCodeType(type)}
                    className={`rounded-lg px-2.5 py-1 uppercase font-semibold transition ${
                      codeType === type
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Paste CSS, JavaScript, HTML, JSON or text here..."
              rows={8}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />

            <div className="flex justify-end">
              <button
                onClick={handleMinifyCode}
                disabled={!inputCode.trim()}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                <Minimize className="h-4 w-4" />
                Minify Now
              </button>
            </div>
          </div>

          {minifiedCode && (
            <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs dark:border-emerald-950 dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Minified Output
                  </span>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Original: {inputCode.length} chars → Minified: {minifiedCode.length} chars (
                    {Math.round(((inputCode.length - minifiedCode.length) / inputCode.length) * 100)}%
                    reduction)
                  </div>
                </div>
                <button
                  onClick={() => downloadString(minifiedCode, 'minified.txt')}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>

              <textarea
                readOnly
                value={minifiedCode}
                rows={6}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
