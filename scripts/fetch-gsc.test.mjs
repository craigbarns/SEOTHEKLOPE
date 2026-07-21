import { test } from 'node:test'
import assert from 'node:assert/strict'
import { dateRange, buildRequestBody } from './fetch-gsc.mjs'

test('dateRange : 28 jours se terminant 3 jours avant aujourd’hui', () => {
  const { startDate, endDate } = dateRange(new Date('2026-07-21T10:00:00Z'))
  assert.equal(endDate, '2026-07-18')
  assert.equal(startDate, '2026-06-21')
})

test('buildRequestBody : corps de requête Search Analytics', () => {
  const body = buildRequestBody('2026-06-21', '2026-07-18', 'query')
  assert.deepEqual(body, {
    startDate: '2026-06-21',
    endDate: '2026-07-18',
    dimensions: ['query'],
    rowLimit: 50,
  })
})
