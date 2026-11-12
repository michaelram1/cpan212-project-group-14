import { HttpError } from '../lib/httpError.js';

export const roundMoney = (amount) => Math.round((amount + Number.EPSILON) * 100) / 100;

// Factory allows deterministic unit tests without the network.
export function createRateService({
  fetchImpl = fetch,
  now = Date.now,
  log = console.log,
  ttlMs = 60 * 60 * 1000,
  baseUrl = process.env.FRANKFURTER_BASE_URL || 'https://api.frankfurter.dev'
} = {}) {
  const cache = new Map();

  async function rateFor(from, to) {
    if (from === to) return { rate: 1, rateDate: null };
    const key = `${from}:${to}`;
    const cached = cache.get(key);
    if (cached && cached.expiresAt > now()) {
      log(`FX cache hit: ${key}`);
      return cached.value;
    }
    const url = `${baseUrl.replace(/\/$/, '')}/v2/rate/${from.toLowerCase()}/${to.toLowerCase()}`;
    let response;
    try {
      response = await fetchImpl(url, { signal: AbortSignal.timeout(3000) });
    } catch (error) {
      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        throw new HttpError(504, 'Exchange rate provider timed out');
      }
      throw new HttpError(502, 'Exchange rate provider failed');
    }
    if (!response.ok) throw new HttpError(502, 'Exchange rate provider failed');
    let data;
    try {
      data = await response.json();
    } catch {
      throw new HttpError(502, 'Exchange rate provider returned invalid data');
    }
    if (!data || data.base?.toUpperCase() !== from || data.quote?.toUpperCase() !== to ||
        !Number.isFinite(data.rate) || data.rate <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(data.date || '')) {
      throw new HttpError(502, 'Exchange rate provider returned invalid data');
    }
    const value = { rate: data.rate, rateDate: data.date };
    cache.set(key, { value, expiresAt: now() + ttlMs });
    return value;
  }

  async function convert(from, to, amount) {
    const { rate, rateDate } = await rateFor(from, to);
    return { from, to, amount, rate, convertedAmount: roundMoney(amount * rate), rateDate };
  }
  return { convert, rateFor };
}

export const rateService = createRateService();
