import { useEffect, useMemo, useState } from 'react';
import { Button, ErrorState, Input, Skeleton } from '@base/ui';
import { ApiError, api, request } from './api';
import { PageHeader } from './App';

type Operation = {
  summary: string;
  tags?: string[];
  security?: unknown[];
  requestBody?: { content?: Record<string, { schema?: unknown }> };
  ['x-permission']?: string;
  ['x-module']?: string;
};
type Document = { info: { title: string; version: string }; paths: Record<string, Record<string, Operation>> };
const allowed = new Set(['get', 'post', 'put', 'patch', 'delete']);

export function ApiDocsPage() {
  const [document, setDocument] = useState<Document | null>(null);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<{ path: string; method: string; operation: Operation } | null>(null);
  const [path, setPath] = useState('');
  const [body, setBody] = useState('{}');
  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    api<Document>('/openapi.json').then(setDocument).catch(() => setError('Unable to load the API contract.'));
  }, []);
  const groups = useMemo(() => {
    if (!document) return [] as [string, { path: string; method: string; operation: Operation }[]][];
    const byTag = new Map<string, { path: string; method: string; operation: Operation }[]>();
    for (const [route, item] of Object.entries(document.paths)) for (const [method, operation] of Object.entries(item)) {
      if (!allowed.has(method)) continue;
      const tag = operation.tags?.[0] || 'Other';
      byTag.set(tag, [...(byTag.get(tag) || []), { path: route, method, operation }]);
    }
    return [...byTag.entries()];
  }, [document]);
  function select(endpoint: { path: string; method: string; operation: Operation }) {
    setSelected(endpoint); setPath(endpoint.path); setBody('{}'); setResult('');
  }
  async function tryRequest() {
    if (!selected) return;
    let payload: unknown;
    const requiresBody = ['post', 'put', 'patch'].includes(selected.method) && selected.operation.requestBody;
    if (requiresBody) try { payload = JSON.parse(body); } catch { setResult('Request body must be valid JSON.'); return; }
    setBusy(true); setResult('');
    try {
      const response = await request(path, { method: selected.method.toUpperCase(), ...(requiresBody ? { body: JSON.stringify(payload) } : {}) });
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(JSON.stringify(error instanceof ApiError ? { status: error.status, code: error.code, details: error.details } : { error: 'REQUEST_FAILED' }, null, 2));
    } finally { setBusy(false); }
  }
  return (
    <div className="api-docs">
      <PageHeader
        title="API documentation"
        description={
          document
            ? `${document.info.title} v${document.info.version}. Uses your current signed-in session.`
            : 'Uses your current signed-in session.'
        }
      />
      {error ? (
        <ErrorState message={error} retry={() => window.location.reload()} />
      ) : !document ? (
        <Skeleton />
      ) : (
        <div className="api-docs-layout">
          <section className="api-endpoints" aria-label="API endpoints">
            {groups.map(([tag, endpoints]) => (
              <section key={tag}>
                <h2>{tag}</h2>
                {endpoints.map((endpoint) => (
                  <button
                    key={endpoint.method + endpoint.path}
                    className={
                      selected?.method === endpoint.method && selected.path === endpoint.path
                        ? 'api-endpoint selected'
                        : 'api-endpoint'
                    }
                    onClick={() => select(endpoint)}
                  >
                    <span className={'http-method method-' + endpoint.method}>{endpoint.method}</span>
                    <span>
                      <strong>{endpoint.operation.summary}</strong>
                      <small>{endpoint.path}</small>
                    </span>
                  </button>
                ))}
              </section>
            ))}
          </section>
          <section className="api-console" aria-live="polite">
            {selected ? (
              <>
                <h2>{selected.operation.summary}</h2>
                <p className="muted">
                  <code>
                    {selected.method.toUpperCase()} {selected.path}
                  </code>
                  {selected.operation['x-permission'] && (
                    <> · requires <code>{selected.operation['x-permission']}</code></>
                  )}
                  {selected.operation['x-module'] && (
                    <> · module <code>{selected.operation['x-module']}</code></>
                  )}
                </p>
                <label>
                  Request path
                  <Input value={path} onChange={(event) => setPath(event.target.value)} />
                </label>
                {selected.operation.requestBody && (
                  <label>
                    JSON request body
                    <textarea
                      className="input"
                      rows={9}
                      value={body}
                      onChange={(event) => setBody(event.target.value)}
                    />
                  </label>
                )}
                <Button onClick={tryRequest} loading={busy}>
                  Send request
                </Button>
                {result && <pre className="api-result">{result}</pre>}
              </>
            ) : (
              <p className="muted">Select an endpoint to inspect it or send a request.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
