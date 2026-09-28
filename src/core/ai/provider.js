export class AIProviderRegistry {
  constructor(providers = []) { this.providers = new Map(providers.map(p => [p.id, p])); }
  register(provider) { this.providers.set(provider.id, provider); return this; }
  get(id) { return this.providers.get(id); }
  list() { return [...this.providers.values()]; }
}

export function createAIRequest(task, context, input, responseSchema) {
  return { task, context, input, responseSchema };
}
