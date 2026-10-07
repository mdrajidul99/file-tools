import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolInfo } from '../../types';
import { FileUploader } from '../../components/FileUploader';
import { readFileAsDataURL, downloadBlob, formatBytes } from '../../utils/fileUtils';
import { getImageInfo } from '../../utils/imageUtils';
import { Copy, Check, Download, AlertCircle, FileCode, Eye } from 'lucide-react';

interface Props {
  tool: ToolInfo;
}

export const ImageBase64Tool: React.FC<Props> = ({ tool }) => {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [base64Output, setBase64Output] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Base64 to Image state
  const [inputBase64, setInputBase64] = useState<string>('');
  const [decodedImgUrl, setDecodedImgUrl] = useState<string | null>(null);

  // Inspector state
  const [imageMeta, setImageMeta] = useState<{
    width: number;
    height: number;
    aspectRatio: string;
    megapixels: number;
    mime: string;
    size: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  // Handle Image to Base64 or Inspector
  const handleFileChange = async (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError(null);
    setBase64Output('');
    setImageMeta(null);

    if (selectedFiles.length > 0) {
      const file = selectedFiles[0];
      try {
        if (tool.id === 'image-to-base64') {
          const dataUrl = await readFileAsDataURL(file);
          setBase64Output(dataUrl);
        } else if (tool.id === 'image-inspector') {
          const info = await getImageInfo(file);
          setImageMeta({
            ...info,
            mime: file.type || 'image/unknown',
            size: file.size,
          });
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to inspect image');
      }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDecodeBase64 = () => {
    setError(null);
    let str = inputBase64.trim();
    if (!str) return;

    if (!str.startsWith('data:image/')) {
      // If user pasted raw base64, prepend data uri
      str = `data:image/png;base64,${str}`;
    }

    try {
      setDecodedImgUrl(str);
    } catch (e: any) {
      setError('Invalid Base64 image string');
    }
  };

  const downloadDecodedImage = () => {
    if (!decodedImgUrl) return;
    const a = document.createElement('a');
    a.href = decodedImgUrl;
    a.download = 'decoded-image.png';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Tool 1: Image to Base64 */}
      {tool.id === 'image-to-base64' && (
        <>
          <FileUploader
            files={files}
            onFilesChange={handleFileChange}
            acceptedExtensions={['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif']}
          />

          {base64Output && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Base64 Data URI
                </span>
                <button
                  onClick={() => handleCopy(base64Output)}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? t.common.copied : t.common.copyToClipboard}
                </button>
              </div>

              <textarea
                readOnly
                value={base64Output}
                rows={6}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  HTML &lt;img&gt; Embed Code:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={`<img src="${base64Output.slice(0, 40)}..." alt="Embedded Image" />`}
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  />
                  <button
                    onClick={() =>
                      handleCopy(`<img src="${base64Output}" alt="Embedded Image" />`)
                    }
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  >
                    Copy HTML
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Tool 2: Base64 to Image */}
      {tool.id === 'base64-to-image' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Paste Base64 Image String or Data URI:
          </label>
          <textarea
            value={inputBase64}
            onChange={(e) => setInputBase64(e.target.value)}
            placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..."
            rows={5}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />

          <div className="flex justify-end">
            <button
              onClick={handleDecodeBase64}
              disabled={!inputBase64.trim()}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              <Eye className="h-4 w-4" />
              Decode & Preview
            </button>
          </div>

          {decodedImgUrl && (
            <div className="border-t border-slate-100 pt-4 dark:border-slate-800 flex flex-col items-center">
              <div className="mb-4 max-h-72 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-2 dark:border-slate-800 dark:bg-slate-800">
                <img
                  src={decodedImgUrl}
                  alt="Decoded"
                  className="max-h-64 object-contain"
                  onError={() => setError('Failed to render Base64 image data.')}
                />
              </div>
              <button
                onClick={downloadDecodedImage}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-500"
              >
                <Download className="h-4 w-4" />
                Download Decoded Image
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tool 3: Image Metadata Inspector */}
      {tool.id === 'image-inspector' && (
        <>
          <FileUploader
            files={files}
            onFilesChange={handleFileChange}
            acceptedExtensions={['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.bmp']}
          />

          {imageMeta && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Image Technical Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-[11px] font-medium text-slate-400 block">Resolution</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {imageMeta.width} × {imageMeta.height} px
                  </span>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-[11px] font-medium text-slate-400 block">Aspect Ratio</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {imageMeta.aspectRatio}
                  </span>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-[11px] font-medium text-slate-400 block">Megapixels</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {imageMeta.megapixels} MP
                  </span>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-[11px] font-medium text-slate-400 block">File Size</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {formatBytes(imageMeta.size)}
                  </span>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-[11px] font-medium text-slate-400 block">MIME Type</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {imageMeta.mime}
                  </span>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-[11px] font-medium text-slate-400 block">Estimated RAM</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    ~{((imageMeta.width * imageMeta.height * 4) / (1024 * 1024)).toFixed(1)} MB
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
    </div>
  );
};
