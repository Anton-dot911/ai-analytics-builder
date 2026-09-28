export class OpenAICompatibleProvider {
  constructor({id='openai-compatible', name='OpenAI Compatible', endpoint, apiKey='', model}) { Object.assign(this,{id,name,endpoint,apiKey,model}); }
  async analyze(request) {
    if (!this.endpoint) throw new Error('AI endpoint is not configured');
    const headers = {'content-type':'application/json'};
    if (this.apiKey) headers.authorization = `Bearer ${this.apiKey}`;
    const body = { model:this.model, messages:[{role:'system',content:request.context?.system||'Return structured, evidence-aware analysis.'},{role:'user',content:typeof request.input==='string'?request.input:JSON.stringify(request.input)}], temperature:0 };
    const r = await fetch(this.endpoint, {method:'POST', headers, body:JSON.stringify(body)});
    if (!r.ok) throw new Error(`AI provider HTTP ${r.status}: ${await r.text()}`);
    const data = await r.json();
    return {provider:this.id, model:data.model||this.model, content:data.choices?.[0]?.message?.content ?? data};
  }
}
