const fs = require('fs')
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args))

async function main() {
  const token = process.env.VERCEL_TOKEN
  const projectId = process.env.NEW_VERCEL_PROJECT_ID
  const teamId = process.env.VERCEL_TEAM // optional
  if (!token || !projectId) {
    console.error('Require VERCEL_TOKEN and NEW_VERCEL_PROJECT_ID environment variables')
    process.exit(1)
  }
  const raw = fs.readFileSync('vercel-env-export.json', 'utf8')
  const data = JSON.parse(raw)
  const envTargets = {
    production: ['production'],
    preview: ['preview'],
    development: ['development'],
  }
  for (const envName of Object.keys(data)) {
    const vars = data[envName]
    for (const [key, value] of Object.entries(vars || {})) {
      const body = {
        key: key,
        value: value,
        target: envTargets[envName] || ['development'],
        type: 'encrypted',
      }
      const url = `https://api.vercel.com/v9/projects/${projectId}/env`
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
      if (teamId) headers['X-Vercel-Team-Id'] = teamId
      const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
      if (!res.ok) {
        const text = await res.text()
        console.error('Failed to add', key, res.status, text)
      } else {
        console.log('Added', key, '->', envName)
      }
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
