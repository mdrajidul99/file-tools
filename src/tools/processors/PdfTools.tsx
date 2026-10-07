import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolInfo } from '../../types';
import { FileUploader } from '../../components/FileUploader';
import {
  mergePdfFiles,
  splitPdf,
  rotatePdf,
  deletePdfPages,
  imagesToPdf,
  textToPdf,
  getPdfMetadata,
  renderPdfPagesToImages,
  extractPdfText,
} from '../../utils/pdfUtils';
import { downloadBlob, downloadString, formatBytes, getBaseFileName } from '../../utils/fileUtils';
import {
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  RotateCw,
  Scissors,
  FilePlus,
  FileText,
  FileCheck,
} from 'lucide-react';

interface Props {
  tool: ToolInfo;
}

export const PdfTools: React.FC<Props> = ({ tool }) => {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // PDF Split options
  const [pageRanges, setPageRanges] = useState<string>('1-2');

  // PDF Rotate options
  const [rotationAngle, setRotationAngle] = useState<number>(90);

  // PDF Delete pages options
  const [deletePagesInput, setDeletePagesInput] = useState<string>('1');

  // Results
  const [resultPdf, setResultPdf] = useState<{ blob: Blob; name: string } | null>(null);
  const [resultImages, setResultImages] = useState<{ pageNumber: number; blob: Blob; url: string }[]>([]);
  const [extractedText, setExtractedText] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Metadata
  const [metaInfo, setMetaInfo] = useState<{
    pageCount: number;
    title: string;
    author: string;
    producer: string;
    creationDate: string;
  } | null>(null);

  // If tool is PDF Metadata, auto inspect on file select
  useEffect(() => {
    if (tool.id === 'pdf-metadata' && files.length > 0) {
      getPdfMetadata(files[0])
        .then((m) => setMetaInfo(m))
        .catch((e) => setError(e?.message || 'Failed to read PDF metadata.'));
    } else {
      setMetaInfo(null);
    }
  }, [files, tool.id]);

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setError(null);
    setResultPdf(null);
    setResultImages([]);
    setExtractedText('');

    try {
      const file = files[0];
      const baseName = getBaseFileName(file.name);

      if (tool.id === 'pdf-merge') {
        if (files.length < 2) {
          throw new Error('Please select at least 2 PDF files to merge.');
        }
        const blob = await mergePdfFiles(files);
        setResultPdf({ blob, name: 'merged_document.pdf' });
      } else if (tool.id === 'pdf-split') {
        const blob = await splitPdf(file, pageRanges);
        setResultPdf({ blob, name: `${baseName}_split.pdf` });
      } else if (tool.id === 'pdf-rotate') {
        const blob = await rotatePdf(file, rotationAngle);
        setResultPdf({ blob, name: `${baseName}_rotated.pdf` });
      } else if (tool.id === 'pdf-delete-pages') {
        const pagesToDelete = deletePagesInput
          .split(',')
          .map((p) => parseInt(p.trim(), 10))
          .filter((n) => !isNaN(n));
        const blob = await deletePdfPages(file, pagesToDelete);
        setResultPdf({ blob, name: `${baseName}_edited.pdf` });
      } else if (tool.id === 'images-to-pdf') {
        const blob = await imagesToPdf(files);
        setResultPdf({ blob, name: 'images_album.pdf' });
      } else if (tool.id === 'pdf-to-img') {
        const images = await renderPdfPagesToImages(file, 'image/jpeg', 1.5);
        setResultImages(
          images.map((img) => ({
            ...img,
            url: URL.createObjectURL(img.blob),
          }))
        );
      } else if (tool.id === 'pdf-to-text') {
        const text = await extractPdfText(file);
        setExtractedText(text);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || t.common.errorOccurred);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    resultImages.forEach((i) => URL.revokeObjectURL(i.url));
    setResultImages([]);
    setResultPdf(null);
    setExtractedText('');
    setFiles([]);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {!resultPdf && resultImages.length === 0 && !extractedText && (
        <>
          <FileUploader
            files={files}
            onFilesChange={setFiles}
            multiple={tool.id === 'pdf-merge' || tool.id === 'images-to-pdf'}
            acceptedExtensions={
              tool.id === 'images-to-pdf'
                ? ['.jpg', '.jpeg', '.png', '.webp', '.bmp']
                : ['.pdf']
            }
            disabled={isProcessing}
          />

          {files.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {t.common.options}
              </h3>

              {/* PDF Split input */}
              {tool.id === 'pdf-split' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Page Numbers or Ranges to Extract:
                  </label>
                  <input
                    type="text"
                    value={pageRanges}
                    onChange={(e) => setPageRanges(e.target.value)}
                    placeholder="e.g. 1-3, 5"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-900 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <p className="text-[11px] text-slate-400">
                    Separate individual pages or ranges with commas (e.g. 1, 3-5).
                  </p>
                </div>
              )}

              {/* PDF Rotate options */}
              {tool.id === 'pdf-rotate' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Rotate Angle:
                  </label>
                  <div className="flex gap-2">
                    {[90, 180, 270].map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => setRotationAngle(deg)}
                        className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                          rotationAngle === deg
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                            : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                        }`}
                      >
                        Rotate {deg}° Clockwise
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PDF Delete pages */}
              {tool.id === 'pdf-delete-pages' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Page Numbers to Delete:
                  </label>
                  <input
                    type="text"
                    value={deletePagesInput}
                    onChange={(e) => setDeletePagesInput(e.target.value)}
                    placeholder="e.g. 2, 4"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-900 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <p className="text-[11px] text-slate-400">
                    Specify comma-separated page numbers to remove from document.
                  </p>
                </div>
              )}

              {/* PDF Merge Info */}
              {tool.id === 'pdf-merge' && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {files.length} PDF file{files.length > 1 ? 's' : ''} ready to be merged in order of selection.
                </p>
              )}

              {/* Images to PDF Info */}
              {tool.id === 'images-to-pdf' && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {files.length} image{files.length > 1 ? 's' : ''} will be combined into a multi-page PDF document.
                </p>
              )}

              {/* Process Action Button */}
              {tool.id !== 'pdf-metadata' && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>{t.common.processing}</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        <span>Process PDF Now</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PDF Metadata Viewer result */}
          {metaInfo && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                PDF Document Metadata
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-slate-400 block">Total Pages</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {metaInfo.pageCount}
                  </span>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-slate-400 block">Document Title</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white truncate block">
                    {metaInfo.title}
                  </span>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-slate-400 block">Author / Creator</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white truncate block">
                    {metaInfo.author}
                  </span>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-slate-400 block">Producer Application</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white truncate block">
                    {metaInfo.producer}
                  </span>
                </div>
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

      {/* Result: PDF Document */}
      {resultPdf && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs dark:border-emerald-950 dark:bg-slate-900 text-center">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-6 w-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.common.completed}
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
            <FileText className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-2" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">{resultPdf.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {formatBytes(resultPdf.blob.size)}
            </p>
          </div>

          <div>
            <button
              onClick={() => downloadBlob(resultPdf.blob, resultPdf.name)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-500 transition"
            >
              <Download className="h-4 w-4" />
              {t.common.download}
            </button>
          </div>
        </div>
      )}

      {/* Result: PDF Pages as Images */}
      {resultImages.length > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs dark:border-emerald-950 dark:bg-slate-900">
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-6 w-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Extracted {resultImages.length} Page{resultImages.length > 1 ? 's' : ''}
              </h3>
            </div>
            <button
              onClick={handleReset}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 transition"
            >
              {t.common.tryAnother}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {resultImages.map((page) => (
              <div
                key={page.pageNumber}
                className="flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div className="relative mb-2 h-48 w-full overflow-hidden rounded-lg bg-white border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  <img
                    src={page.url}
                    alt={`Page ${page.pageNumber}`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Page {page.pageNumber}
                </span>
                <button
                  onClick={() =>
                    downloadBlob(page.blob, `page_${page.pageNumber}.jpg`)
                  }
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition"
                >
                  <Download className="h-3.5 w-3.5" /> Download Page
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result: Extracted PDF Text */}
      {extractedText && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs dark:border-emerald-950 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-6 w-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Extracted Text Content
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 transition"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? t.common.copied : t.common.copyToClipboard}
              </button>
              <button
                onClick={() => downloadString(extractedText, 'extracted_pdf_text.txt')}
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
            rows={12}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
        </div>
      )}
    </div>
  );
};
