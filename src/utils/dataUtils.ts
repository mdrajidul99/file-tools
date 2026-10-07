export function csvToJson(csvText: string): any[] {
  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      currentLine += char;
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
      if (char === '\r' && csvText[i + 1] === '\n') {
        i++;
      }
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  if (lines.length === 0) return [];

  function parseRow(row: string): string[] {
    const cells: string[] = [];
    let cell = '';
    let inside = false;
    for (let j = 0; j < row.length; j++) {
      const c = row[j];
      if (c === '"') {
        if (inside && row[j + 1] === '"') {
          cell += '"';
          j++;
        } else {
          inside = !inside;
        }
      } else if (c === ',' && !inside) {
        cells.push(cell.trim());
        cell = '';
      } else {
        cell += c;
      }
    }
    cells.push(cell.trim());
    return cells;
  }

  const headers = parseRow(lines[0]);
  const result: any[] = [];

  for (let k = 1; k < lines.length; k++) {
    const values = parseRow(lines[k]);
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      obj[header || `col_${index + 1}`] = values[index] ?? '';
    });
    result.push(obj);
  }

  return result;
}

export function jsonToCsv(jsonInput: string | any[]): string {
  let data: any[];
  if (typeof jsonInput === 'string') {
    data = JSON.parse(jsonInput);
  } else {
    data = jsonInput;
  }

  if (!Array.isArray(data) || data.length === 0) {
    if (typeof data === 'object' && data !== null) {
      data = [data];
    } else {
      throw new Error('Input must be a valid JSON array of objects.');
    }
  }

  const keysSet = new Set<string>();
  data.forEach((row) => {
    if (typeof row === 'object' && row !== null) {
      Object.keys(row).forEach((k) => keysSet.add(k));
    }
  });

  const headers = Array.from(keysSet);
  if (headers.length === 0) throw new Error('No keys found in JSON objects.');

  const escapeCell = (val: any) => {
    if (val === null || val === undefined) return '';
    const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvLines: string[] = [];
  csvLines.push(headers.map(escapeCell).join(','));

  data.forEach((row) => {
    const rowValues = headers.map((header) => escapeCell(row[header]));
    csvLines.push(rowValues.join(','));
  });

  return csvLines.join('\n');
}

export function formatXml(xml: string): string {
  let formatted = '';
  let indent = 0;
  const tab = '  ';
  xml = xml.replace(/(>)(<)(\/*)/g, '$1\r\n$2$3');
  const lines = xml.split('\r\n');

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;

    if (line.match(/^<\/\w/)) {
      indent = Math.max(0, indent - 1);
    }

    formatted += tab.repeat(indent) + line + '\n';

    if (line.match(/^<[\w:]+[^>]*[^\/>]$/) && !line.startsWith('<?') && !line.startsWith('<!')) {
      indent++;
    }
  });

  return formatted.trim();
}

export function htmlToPlainText(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return (doc.body.textContent || '').trim();
}

export function markdownToHtmlSimple(md: string): string {
  let html = md
    // Headings
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2 text-slate-800 dark:text-slate-100">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3 text-slate-900 dark:text-white">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold mt-6 mb-4 text-slate-900 dark:text-white">$1</h1>')
    // Bold / italic
    .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Code blocks & inline code
    .replace(/```([\s\S]*?)```/gim, '<pre class="bg-slate-900 text-slate-100 p-4 rounded-lg my-3 overflow-x-auto text-sm font-mono"><code>$1</code></pre>')
    .replace(/`([^`]+)`/gim, '<code class="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-600 dark:text-indigo-400">$1</code>')
    // Blockquotes
    .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 pl-4 py-1 italic text-slate-600 dark:text-slate-400 my-2">$1</blockquote>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-500">$1</a>')
    // Line breaks
    .replace(/\n\n/gim, '</p><p class="mb-3 leading-relaxed text-slate-700 dark:text-slate-300">')
    .replace(/\n/gim, '<br/>');

  return `<div class="prose dark:prose-invert max-w-none"><p class="mb-3 leading-relaxed text-slate-700 dark:text-slate-300">${html}</p></div>`;
}

export function getTextStatistics(text: string) {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      lines: 0,
      paragraphs: 0,
      sentences: 0,
      readingTime: '0 min',
      speakingTime: '0 min',
    };
  }

  const words = trimmed.match(/\b\S+\b/g)?.length || 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const lines = text.split('\n').length;
  const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;
  const sentences = (text.match(/[.!?]+(?:\s|$)/g) || []).length || (words > 0 ? 1 : 0);

  const readingTimeMin = Math.ceil(words / 200);
  const speakingTimeMin = Math.ceil(words / 130);

  return {
    words,
    characters,
    charactersNoSpaces,
    lines,
    paragraphs,
    sentences,
    readingTime: `${readingTimeMin} min`,
    speakingTime: `${speakingTimeMin} min`,
  };
}

export function generateUuids(count: number, uppercase = false, hyphens = true): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    let id: string = crypto.randomUUID();
    if (!hyphens) id = id.replace(/-/g, '');
    if (uppercase) id = id.toUpperCase();
    result.push(id);
  }
  return result;
}
