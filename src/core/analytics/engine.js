function values(rows, field) { return rows.map(r=>r[field]).filter(v => typeof v === 'number' && Number.isFinite(v)); }
export function aggregate(rows, field, operation='sum') {
  const vs = values(rows, field);
  if (operation === 'count') return rows.length;
  if (!vs.length) return null;
  if (operation === 'sum') return vs.reduce((a,b)=>a+b,0);
  if (operation === 'avg') return vs.reduce((a,b)=>a+b,0)/vs.length;
  if (operation === 'min') return Math.min(...vs);
  if (operation === 'max') return Math.max(...vs);
  throw new Error(`Unsupported aggregation: ${operation}`);
}

export function compare(rows, field, currentPredicate, previousPredicate, operation='sum') {
  const current = aggregate(rows.filter(currentPredicate), field, operation);
  const previous = aggregate(rows.filter(previousPredicate), field, operation);
  const delta = current == null || previous == null ? null : current - previous;
  const deltaPercent = previous ? (delta / Math.abs(previous)) * 100 : null;
  return { field, operation, current, previous, delta, deltaPercent };
}

export function groupBy(rows, dimension, metric, operation='sum') {
  const groups = new Map();
  for (const row of rows) { const key = String(row[dimension] ?? '∅'); if (!groups.has(key)) groups.set(key, []); groups.get(key).push(row); }
  return [...groups.entries()].map(([key, rs]) => ({ key, value: aggregate(rs, metric, operation), rows: rs.length })).sort((a,b)=>(b.value??-Infinity)-(a.value??-Infinity));
}
