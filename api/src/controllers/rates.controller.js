import { parseInput, previewRateSchema } from '../validation/schemas.js';
import { rateService } from '../services/rates.service.js';

export async function previewRate(req, res) {
  const { from, to, amount } = parseInput(previewRateSchema, req.query);
  const converted = await rateService.convert(from, to, amount);
  res.json(converted);
}
