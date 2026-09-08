// Lightweight renderer for the Markdown subset supported by product descriptions:
// Headings, bullets (*, -, •), numbered lists (1.), tables (|), images/slides (![alt](url), <img src>, raw image URLs), and inline bold/italics.
// Shared between the storefront product page and the admin live preview so both stay in sync.

import type { ReactNode } from 'react';

// Matches markdown image: ![alt](url "optional title")
const MD_IMAGE_RE = /^!\[([^\]]*)\]\(\s*([^\s)"']+)(?:\s+["'][^"']*["'])?\s*\)$/;

// Matches HTML <img> tags: <img src="url" ... />
const HTML_IMG_RE = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/i;

// Matches standalone image URL lines (Cloudinary, standard extensions)
const STANDALONE_IMG_URL_RE = /^https?:\/\/[^\s]+(?:\.(?:png|jpe?g|webp|gif|svg)|\/image\/upload\/[^\s]+)(?:\?[^\s]*)?$/i;

function parseImageLine(line: string): { alt: string; url: string } | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // 1. Markdown syntax ![alt](url)
  const mdMatch = trimmed.match(MD_IMAGE_RE);
  if (mdMatch) {
    return { alt: mdMatch[1] || 'Product image', url: mdMatch[2] };
  }

  // 2. HTML <img> syntax
  const htmlMatch = trimmed.match(HTML_IMG_RE);
  if (htmlMatch) {
    const altMatch = trimmed.match(/alt=["']([^"']*)["']/i);
    return { alt: altMatch ? altMatch[1] : 'Product image', url: htmlMatch[1] };
  }

  // 3. Standalone Image URL on its own line
  if (STANDALONE_IMG_URL_RE.test(trimmed)) {
    return { alt: 'Product image', url: trimmed };
  }

  return null;
}

function isTableRow(line: string): boolean {
  return line.trim().startsWith('|');
}

function isTableSeparatorRow(line: string): boolean {
  return /^\|?[\s:|-]+\|?$/.test(line.trim()) && line.includes('-');
}

function parseTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split('|').map((cell) => cell.trim());
}

function isBulletListItem(line: string): boolean {
  return /^[*•-]\s+/.test(line.trim());
}

function isOrderedListItem(line: string): boolean {
  return /^\d+[.)]\s+/.test(line.trim());
}

// Inline **bold** and *italic* within a line of text
function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter((p) => p !== '');
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-semibold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={idx}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export function MarkdownLite({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split('\n');
  const nodes: ReactNode[] = [];

  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // --- Blank line ---
    if (trimmed === '') {
      i++;
      continue;
    }

    // --- Image/slide block: renders as full-width responsive banner ---
    {
      const img = parseImageLine(trimmed);
      if (img) {
        nodes.push(
          <div key={key++} className="my-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-xs dark:border-slate-800 dark:bg-slate-900/50">
            <img
              src={img.url}
              alt={img.alt || 'Product slide'}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover max-h-[850px]"
            />
          </div>
        );
        i++;
        continue;
      }
    }

    // --- Table block: consecutive "| ... |" lines ---
    if (isTableRow(trimmed)) {
      const tableLines: string[] = [];
      while (i < lines.length && isTableRow(lines[i].trim())) {
        tableLines.push(lines[i].trim());
        i++;
      }

      const headerCells = parseTableRow(tableLines[0]);
      const bodyRows = tableLines
        .slice(1)
        .filter((row) => !isTableSeparatorRow(row))
        .map(parseTableRow);

      nodes.push(
        <div
          key={key++}
          className="my-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs"
        >
          <table className="w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-900">
                {headerCells.map((cell, idx) => (
                  <th
                    key={idx}
                    className="border-b border-slate-200 px-3.5 py-2.5 text-left font-bold text-slate-900 dark:border-slate-800 dark:text-white"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="odd:bg-white even:bg-slate-50/70 hover:bg-primary/5 transition-colors dark:odd:bg-transparent dark:even:bg-slate-900/40"
                >
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={
                        cIdx === 0
                          ? 'border-b border-slate-100 px-3.5 py-2.5 font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-300'
                          : 'border-b border-slate-100 px-3.5 py-2.5 font-mono text-slate-800 dark:border-slate-800 dark:text-slate-200'
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // --- Bullet list block: consecutive "* item" / "- item" / "• item" lines ---
    if (isBulletListItem(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && isBulletListItem(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[*•-]\s+/, ''));
        i++;
      }
      nodes.push(
        <ul key={key++} className="my-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // --- Numbered / Ordered list block: consecutive "1. item", "2. item" lines ---
    if (isOrderedListItem(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && isOrderedListItem(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ''));
        i++;
      }
      nodes.push(
        <ol key={key++} className="my-3 list-decimal space-y-2 pl-5 text-slate-700 dark:text-slate-300">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // --- Headings ---
    if (trimmed.startsWith('# ')) {
      nodes.push(
        <h1 key={key++} className="mt-6 mb-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
          {trimmed.replace(/^#\s+/, '')}
        </h1>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      nodes.push(
        <h2 key={key++} className="mt-5 mb-2 font-display text-xl font-bold text-slate-900 dark:text-white">
          {trimmed.replace(/^##\s+/, '')}
        </h2>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith('### ')) {
      nodes.push(
        <h3
          key={key++}
          className="mt-5 mb-2 font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"
        >
          <span className="h-2 w-2 rounded-full bg-primary inline-block shrink-0" />
          {trimmed.replace(/^###\s+/, '')}
        </h3>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith('#### ')) {
      nodes.push(
        <h4 key={key++} className="mt-4 mb-1 font-display text-base font-bold text-slate-900 dark:text-white">
          {trimmed.replace(/^####\s+/, '')}
        </h4>
      );
      i++;
      continue;
    }

    // --- Paragraph ---
    nodes.push(
      <p key={key++} className="my-2 leading-relaxed text-slate-700 dark:text-slate-300">
        {renderInline(trimmed)}
      </p>
    );
    i++;
  }

  return <>{nodes}</>;
}
