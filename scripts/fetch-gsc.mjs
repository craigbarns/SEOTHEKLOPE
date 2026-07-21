// Récupère les données Google Search Console pour le run quotidien de
// l'agent SEO, sans aucune dépendance npm (JWT signé via node:crypto).
// Sortie : JSON sur stdout. Sans secret GSC_CREDENTIALS : "{}" (mode dégradé).
import { createSign } from 'node:crypto'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly'

export function dateRange(today = new Date()) {
  const end = new Date(today)
  end.setUTCDate(end.getUTCDate() - 3) // GSC a ~3 jours de latence
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - 27)
  const iso = (d) => d.toISOString().slice(0, 10)
  return { startDate: iso(start), endDate: iso(end) }
}

export function buildRequestBody(startDate, endDate, dimension) {
  return { startDate, endDate, dimensions: [dimension], rowLimit: 50 }
}

function base64url(input) {
  return Buffer.from(input).toString('base64url')
}

async function getAccessToken(creds) {
  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = base64url(JSON.stringify({
    iss: creds.client_email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }))
  const signer = createSign('RSA-SHA256')
  signer.update(`${header}.${claims}`)
  const signature = signer.sign(creds.private_key, 'base64url')
  const assertion = `${header}.${claims}.${signature}`

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })
  if (!res.ok) throw new Error(`Token Google refusé : ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.access_token
}

async function queryGsc(siteUrl, token, body) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`GSC ${res.status} : ${await res.text()}`)
  const data = await res.json()
  return data.rows ?? []
}

async function main() {
  const raw = process.env.GSC_CREDENTIALS
  const siteUrl = process.env.GSC_SITE_URL || 'sc-domain:theklope.com'
  if (!raw) {
    process.stdout.write('{}')
    return
  }
  const creds = JSON.parse(raw)
  const token = await getAccessToken(creds)
  const { startDate, endDate } = dateRange()
  const [topQueries, topPages] = await Promise.all([
    queryGsc(siteUrl, token, buildRequestBody(startDate, endDate, 'query')),
    queryGsc(siteUrl, token, buildRequestBody(startDate, endDate, 'page')),
  ])
  process.stdout.write(JSON.stringify(
    { generatedAt: new Date().toISOString(), siteUrl, startDate, endDate, topQueries, topPages },
    null, 2,
  ))
}

const isDirectRun = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())
if (isDirectRun) {
  main().catch((err) => {
    console.error(`fetch-gsc : ${err.message}`)
    process.exit(1)
  })
}
