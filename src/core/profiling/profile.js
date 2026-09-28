const numeric = v => typeof v === 'number' && Number.isFinite(v);
const dateLike = v => typeof v === 'string' && !Number.isNaN(Date.parse(v));
export function inferSchema(rows, columns) {
  return columns.map(name => {
    const values = rows.map(r => r[name]).filter(v => v !== null && v !== undefined && v !== '');
    const nullCount = rows.length - values.length;
    const uniqueCount = new Set(values.map(v => String(v))).size;
    const numberCount = values.filter(numeric).length;
    const boolCount = values.filter(v => typeof v === 'boolean').length;
    const dateCount = values.filter(dateLike).length;
    let type = 'string';
    if (numberCount / Math.max(values.length,1) > .95) type = 'number';
    else if (boolCount / Math.max(values.length,1) > .95) type = 'boolean';
    else if (dateCount / Math.max(values.length,1) > .95) type = 'date';
    return { name, type, nullable: nullCount > 0, nullCount, uniqueCount };
  });
}

export function profileDataset(rows, schema) {
  return { rowCount: rows.length, columns: schema.length, nullCells: schema.reduce((n,c)=>n+c.nullCount,0), duplicateRows: rows.length - new Set(rows.map(r=>JSON.stringify(r))).size };
}

export function qualityReport(rows, schema) {
  const issues = [];
  for (const c of schema) {
    if (c.nullCount) issues.push({severity:'warning', code:'NULL_VALUES', column:c.name, count:c.nullCount});
    if (c.uniqueCount === 1 && rows.length > 1) issues.push({severity:'info', code:'CONSTANT_COLUMN', column:c.name, count:rows.length});
  }
  const duplicateRows = rows.length - new Set(rows.map(r=>JSON.stringify(r))).size;
  if (duplicateRows) issues.push({severity:'warning', code:'DUPLICATE_ROWS', count:duplicateRows});
  return issues;
}
