// Lightweight renderer for the small Markdown subset supported by product descriptions:
// "### heading", "* bullet", "| pipe | table |" and plain paragraphs.
// Shared between the storefront product page and the admin live preview so both stay in sync.

import type { ReactNode } from 'react';

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

export function MarkdownLite({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split('\n');
  const nodes: ReactNode[] = [];

  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // --- Table block: consecutive "| ... |" lines ---
    if (isTableRow(line)) {
      const tableLines: string[] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        tableLines.push(lines[i]);
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
          className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800"
        >
          <table className="w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900">
                {headerCells.map((cell, idx) => (
                  <th
                    key={idx}
                    className="border-b border-slate-200 px-3 py-2 text-left font-bold text-slate-900 dark:border-slate-800 dark:text-white"
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
                  className="odd:bg-white even:bg-slate-50/60 dark:odd:bg-transparent dark:even:bg-slate-900/40"
                >
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={
                        cIdx === 0
                          ? 'border-b border-slate-100 px-3 py-2 font-semibold text-slate-500 dark:border-slate-800'
                          : 'border-b border-slate-100 px-3 py-2 font-mono text-slate-800 dark:border-slate-800 dark:text-slate-200'
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

    // --- Bullet list block: consecutive "* item" lines ---
    if (line.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('* ')) {
        items.push(lines[i].replace('* ', ''));
        i++;
      }
      nodes.push(
        <ul key={key++} className="list-disc space-y-1.5 pl-5">
          {items.map((item, idx) => (
            <li key={idx} className="text-slate-700 dark:text-slate-300">
              {item}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // --- Heading ---
    if (line.startsWith('### ')) {
      nodes.push(
        <h3
          key={key++}
          className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-white"
        >
          {line.replace('### ', '')}
        </h3>
      );
      i++;
      continue;
    }

    // --- Blank line ---
    if (line.trim() === '') {
      i++;
      continue;
    }

    // --- Paragraph ---
    nodes.push(<p key={key++}>{line}</p>);
    i++;
  }

  return <>{nodes}</>;
}
