export function createEvidence({ type, datasetId, operation, input, result }) {
  return { id: crypto.randomUUID(), type, datasetId, operation, input, result, verification: { deterministic: true, verifiedAt: new Date().toISOString() } };
}
