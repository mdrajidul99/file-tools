import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolInfo } from '../../types';
import { FileUploader } from '../../components/FileUploader';
import { resizeImage, convertSvgToRaster } from '../../utils/imageUtils';
import { imagesToPdf } from '../../utils/pdfUtils';
import { downloadBlob, formatBytes, getBaseFileName } from '../../utils/fileUtils';
import { Download, RefreshCw, CheckCircle, AlertCircle, Eye } from 'lucide-react';

interface Props {
  tool: ToolInfo;
}

export const ImageConvertTool: React.FC<Props> = ({ tool }) => {
  const { t, language } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState<number>(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlobs, setResultBlobs] = useState<{ name: string; blob: Blob; url: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Target format based on tool slug
  let defaultTargetFormat: 'image/jpeg' | 'image/png' | 'image/webp' | 'application/pdf' = 'image/jpeg';
  let defaultExtension = 'jpg';

  if (tool.slug.includes('png')) {
    defaultTargetFormat = 'image/png';
    defaultExtension = 'png';
  } else if (tool.slug.includes('webp')) {
    defaultTargetFormat = 'image/webp';
    defaultExtension = 'webp';
  } else if (tool.slug.includes('pdf')) {
    defaultTargetFormat = 'application/pdf';
    defaultExtension = 'pdf';
  }

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setError(null);
    setResultBlobs([]);

    try {
      const results: { name: string; blob: Blob; url: string }[] = [];

      if (defaultTargetFormat === 'application/pdf') {
        // Image(s) to PDF
        const pdfBlob = await imagesToPdf(files);
        const name = `${getBaseFileName(files[0].name)}.pdf`;
        results.push({ name, blob: pdfBlob, url: URL.createObjectURL(pdfBlob) });
      } else {
        // Image to JPG / PNG / WebP or SVG to PNG
        for (const file of files) {
          let convertedBlob: Blob;
          if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
            convertedBlob = await convertSvgToRaster(
              file,
              defaultTargetFormat as 'image/png' | 'image/jpeg'
            );
          } else {
            const imgBitmap = await createImageBitmap(file);
            convertedBlob = await resizeImage(
              file,
              imgBitmap.width,
              imgBitmap.height,
              defaultTargetFormat as 'image/jpeg' | 'image/png' | 'image/webp',
              quality / 100
            );
          }

          const outName = `${getBaseFileName(file.name)}.${defaultExtension}`;
          results.push({
            name: outName,
            blob: convertedBlob,
            url: URL.createObjectURL(convertedBlob),
          });
        }
      }

      setResultBlobs(results);
    } catch (err: any) {
      console.error('Conversion failed:', err);
      setError(err?.message || t.common.errorOccurred);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = () => {
    resultBlobs.forEach((item) => downloadBlob(item.blob, item.name));
  };

  const handleReset = () => {
    resultBlobs.forEach((r) => URL.revokeObjectURL(r.url));
    setResultBlobs([]);
    setFiles([]);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {resultBlobs.length === 0 && (
        <>
          <FileUploader
            files={files}
            onFilesChange={setFiles}
            multiple={defaultTargetFormat === 'application/pdf'}
            acceptedExtensions={tool.acceptedExtensions}
            disabled={isProcessing}
          />

          {/* Options Section */}
          {files.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">
                {t.common.options}
              </h3>

              {defaultTargetFormat !== 'image/png' && defaultTargetFormat !== 'application/pdf' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>{t.common.quality}</span>
                    <span>{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Smaller file</span>
                    <span>Highest quality (recommended: 90%)</span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>{t.common.converting}</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      <span>Convert Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success / Result State */}
      {resultBlobs.length > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs dark:border-emerald-950 dark:bg-slate-900">
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-6 w-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.common.completed}
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
              >
                {t.common.tryAnother}
              </button>
              {resultBlobs.length > 1 && (
                <button
                  onClick={handleDownloadAll}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-xs transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  {t.common.downloadAll}
                </button>
              )}
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {resultBlobs.map((res, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center dark:border-slate-800 dark:bg-slate-800/40"
              >
                {defaultTargetFormat !== 'application/pdf' ? (
                  <div className="relative mb-3 h-40 w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <img src={res.url} alt={res.name} className="h-full w-full object-contain" />
                  </div>
                ) : (
                  <div className="mb-3 flex h-32 w-full items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                    <span className="text-sm font-bold">PDF Document Ready</span>
                  </div>
                )}

                <div className="w-full">
                  <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                    {res.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {formatBytes(res.blob.size)}
                  </p>
                  <button
                    onClick={() => downloadBlob(res.blob, res.name)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-xs transition"
                  >
                    <Download className="h-4 w-4" />
                    {t.common.download}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
