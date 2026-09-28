export function parseCSV(text, delimiter = ',') {
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (quoted) {
      if (c === '"' && n === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === delimiter) { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  const clean = rows.filter(r => r.some(v => String(v).trim() !== ''));
  if (!clean.length) return { columns: [], rows: [] };
  const columns = clean[0].map((v, i) => String(v).trim() || `column_${i + 1}`);
  return { columns, rows: clean.slice(1).map(r => Object.fromEntries(columns.map((c,i) => [c, r[i] ?? '']))) };
}

export function coerceValue(value) {
  const s = String(value ?? '').trim();
  if (s === '') return null;
  if (/^(true|false)$/i.test(s)) return s.toLowerCase() === 'true';
  if (/^-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(s)) return Number(s);
  const d = new Date(s);
  if (!Number.isNaN(d.getTime()) && /[-/:T]/.test(s)) return d.toISOString();
  return s;
}

export function normalizeRows(rows) {
  return rows.map(row => Object.fromEntries(Object.entries(row).map(([k,v]) => [k, coerceValue(v)])));
}
