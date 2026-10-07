import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ToolInfo } from '../types';
import { CATEGORIES } from '../data/toolsRegistry';
import { Icon } from '../components/Icon';
import { AdsterraAd } from '../components/AdsterraAd';
import { Star, ChevronRight, ShieldCheck, ArrowLeft, Info, HelpCircle } from 'lucide-react';

// Processors
import { ImageConvertTool } from '../tools/processors/ImageConvertTool';
import { ImageTransformTool } from '../tools/processors/ImageTransformTool';
import { ImageBase64Tool } from '../tools/processors/ImageBase64Tool';
import { PdfTools } from '../tools/processors/PdfTools';
import { DocumentTools } from '../tools/processors/DocumentTools';
import { CompressTools } from '../tools/processors/CompressTools';
import { OcrTool } from '../tools/processors/OcrTool';
import { EditTools } from '../tools/processors/EditTools';
import { CreateTools } from '../tools/processors/CreateTools';
import { DataTools } from '../tools/processors/DataTools';
import { SecurityTools } from '../tools/processors/SecurityTools';

interface ToolPageProps {
  tool: ToolInfo;
  onNavigate: (path: string) => void;
}

export const ToolPage: React.FC<ToolPageProps> = ({ tool, onNavigate }) => {
  const { language, t, isFavorite, toggleFavorite, addRecentTool } = useApp();

  useEffect(() => {
    addRecentTool(tool.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `${tool.name[language]} | File Tools`;
  }, [tool.id, language]);

  const category = CATEGORIES.find((c) => c.id === tool.categoryId);

  // Render the matching tool processor
  const renderProcessor = () => {
    // Image Convert specific
    if (
      tool.id === 'img-to-jpg' ||
      tool.id === 'img-to-png' ||
      tool.id === 'img-to-webp' ||
      tool.id === 'img-to-pdf' ||
      tool.id === 'svg-to-png'
    ) {
      return <ImageConvertTool tool={tool} />;
    }

    // PDF to Image or PDF to Text
    if (tool.id === 'pdf-to-img' || tool.id === 'pdf-to-text') {
      return <PdfTools tool={tool} />;
    }

    // Text to PDF
    if (tool.id === 'text-to-pdf') {
      return <CreateTools tool={tool} />;
    }

    // Markdown or HTML tools
    if (tool.id === 'markdown-to-html' || tool.id === 'html-to-txt') {
      return <DocumentTools tool={tool} />;
    }

    // Image Transform & Canvas
    if (
      tool.id === 'image-resize' ||
      tool.id === 'image-crop' ||
      tool.id === 'image-rotate-flip' ||
      tool.id === 'image-compress' ||
      tool.id === 'image-filters' ||
      tool.id === 'image-watermark' ||
      tool.id === 'canvas-image-editor' ||
      tool.id === 'compress-image'
    ) {
      return <ImageTransformTool tool={tool} />;
    }

    // Image Base64 & Inspector
    if (
      tool.id === 'image-to-base64' ||
      tool.id === 'base64-to-image' ||
      tool.id === 'image-inspector'
    ) {
      return <ImageBase64Tool tool={tool} />;
    }

    // PDF tools
    if (
      tool.id === 'pdf-merge' ||
      tool.id === 'pdf-split' ||
      tool.id === 'pdf-rotate' ||
      tool.id === 'pdf-delete-pages' ||
      tool.id === 'images-to-pdf' ||
      tool.id === 'pdf-metadata' ||
      tool.id === 'pdf-reorder' ||
      tool.id === 'pdf-organizer'
    ) {
      return <PdfTools tool={tool} />;
    }

    // Document tools
    if (
      tool.id === 'word-counter' ||
      tool.id === 'markdown-viewer' ||
      tool.id === 'html-viewer' ||
      tool.id === 'csv-viewer' ||
      tool.id === 'json-formatter' ||
      tool.id === 'xml-formatter'
    ) {
      return <DocumentTools tool={tool} />;
    }

    // Compress tools
    if (tool.id === 'zip-creator' || tool.id === 'text-minifier' || tool.id === 'create-zip') {
      return <CompressTools tool={tool} />;
    }

    // OCR tool
    if (tool.id === 'ocr-image-to-text') {
      return <OcrTool tool={tool} />;
    }

    // Edit tools
    if (tool.id === 'text-case-editor') {
      return <EditTools tool={tool} />;
    }

    // Create tools
    if (
      tool.id === 'create-pdf' ||
      tool.id === 'create-txt' ||
      tool.id === 'create-csv' ||
      tool.id === 'create-json'
    ) {
      return <CreateTools tool={tool} />;
    }

    // Data tools
    if (
      tool.id === 'data-json-csv' ||
      tool.id === 'json-to-csv' ||
      tool.id === 'csv-to-json' ||
      tool.id === 'data-base64' ||
      tool.id === 'data-url-codec' ||
      tool.id === 'data-hash-generator' ||
      tool.id === 'data-uuid-generator'
    ) {
      return <DataTools tool={tool} />;
    }

    // Security tools
    if (
      tool.id === 'file-info-inspector' ||
      tool.id === 'file-hash-checksum' ||
      tool.id === 'image-deep-inspector' ||
      tool.id === 'pdf-info-inspector'
    ) {
      return <SecurityTools tool={tool} />;
    }

    return <DocumentTools tool={tool} />;
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <button
          onClick={() => onNavigate('/')}
          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        >
          {t.nav.home}
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        {category && (
          <>
            <button
              onClick={() => onNavigate(`/category/${category.id}`)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              {category.name[language]}
            </button>
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        )}
        <span className="font-semibold text-slate-900 dark:text-white truncate">
          {tool.name[language]}
        </span>
      </nav>

      {/* Tool Header Card */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Icon name={tool.iconName} className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {tool.name[language]}
                </h1>
                {tool.badge && (
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                    {tool.badge}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {tool.description[language]}
              </p>
            </div>
          </div>

          {/* Favorite Toggle Button */}
          <button
            onClick={() => toggleFavorite(tool.id)}
            className={`self-start sm:self-auto flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              isFavorite(tool.id)
                ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
            title="Save to favorites"
          >
            <Star className={`h-4 w-4 ${isFavorite(tool.id) ? 'fill-current text-amber-500' : ''}`} />
            <span>{isFavorite(tool.id) ? 'Favorited' : 'Favorite'}</span>
          </button>
        </div>
      </div>

      {/* Main Tool Processor Shell */}
      <div className="mb-10">{renderProcessor()}</div>

      {/* Helpful Instructions & Browser Security Note */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            <HelpCircle className="h-4 w-4 text-indigo-500" />
            <span>How to use this tool</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <li>Select or drag your file into the designated upload area above.</li>
            <li>Configure any required resolution, quality, or formatting settings.</li>
            <li>Click the action button to process your file locally in seconds.</li>
            <li>Preview the output and click Download to save the result.</li>
          </ol>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 dark:border-emerald-950/60 dark:bg-emerald-950/30">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Privacy Guarantee</span>
          </div>
          <p className="text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed">
            Your files remain 100% confidential. All conversions and modifications take place directly inside your web browser’s memory. No files are transferred to any external server.
          </p>
        </div>
      </div>

      {/* Adsterra Advertisement Container */}
      <AdsterraAd slot="banner" />
    </div>
  );
};
