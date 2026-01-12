import process from 'process';

const DEPLOY = process.env.DEPLOY_URL || 'https://opsvantage-ai-explainer-engine.vercel.app';

async function checkRoot() {
  const url = `${DEPLOY}/`;
  try {
    const res = await fetch(url, { method: 'GET' });
    const text = await res.text().catch(() => '');
    return { url, ok: res.ok, status: res.status, length: text.length, contentType: res.headers.get('content-type') };
  } catch (err) {
    return { url, ok: false, error: String(err) };
  }
}

async function checkApi() {
  const url = `${DEPLOY}/api/ai-explainer`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Smoke test: generate explainer for "HTTP caching"', niche: 'Testing' }),
    });
    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);
    return { url, ok: res.ok, status: res.status, body };
  } catch (err) {
    return { url, ok: false, error: String(err) };
  }
}

(async function run() {
  console.log('Running smoke checks against', DEPLOY);
  const root = await checkRoot();
  console.log('\n/ check:');
  console.log(JSON.stringify(root, null, 2));

  const api = await checkApi();
  console.log('\n/api/ai-explainer check:');
  console.log(JSON.stringify(api, null, 2));

  const allOk = root.ok && api.ok;
  process.exit(allOk ? 0 : 2);
})();