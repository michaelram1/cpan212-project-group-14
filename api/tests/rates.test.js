import test from 'node:test';
import assert from 'node:assert/strict';
import { createRateService } from '../src/services/rates.service.js';

const fakeResponse = { ok: true, json: async () => ({ base: 'USD', quote: 'CAD', rate: 1.35, date: '2026-11-10' }) };

test('converts a currency pair and returns own JSON shape', async () => {
  const service = createRateService({ fetchImpl: async () => fakeResponse });
  assert.deepEqual(await service.convert('USD', 'CAD', 20), {
    from: 'USD', to: 'CAD', amount: 20, rate: 1.35, convertedAmount: 27, rateDate: '2026-11-10'
  });
});

test('caches pairs, logs cache hits, and refetches after expiry', async () => {
  let count = 0;
  let time = 0;
  const logs = [];
  const service = createRateService({
    fetchImpl: async () => { count++; return fakeResponse; },
    now: () => time,
    log: (s) => logs.push(s),
    ttlMs: 1000
  });
  await service.convert('USD', 'CAD', 10);
  await service.convert('USD', 'CAD', 10);
  assert.equal(count, 1);
  assert.equal(logs[0], 'FX cache hit: USD:CAD');
  time = 1000;
  await service.convert('USD', 'CAD', 10);
  assert.equal(count, 2);
});

test('skips provider for same currency', async () => {
  const service = createRateService({ fetchImpl: async () => { throw Error('should not fetch'); } });
  assert.deepEqual(await service.convert('CAD','CAD',12), {
    from: 'CAD', to: 'CAD', amount: 12, rate: 1, convertedAmount: 12, rateDate: null
  });
});

test('maps provider failures to 502 and timeouts to 504', async () => {
  const failed = createRateService({ fetchImpl: async () => ({ ok: false }) });
  await assert.rejects(failed.convert('USD','CAD',10), (e) => e.status === 502);
  const timeout = createRateService({ fetchImpl: async () => { const e = Error('slow'); e.name = 'TimeoutError'; throw e; } });
  await assert.rejects(timeout.convert('USD','CAD',10), (e) => e.status === 504);
});
