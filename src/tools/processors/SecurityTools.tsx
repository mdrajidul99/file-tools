import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolInfo } from '../../types';
import { FileUploader } from '../../components/FileUploader';
import { readFileAsArrayBuffer, formatBytes, getFileExtension } from '../../utils/fileUtils';
import { computeBufferHash, computeMD5 } from '../../utils/cryptoUtils';
import { getImageInfo } from '../../utils/imageUtils';
import { getPdfMetadata } from '../../utils/pdfUtils';
import { ShieldCheck, Copy, Check, AlertCircle, RefreshCw, Lock, FileText, CheckCircle } from 'lucide-react';

interface Props {
  tool: ToolInfo;
}

export const SecurityTools: React.FC<Props> = ({ tool }) => {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Results
  const [fileMeta, setFileMeta] = useState<any>(null);
  const [checksums, setChecksums] = useState<{
    sha256?: string;
    sha1?: string;
    sha512?: string;
    md5?: string;
  } | null>(null);

  const handleFiles = async (selected: File[]) => {
    setFiles(selected);
    setError(null);
    setFileMeta(null);
    setChecksums(null);

    if (selected.length === 0) return;
    const file = selected[0];
    setIsProcessing(true);

    try {
      const buffer = await readFileAsArrayBuffer(file);

      // Calculate Checksums
      const sha256 = await computeBufferHash(buffer, 'SHA-256');
      const sha1 = await computeBufferHash(buffer, 'SHA-1');
      const sha512 = await computeBufferHash(buffer, 'SHA-512');
      const md5 = computeMD5(buffer);

      setChecksums({ sha256, sha1, sha512, md5 });

      // Gather File info
      const meta: any = {
        name: file.name,
        sizeBytes: file.size,
        formattedSize: formatBytes(file.size),
        type: file.type || 'application/octet-stream',
        extension: getFileExtension(file.name),
        lastModified: new Date(file.lastModified).toLocaleString(),
      };

      if (file.type.startsWith('image/')) {
        try {
          const img = await getImageInfo(file);
          meta.dimensions = `${img.width} × ${img.height} px`;
          meta.aspectRatio = img.aspectRatio;
          meta.megapixels = `${img.megapixels} MP`;
        } catch {}
      } else if (file.name.endsWith('.pdf')) {
        try {
          const pdf = await getPdfMetadata(file);
          meta.pageCount = pdf.pageCount;
          meta.title = pdf.title;
          meta.author = pdf.author;
        } catch {}
      }

      setFileMeta(meta);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to inspect file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <FileUploader files={files} onFilesChange={handleFiles} disabled={isProcessing} />

      {isProcessing && (
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-6 w-6 animate-spin text-indigo-600 mr-2" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Reading file stream and computing cryptographic hashes...
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Security notice regarding browser inspection */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-xs text-indigo-900 dark:border-indigo-900/40 dark:bg-indigo-950/30 dark:text-indigo-300 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
        <div>
          <p className="font-bold">100% Client-Side Integrity Verification</p>
          <p className="mt-0.5 text-indigo-700 dark:text-indigo-400 leading-relaxed">
            All cryptographic checksums are computed locally in your web browser memory using the native Web Crypto API. Your files are not transmitted to any remote servers. Note: Checksums verify file integrity and detect tampering, but do not replace specialized anti-virus scanners.
          </p>
        </div>
      </div>

      {fileMeta && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            File Specification & Metadata
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[11px] text-slate-400 block">File Name</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                {fileMeta.name}
              </span>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[11px] text-slate-400 block">Exact File Size</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                {fileMeta.formattedSize} ({fileMeta.sizeBytes.toLocaleString()} bytes)
              </span>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[11px] text-slate-400 block">Detected MIME Type</span>
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white block truncate">
                {fileMeta.type}
              </span>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[11px] text-slate-400 block">Last Modified</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                {fileMeta.lastModified}
              </span>
            </div>
            {fileMeta.dimensions && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="text-[11px] text-slate-400 block">Image Dimensions</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {fileMeta.dimensions} ({fileMeta.megapixels})
                </span>
              </div>
            )}
            {fileMeta.pageCount && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="text-[11px] text-slate-400 block">PDF Page Count</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {fileMeta.pageCount} pages
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {checksums && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs dark:border-emerald-950 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-5 w-5" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Calculated File Checksums
            </h3>
          </div>

          <div className="space-y-3">
            {[
              { label: 'SHA-256 Checksum', val: checksums.sha256 },
              { label: 'SHA-1 Checksum', val: checksums.sha1 },
              { label: 'MD5 Checksum', val: checksums.md5 },
              { label: 'SHA-512 Checksum', val: checksums.sha512 },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                    {item.label}
                  </span>
                  <button
                    onClick={() => handleCopy(item.val || '')}
                    className="text-[11px] text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" /> Copy
                  </button>
                </div>
                <p className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
                  {item.val}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
