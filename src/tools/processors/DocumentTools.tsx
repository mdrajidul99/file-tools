import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolInfo } from '../../types';
import { FileUploader } from '../../components/FileUploader';
import { readFileAsText, downloadString } from '../../utils/fileUtils';
import {
  csvToJson,
  formatXml,
  htmlToPlainText,
  markdownToHtmlSimple,
  getTextStatistics,
} from '../../utils/dataUtils';
import {
  Copy,
  Check,
  Download,
  AlertCircle,
  FileCode,
  Table,
  Eye,
  Type,
  Code,
  Search,
} from 'lucide-react';

interface Props {
  tool: ToolInfo;
}

export const DocumentTools: React.FC<Props> = ({ tool }) => {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [formattedText, setFormattedText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // CSV viewer table state
  const [csvRows, setCsvRows] = useState<any[]>([]);
  const [csvFilter, setCsvFilter] = useState('');

  // Previews
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [renderedHtml, setRenderedHtml] = useState<string>('');
  const [analyzedStats, setAnalyzedStats] = useState<boolean>(false);

  // JSON spacing
  const [jsonIndent, setJsonIndent] = useState<number>(2);

  // When a file is dropped, read text content
  const handleFileChange = async (selected: File[]) => {
    setFiles(selected);
    setError(null);
    if (selected.length > 0) {
      try {
        const text = await readFileAsText(selected[0]);
        setInputText(text);
      } catch (err: any) {
        setError('Failed to read file content.');
      }
    }
  };

  // Live calculation for Word Counter
  const stats = getTextStatistics(inputText);

  // Handle format actions
  const handleFormat = () => {
    setError(null);
    try {
      if (tool.id === 'json-formatter') {
        const parsed = JSON.parse(inputText);
        setFormattedText(JSON.stringify(parsed, null, jsonIndent));
      } else if (tool.id === 'xml-formatter') {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(inputText, 'application/xml');
        const parseError = xmlDoc.getElementsByTagName('parsererror');
        if (parseError.length > 0) {
          throw new Error('Invalid XML syntax detected.');
        }
        setFormattedText(formatXml(inputText));
      } else if (tool.id === 'html-to-txt') {
        setFormattedText(htmlToPlainText(inputText));
      } else if (tool.id === 'csv-viewer') {
        setCsvRows(csvToJson(inputText));
      }
    } catch (err: any) {
      setError(err?.message || 'Processing failed.');
    }
  };

  const handleMinifyJson = () => {
    setError(null);
    try {
      const parsed = JSON.parse(inputText);
      setFormattedText(JSON.stringify(parsed));
    } catch (err: any) {
      setError('Invalid JSON syntax: ' + err.message);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* File Upload / Input Box */}
      <FileUploader
        files={files}
        onFilesChange={handleFileChange}
        acceptedExtensions={tool.acceptedExtensions}
      />

      {/* Main Textarea Input */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {tool.id === 'word-counter'
              ? 'Enter or Paste Text to Analyze'
              : tool.id === 'markdown-viewer'
              ? 'Markdown Source Text'
              : tool.id === 'html-viewer'
              ? 'HTML Source Code'
              : tool.id === 'csv-viewer'
              ? 'CSV Data'
              : 'Input Content'}
          </label>
          {inputText && (
            <button
              onClick={() => {
                setInputText('');
                setFormattedText('');
                setCsvRows([]);
                setFiles([]);
              }}
              className="text-xs text-red-600 hover:text-red-700 dark:text-red-400"
            >
              Clear
            </button>
          )}
        </div>

        <textarea
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (tool.id === 'csv-viewer') {
              try {
                setCsvRows(csvToJson(e.target.value));
              } catch {}
            }
          }}
          placeholder="Paste or write text here..."
          rows={8}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 leading-relaxed"
        />

        {/* Toolbar / Actions depending on tool */}
        {tool.id === 'json-formatter' && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-600 dark:text-slate-400">Indentation:</span>
              <button
                type="button"
                onClick={() => setJsonIndent(2)}
                className={`rounded-lg px-2.5 py-1 font-semibold ${
                  jsonIndent === 2
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                2 Spaces
              </button>
              <button
                type="button"
                onClick={() => setJsonIndent(4)}
                className={`rounded-lg px-2.5 py-1 font-semibold ${
                  jsonIndent === 4
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                4 Spaces
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleMinifyJson}
                disabled={!inputText.trim()}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
              >
                Minify JSON
              </button>
              <button
                onClick={handleFormat}
                disabled={!inputText.trim()}
                className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition"
              >
                Format / Beautify
              </button>
            </div>
          </div>
        )}

        {(tool.id === 'xml-formatter' || tool.id === 'html-to-txt') && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleFormat}
              disabled={!inputText.trim()}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition disabled:opacity-50"
            >
              {tool.id === 'xml-formatter' ? 'Format & Validate XML' : 'Extract Plain Text'}
            </button>
          </div>
        )}

        {tool.id === 'word-counter' && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setAnalyzedStats(true)}
              disabled={!inputText.trim()}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition disabled:opacity-50"
            >
              <Type className="h-4 w-4" />
              Analyze & Count Words
            </button>
          </div>
        )}

        {tool.id === 'markdown-viewer' && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowMarkdownPreview(true)}
              disabled={!inputText.trim()}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition disabled:opacity-50"
            >
              <Eye className="h-4 w-4" />
              Render Markdown Preview
            </button>
          </div>
        )}

        {tool.id === 'html-viewer' && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setRenderedHtml(inputText)}
              disabled={!inputText.trim()}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition disabled:opacity-50"
            >
              <Eye className="h-4 w-4" />
              Render HTML Preview
            </button>
          </div>
        )}

        {tool.id === 'csv-viewer' && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                if (!inputText.trim()) return;
                try {
                  setCsvRows(csvToJson(inputText));
                } catch (e: any) {
                  setError('Failed to parse CSV: ' + (e?.message || 'Invalid format'));
                }
              }}
              disabled={!inputText.trim()}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition disabled:opacity-50"
            >
              <Table className="h-4 w-4" />
              Parse & View CSV Table
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Word Counter Live Statistics Dashboard */}
      {tool.id === 'word-counter' && stats && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Real-Time Text Analytics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-center dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {stats.words.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mt-1">
                Words
              </span>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-center dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.characters.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mt-1">
                Characters
              </span>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-center dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.charactersNoSpaces.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mt-1">
                Chars (No Space)
              </span>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-center dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.lines}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mt-1">
                Lines
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-base font-bold text-slate-700 dark:text-slate-300">
                {stats.sentences}
              </span>
              <span className="text-[11px] text-slate-400 block">Sentences</span>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-base font-bold text-slate-700 dark:text-slate-300">
                {stats.paragraphs}
              </span>
              <span className="text-[11px] text-slate-400 block">Paragraphs</span>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                {stats.readingTime}
              </span>
              <span className="text-[11px] text-slate-400 block">Reading Time</span>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                {stats.speakingTime}
              </span>
              <span className="text-[11px] text-slate-400 block">Speaking Time</span>
            </div>
          </div>
        </div>
      )}

      {/* Markdown Live Preview */}
      {(tool.id === 'markdown-viewer' || tool.id === 'markdown-to-html') && (showMarkdownPreview || formattedText) && inputText && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Rendered HTML Preview
            </span>
            <button
              onClick={() =>
                downloadString(
                  markdownToHtmlSimple(inputText),
                  'rendered_markdown.html',
                  'text/html;charset=utf-8'
                )
              }
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition"
            >
              <Download className="h-3.5 w-3.5" /> Export HTML
            </button>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: markdownToHtmlSimple(inputText) }}
            className="p-2"
          />
        </div>
      )}

      {/* HTML Sandboxed Live Viewer */}
      {tool.id === 'html-viewer' && renderedHtml && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Safe Sandboxed Render
          </span>
          <iframe
            srcDoc={renderedHtml}
            title="HTML Preview"
            sandbox="allow-same-origin"
            className="w-full h-80 rounded-xl border border-slate-200 bg-white dark:border-slate-700"
          />
        </div>
      )}

      {/* CSV Table Viewer */}
      {tool.id === 'csv-viewer' && csvRows.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Tabular CSV View ({csvRows.length} rows)
              </h3>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={csvFilter}
                onChange={(e) => setCsvFilter(e.target.value)}
                placeholder="Filter table rows..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="max-h-96 overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="sticky top-0 bg-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <tr>
                  {Object.keys(csvRows[0]).map((col) => (
                    <th key={col} className="p-3 border-b border-slate-200 dark:border-slate-700">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {csvRows
                  .filter((row) =>
                    csvFilter
                      ? Object.values(row).some((val) =>
                          String(val).toLowerCase().includes(csvFilter.toLowerCase())
                        )
                      : true
                  )
                  .map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                    >
                      {Object.values(row).map((val: any, cellIdx) => (
                        <td key={cellIdx} className="p-3 font-mono">
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Formatted Output Container (JSON / XML / HTML-to-Text) */}
      {formattedText && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs dark:border-emerald-950 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Formatted Output
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(formattedText)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? t.common.copied : t.common.copyToClipboard}
              </button>
              <button
                onClick={() =>
                  downloadString(
                    formattedText,
                    tool.id === 'json-formatter'
                      ? 'formatted.json'
                      : tool.id === 'xml-formatter'
                      ? 'formatted.xml'
                      : 'text_extracted.txt'
                  )
                }
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                <Download className="h-3.5 w-3.5" />
                {t.common.download}
              </button>
            </div>
          </div>

          <textarea
            readOnly
            value={formattedText}
            rows={10}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
        </div>
      )}
    </div>
  );
};
