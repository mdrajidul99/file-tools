import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolInfo } from '../../types';
import { csvToJson, jsonToCsv, generateUuids } from '../../utils/dataUtils';
import { computeTextHash, computeMD5 } from '../../utils/cryptoUtils';
import { downloadString } from '../../utils/fileUtils';
import { Copy, Check, Download, AlertCircle, RefreshCw, Key, Fingerprint } from 'lucide-react';

interface Props {
  tool: ToolInfo;
}

export const DataTools: React.FC<Props> = ({ tool }) => {
  const { t } = useApp();
  const [inputData, setInputData] = useState<string>('');
  const [outputData, setOutputData] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Hash state
  const [hashes, setHashes] = useState<{
    sha256?: string;
    sha1?: string;
    sha512?: string;
    md5?: string;
  }>({});

  // UUID generator state
  const [uuidCount, setUuidCount] = useState<number>(5);
  const [uuidUppercase, setUuidUppercase] = useState<boolean>(false);
  const [uuidHyphens, setUuidHyphens] = useState<boolean>(true);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert JSON to CSV or CSV to JSON
  const handleJsonCsvConvert = () => {
    setError(null);
    if (!inputData.trim()) return;
    try {
      if (tool.id === 'csv-to-json') {
        const json = csvToJson(inputData);
        setOutputData(JSON.stringify(json, null, 2));
      } else {
        const csv = jsonToCsv(inputData);
        setOutputData(csv);
      }
    } catch (err: any) {
      setError(err?.message || 'Conversion error.');
    }
  };

  // Base64 Text Encode / Decode
  const handleBase64Action = (action: 'encode' | 'decode') => {
    setError(null);
    try {
      if (action === 'encode') {
        setOutputData(btoa(unescape(encodeURIComponent(inputData))));
      } else {
        setOutputData(decodeURIComponent(escape(atob(inputData.trim()))));
      }
    } catch (err: any) {
      setError('Base64 processing error: ' + err.message);
    }
  };

  // URL Encode / Decode
  const handleUrlAction = (action: 'encode' | 'decode') => {
    setError(null);
    try {
      if (action === 'encode') {
        setOutputData(encodeURIComponent(inputData));
      } else {
        setOutputData(decodeURIComponent(inputData));
      }
    } catch (err: any) {
      setError('URL processing error: ' + err.message);
    }
  };

  // Hash Generator
  const handleGenerateHashes = async () => {
    setError(null);
    if (!inputData) return;
    try {
      const sha256 = await computeTextHash(inputData, 'SHA-256');
      const sha1 = await computeTextHash(inputData, 'SHA-1');
      const sha512 = await computeTextHash(inputData, 'SHA-512');
      const md5 = computeMD5(inputData);
      setHashes({ sha256, sha1, sha512, md5 });
    } catch (err: any) {
      setError('Hashing error: ' + err.message);
    }
  };

  // UUID Generator
  const handleGenerateUuids = () => {
    const list = generateUuids(uuidCount, uuidUppercase, uuidHyphens);
    setOutputData(list.join('\n'));
  };

  return (
    <div className="space-y-6">
      {/* UUID Generator Interface */}
      {tool.id === 'data-uuid-generator' ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Count (Quantity):
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={uuidCount}
                onChange={(e) => setUuidCount(Math.min(100, Math.max(1, Number(e.target.value))))}
                className="w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={uuidUppercase}
                  onChange={(e) => setUuidUppercase(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                Uppercase
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={uuidHyphens}
                  onChange={(e) => setUuidHyphens(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                Include Hyphens
              </label>
            </div>
            <div className="flex justify-end items-end pt-4">
              <button
                onClick={handleGenerateUuids}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 shadow-sm"
              >
                <Fingerprint className="h-4 w-4" /> Generate UUIDs
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Data Input */
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {tool.id === 'data-hash-generator'
              ? 'Enter Text to Hash'
              : tool.id === 'csv-to-json'
              ? 'Input CSV Data'
              : tool.id === 'json-to-csv' || tool.id === 'data-json-csv'
              ? 'Input JSON Data'
              : 'Input Text'}
          </label>
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder="Type or paste input data here..."
            rows={7}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 focus:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            {(tool.id === 'csv-to-json' || tool.id === 'json-to-csv' || tool.id === 'data-json-csv') && (
              <button
                onClick={handleJsonCsvConvert}
                disabled={!inputData.trim()}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" /> Convert Now
              </button>
            )}

            {tool.id === 'data-base64' && (
              <>
                <button
                  onClick={() => handleBase64Action('encode')}
                  disabled={!inputData.trim()}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  Encode to Base64
                </button>
                <button
                  onClick={() => handleBase64Action('decode')}
                  disabled={!inputData.trim()}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 disabled:opacity-50"
                >
                  Decode Base64
                </button>
              </>
            )}

            {tool.id === 'data-url-codec' && (
              <>
                <button
                  onClick={() => handleUrlAction('encode')}
                  disabled={!inputData.trim()}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  Encode URL
                </button>
                <button
                  onClick={() => handleUrlAction('decode')}
                  disabled={!inputData.trim()}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 disabled:opacity-50"
                >
                  Decode URL
                </button>
              </>
            )}

            {tool.id === 'data-hash-generator' && (
              <button
                onClick={handleGenerateHashes}
                disabled={!inputData}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                <Key className="h-4 w-4" /> Generate Hashes
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Hashes output */}
      {tool.id === 'data-hash-generator' && hashes.sha256 && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs dark:border-emerald-950 dark:bg-slate-900 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Calculated Cryptographic Hashes
          </h3>
          <div className="space-y-3">
            {[
              { label: 'SHA-256', val: hashes.sha256 },
              { label: 'SHA-1', val: hashes.sha1 },
              { label: 'MD5', val: hashes.md5 },
              { label: 'SHA-512', val: hashes.sha512 },
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

      {/* General text output */}
      {outputData && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs dark:border-emerald-950 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Output Data
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(outputData)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? t.common.copied : t.common.copyToClipboard}
              </button>
              <button
                onClick={() =>
                  downloadString(
                    outputData,
                    tool.id.includes('json') ? 'data.json' : tool.id.includes('csv') ? 'data.csv' : 'output.txt'
                  )
                }
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </button>
            </div>
          </div>

          <textarea
            readOnly
            value={outputData}
            rows={8}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
        </div>
      )}
    </div>
  );
};
