import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolInfo } from '../../types';
import { textToPdf } from '../../utils/pdfUtils';
import { downloadBlob, downloadString } from '../../utils/fileUtils';
import { FilePlus, Download, Plus, Trash2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  tool: ToolInfo;
}

export const CreateTools: React.FC<Props> = ({ tool }) => {
  const { t } = useApp();

  // PDF creator state
  const [docTitle, setDocTitle] = useState('My Document');
  const [docContent, setDocContent] = useState('');

  // Plain text creator state
  const [txtFileName, setTxtFileName] = useState('notes.txt');
  const [txtContent, setTxtContent] = useState('');

  // CSV spreadsheet creator state
  const [csvHeaders, setCsvHeaders] = useState<string[]>(['Name', 'Email', 'Role']);
  const [csvRows, setCsvRows] = useState<string[][]>([
    ['John Doe', 'john@example.com', 'Developer'],
    ['Jane Smith', 'jane@example.com', 'Designer'],
  ]);

  // JSON creator state
  const [jsonText, setJsonText] = useState('{\n  "status": "success",\n  "version": 1\n}');

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate PDF
  const handleDownloadPdf = async () => {
    if (!docContent.trim()) {
      setError('Please enter some text for your PDF document.');
      return;
    }
    setError(null);
    setIsProcessing(true);
    try {
      const blob = await textToPdf(docContent, docTitle);
      downloadBlob(blob, `${docTitle.toLowerCase().replace(/\s+/g, '_') || 'document'}.pdf`);
    } catch (e: any) {
      setError(e?.message || 'Failed to generate PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  // Download TXT
  const handleDownloadTxt = () => {
    const filename = txtFileName.endsWith('.txt') ? txtFileName : `${txtFileName}.txt`;
    downloadString(txtContent, filename);
  };

  // CSV table actions
  const handleAddRow = () => {
    setCsvRows([...csvRows, new Array(csvHeaders.length).fill('')]);
  };

  const handleAddColumn = () => {
    const colName = prompt('Enter column title:', `Col ${csvHeaders.length + 1}`);
    if (colName) {
      setCsvHeaders([...csvHeaders, colName]);
      setCsvRows(csvRows.map((row) => [...row, '']));
    }
  };

  const handleRemoveRow = (idx: number) => {
    setCsvRows(csvRows.filter((_, i) => i !== idx));
  };

  const handleCellChange = (rowIdx: number, colIdx: number, val: string) => {
    const updated = [...csvRows];
    updated[rowIdx][colIdx] = val;
    setCsvRows(updated);
  };

  const handleDownloadCsv = () => {
    const headerLine = csvHeaders.map((h) => `"${h.replace(/"/g, '""')}"`).join(',');
    const bodyLines = csvRows.map((r) =>
      r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = [headerLine, ...bodyLines].join('\n');
    downloadString(csvContent, 'spreadsheet.csv', 'text/csv;charset=utf-8');
  };

  // Download JSON
  const handleDownloadJson = () => {
    setError(null);
    try {
      const parsed = JSON.parse(jsonText);
      downloadString(JSON.stringify(parsed, null, 2), 'data.json', 'application/json');
    } catch (e: any) {
      setError('Invalid JSON syntax: ' + e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Create PDF Document */}
      {tool.id === 'create-pdf' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Document Header Title
            </label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="e.g. Project Overview"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Document Body Text
            </label>
            <textarea
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              placeholder="Type your content, notes, or article text here..."
              rows={10}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white leading-relaxed"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Generate & Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 2. Create TXT File */}
      {tool.id === 'create-txt' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              File Name
            </label>
            <input
              type="text"
              value={txtFileName}
              onChange={(e) => setTxtFileName(e.target.value)}
              placeholder="notes.txt"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Text Content
            </label>
            <textarea
              value={txtContent}
              onChange={(e) => setTxtContent(e.target.value)}
              placeholder="Write plain text notes..."
              rows={10}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm"
            >
              <Download className="h-4 w-4" /> Download .TXT
            </button>
          </div>
        </div>
      )}

      {/* 3. Create CSV Table */}
      {tool.id === 'create-csv' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Interactive Table Editor
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleAddColumn}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Plus className="h-3.5 w-3.5" /> Add Column
              </button>
              <button
                onClick={handleAddRow}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Plus className="h-3.5 w-3.5" /> Add Row
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <tr>
                  {csvHeaders.map((header, idx) => (
                    <th key={idx} className="p-2 border-b border-slate-200 dark:border-slate-700">
                      <input
                        type="text"
                        value={header}
                        onChange={(e) => {
                          const updated = [...csvHeaders];
                          updated[idx] = e.target.value;
                          setCsvHeaders(updated);
                        }}
                        className="w-full bg-transparent font-bold focus:outline-indigo-500"
                      />
                    </th>
                  ))}
                  <th className="p-2 w-12 text-center border-b border-slate-200 dark:border-slate-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {csvRows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-2">
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                          className="w-full rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-800 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        />
                      </td>
                    ))}
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleRemoveRow(rIdx)}
                        className="rounded p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm"
            >
              <Download className="h-4 w-4" /> Download .CSV File
            </button>
          </div>
        </div>
      )}

      {/* 4. Create JSON File */}
      {tool.id === 'create-json' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            JSON Content Structure
          </label>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={10}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />

          <div className="flex justify-end pt-2">
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm"
            >
              <Download className="h-4 w-4" /> Validate & Download .JSON
            </button>
          </div>
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
