import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatBytes, getFileExtension } from '../utils/fileUtils';
import { UploadCloud, File as FileIcon, X, AlertCircle, Image as ImageIcon, ShieldCheck } from 'lucide-react';

interface FileUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  acceptedExtensions?: string[];
  acceptedMimeTypes?: string[];
  className?: string;
  disabled?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  files,
  onFilesChange,
  multiple = false,
  maxFiles = 20,
  acceptedExtensions,
  acceptedMimeTypes,
  className = '',
  disabled = false,
}) => {
  const { t } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateAndAddFiles = (incomingFiles: FileList | File[]) => {
    setErrorMessage(null);
    const validList: File[] = [];
    const listArray = Array.from(incomingFiles);

    for (const file of listArray) {
      const ext = getFileExtension(file.name);

      // Check extension if restricted
      if (
        acceptedExtensions &&
        acceptedExtensions.length > 0 &&
        !acceptedExtensions.map((e) => e.toLowerCase()).includes(ext.toLowerCase())
      ) {
        setErrorMessage(
          `"${file.name}" has an unsupported format. Supported: ${acceptedExtensions.join(', ')}`
        );
        continue;
      }

      validList.push(file);
    }

    if (validList.length === 0) return;

    if (multiple) {
      const combined = [...files, ...validList].slice(0, maxFiles);
      onFilesChange(combined);
      if (files.length + validList.length > maxFiles) {
        setErrorMessage(`Maximum limit of ${maxFiles} files reached.`);
      }
    } else {
      onFilesChange([validList[0]]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
      // Reset input value so re-selecting same file triggers change
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    const next = [...files];
    next.splice(index, 1);
    onFilesChange(next);
  };

  const clearAllFiles = () => {
    onFilesChange([]);
    setErrorMessage(null);
  };

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Drop Zone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/80 scale-[1.01] dark:border-indigo-400 dark:bg-indigo-950/40'
            : 'border-slate-300 bg-slate-50/60 hover:border-indigo-400 hover:bg-slate-100/60 dark:border-slate-700/80 dark:bg-slate-900/40 dark:hover:border-indigo-500 dark:hover:bg-slate-900/70'
        } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={
            acceptedExtensions
              ? acceptedExtensions.join(',')
              : acceptedMimeTypes
              ? acceptedMimeTypes.join(',')
              : undefined
          }
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 transition group-hover:scale-110 dark:bg-indigo-950 dark:text-indigo-400">
          <UploadCloud className="h-7 w-7" />
        </div>

        <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          <span className="hidden sm:inline">{t.common.dropzoneTitle}</span>
          <span className="sm:hidden">{t.common.dropzoneMobile}</span>
        </h4>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {t.common.dropzoneSubtitle}
        </p>

        {acceptedExtensions && acceptedExtensions.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {acceptedExtensions.map((ext) => (
              <span
                key={ext}
                className="rounded-md bg-slate-200/70 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {ext.toUpperCase()}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
          <span>{t.common.dropzoneNotice}</span>
        </div>
      </div>

      {/* Validation Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.common.selectedFiles} ({files.length}{multiple ? `/${maxFiles}` : ''})
            </span>
            {files.length > 1 && (
              <button
                type="button"
                onClick={clearAllFiles}
                className="text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
              >
                {t.common.clearAll}
              </button>
            )}
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {files.map((file, idx) => {
              const isImage = file.type.startsWith('image/');
              return (
                <div
                  key={`${file.name}-${idx}`}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 dark:border-slate-800/80 dark:bg-slate-800/40"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {isImage ? (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="h-full w-full object-cover"
                          onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                        <FileIcon className="h-5 w-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{formatBytes(file.size)}</span>
                        <span>•</span>
                        <span className="uppercase">{getFileExtension(file.name)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition"
                    title={t.common.remove}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
