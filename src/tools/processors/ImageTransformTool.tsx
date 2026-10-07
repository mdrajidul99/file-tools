import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolInfo } from '../../types';
import { FileUploader } from '../../components/FileUploader';
import {
  resizeImage,
  cropImage,
  rotateAndFlipImage,
  processCanvasImage,
  getImageInfo,
} from '../../utils/imageUtils';
import { downloadBlob, formatBytes, getBaseFileName, getFileExtension } from '../../utils/fileUtils';
import {
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Sliders,
  Crop,
  RotateCw,
  Maximize2,
  Minimize2,
  Stamp,
  FlipHorizontal,
  FlipVertical,
} from 'lucide-react';

interface Props {
  tool: ToolInfo;
}

export const ImageTransformTool: React.FC<Props> = ({ tool }) => {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [originalInfo, setOriginalInfo] = useState<{
    width: number;
    height: number;
    aspectRatio: string;
    megapixels: number;
  } | null>(null);

  // Resize state
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(600);
  const [lockAspect, setLockAspect] = useState<boolean>(true);

  // Rotate & flip state
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Compress & quality
  const [quality, setQuality] = useState<number>(80);

  // Filters state
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [grayscale, setGrayscale] = useState<number>(0);
  const [sepia, setSepia] = useState<number>(0);
  const [blur, setBlur] = useState<number>(0);

  // Watermark state
  const [watermarkText, setWatermarkText] = useState<string>('File Tools');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.6);
  const [watermarkPosition, setWatermarkPosition] = useState<
    'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  >('bottom-right');

  // Crop state (percentages of width/height)
  const [cropPercentX, setCropPercentX] = useState<number>(10);
  const [cropPercentY, setCropPercentY] = useState<number>(10);
  const [cropPercentW, setCropPercentW] = useState<number>(80);
  const [cropPercentH, setCropPercentH] = useState<number>(80);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<{ blob: Blob; url: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // When file is selected, read dimensions
  useEffect(() => {
    if (files.length > 0) {
      getImageInfo(files[0])
        .then((info) => {
          setOriginalInfo(info);
          setTargetWidth(info.width);
          setTargetHeight(info.height);
        })
        .catch((e) => console.error(e));
    } else {
      setOriginalInfo(null);
    }
  }, [files]);

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (lockAspect && originalInfo && originalInfo.width > 0) {
      const ratio = originalInfo.height / originalInfo.width;
      setTargetHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (lockAspect && originalInfo && originalInfo.height > 0) {
      const ratio = originalInfo.width / originalInfo.height;
      setTargetWidth(Math.round(val * ratio));
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setError(null);

    const file = files[0];
    const baseName = getBaseFileName(file.name);
    const ext = getFileExtension(file.name) || '.jpg';

    try {
      let outputBlob: Blob;

      if (tool.id === 'image-resize') {
        outputBlob = await resizeImage(
          file,
          targetWidth,
          targetHeight,
          ext === '.png' ? 'image/png' : 'image/jpeg',
          quality / 100
        );
      } else if (tool.id === 'image-crop') {
        if (!originalInfo) throw new Error('Could not read image dimensions');
        const x = Math.round((cropPercentX / 100) * originalInfo.width);
        const y = Math.round((cropPercentY / 100) * originalInfo.height);
        const w = Math.max(10, Math.round((cropPercentW / 100) * originalInfo.width));
        const h = Math.max(10, Math.round((cropPercentH / 100) * originalInfo.height));
        outputBlob = await cropImage(file, x, y, w, h, ext === '.png' ? 'image/png' : 'image/jpeg');
      } else if (tool.id === 'image-rotate-flip') {
        outputBlob = await rotateAndFlipImage(
          file,
          rotation,
          flipH,
          flipV,
          ext === '.png' ? 'image/png' : 'image/jpeg',
          0.95
        );
      } else if (tool.id === 'image-compress' || tool.id === 'compress-image') {
        outputBlob = await resizeImage(
          file,
          originalInfo ? originalInfo.width : 1200,
          originalInfo ? originalInfo.height : 900,
          'image/jpeg',
          quality / 100
        );
      } else {
        // Full Image Editor / Filters / Watermark
        outputBlob = await processCanvasImage(file, {
          targetWidth,
          targetHeight,
          rotation,
          flipH,
          flipV,
          filters: {
            brightness,
            contrast,
            grayscale,
            sepia,
            blur,
          },
          watermark:
            tool.id === 'image-watermark' || tool.id === 'canvas-image-editor'
              ? {
                  text: watermarkText,
                  opacity: watermarkOpacity,
                  position: watermarkPosition,
                }
              : undefined,
          format: ext === '.png' ? 'image/png' : 'image/jpeg',
          quality: quality / 100,
        });
      }

      const outName = `${baseName}_processed${ext === '.png' ? '.png' : '.jpg'}`;
      setResult({
        blob: outputBlob,
        url: URL.createObjectURL(outputBlob),
        name: outName,
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || t.common.errorOccurred);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (result) URL.revokeObjectURL(result.url);
    setResult(null);
    setFiles([]);
    setError(null);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  };

  return (
    <div className="space-y-6">
      {!result && (
        <>
          <FileUploader
            files={files}
            onFilesChange={setFiles}
            acceptedExtensions={['.jpg', '.jpeg', '.png', '.webp', '.bmp']}
            disabled={isProcessing}
          />

          {files.length > 0 && originalInfo && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {t.common.options}
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Original: {originalInfo.width} × {originalInfo.height} px ({originalInfo.aspectRatio})
                </span>
              </div>

              {/* Resize Options */}
              {(tool.id === 'image-resize' || tool.id === 'canvas-image-editor') && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Resize Dimensions (px)
                  </span>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 items-center">
                    <div>
                      <label className="text-xs text-slate-500">Width</label>
                      <input
                        type="number"
                        value={targetWidth}
                        onChange={(e) => handleWidthChange(Number(e.target.value))}
                        className="w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Height</label>
                      <input
                        type="number"
                        value={targetHeight}
                        onChange={(e) => handleHeightChange(Number(e.target.value))}
                        className="w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1 pt-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={lockAspect}
                          onChange={(e) => setLockAspect(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        Lock Aspect Ratio
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Rotate & Flip Options */}
              {(tool.id === 'image-rotate-flip' || tool.id === 'canvas-image-editor') && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Rotate & Orientation
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[0, 90, 180, 270].map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => setRotation(deg)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                          rotation === deg
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                            : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                        }`}
                      >
                        {deg}°
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFlipH(!flipH)}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                        flipH
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                          : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                      }`}
                    >
                      <FlipHorizontal className="h-3.5 w-3.5" /> Flip H
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlipV(!flipV)}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                        flipV
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                          : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                      }`}
                    >
                      <FlipVertical className="h-3.5 w-3.5" /> Flip V
                    </button>
                  </div>
                </div>
              )}

              {/* Crop Sliders */}
              {tool.id === 'image-crop' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Crop Region Margins (%)
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                        <span>Left Offset: {cropPercentX}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="80"
                        value={cropPercentX}
                        onChange={(e) => setCropPercentX(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                        <span>Top Offset: {cropPercentY}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="80"
                        value={cropPercentY}
                        onChange={(e) => setCropPercentY(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                        <span>Crop Width: {cropPercentW}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={cropPercentW}
                        onChange={(e) => setCropPercentW(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                        <span>Crop Height: {cropPercentH}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={cropPercentH}
                        onChange={(e) => setCropPercentH(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Compress Quality Slider */}
              {(tool.id === 'image-compress' ||
                tool.id === 'compress-image' ||
                tool.id === 'image-resize') && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Quality</span>
                    <span>{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Higher compression (smaller size)</span>
                    <span>Maximum quality</span>
                  </div>
                </div>
              )}

              {/* Color Filters */}
              {(tool.id === 'image-filters' || tool.id === 'canvas-image-editor') && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Filters & Enhancements
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                        <span>Brightness</span>
                        <span>{brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                        <span>Contrast</span>
                        <span>{contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                        <span>Grayscale (B&W)</span>
                        <span>{grayscale}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={grayscale}
                        onChange={(e) => setGrayscale(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                        <span>Sepia Tone</span>
                        <span>{sepia}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sepia}
                        onChange={(e) => setSepia(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Watermark Section */}
              {(tool.id === 'image-watermark' || tool.id === 'canvas-image-editor') && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Watermark Text
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="Watermark text"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <select
                        value={watermarkPosition}
                        onChange={(e) => setWatermarkPosition(e.target.value as any)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      >
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="top-left">Top Left</option>
                        <option value="center">Center</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Action Button */}
              <div className="mt-4 flex justify-end">
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
                      <Sliders className="h-4 w-4" />
                      <span>Apply & Process</span>
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

      {result && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs dark:border-emerald-950 dark:bg-slate-900">
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-6 w-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.common.completed}
              </h3>
            </div>
            <button
              onClick={handleReset}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
            >
              {t.common.tryAnother}
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative mb-6 max-h-96 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
              <img
                src={result.url}
                alt="Processed result"
                className="max-h-96 object-contain"
              />
            </div>

            {/* Statistics Comparison */}
            {files[0] && (
              <div className="mb-6 flex flex-wrap justify-center gap-4 text-xs">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
                  <span className="font-medium text-slate-400 block">{t.common.originalSize}</span>
                  <span className="text-sm font-bold">{formatBytes(files[0].size)}</span>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <span className="font-medium text-emerald-600 block">{t.common.newSize}</span>
                  <span className="text-sm font-bold">{formatBytes(result.blob.size)}</span>
                </div>
                {files[0].size > result.blob.size && (
                  <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-indigo-800 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
                    <span className="font-medium text-indigo-500 block">{t.common.saved}</span>
                    <span className="text-sm font-bold">
                      {Math.round(((files[0].size - result.blob.size) / files[0].size) * 100)}%
                    </span>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => downloadBlob(result.blob, result.name)}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-500 transition"
            >
              <Download className="h-4 w-4" />
              {t.common.download}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
