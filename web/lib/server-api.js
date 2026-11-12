// Called ONLY from Next.js server components.
// Client components use relative /api/... URLs through next.config.mjs rewrites.
export async function apiResponse(path) {
  const origin = process.env.EXPRESS_API_ORIGIN;
  if (!origin) throw new Error('Missing EXPRESS_API_ORIGIN. Create web/.env.local from web/.env.example.');
  let response;
  try {
    response = await fetch(`${origin.replace(/\/$/, '')}${path}`, { cache: 'no-store' });
  } catch {
    throw new Error('TripTally API is unavailable. Start the Express server on port 4000.');
  }
  return response;
}

export async function apiJson(path) {
  const response = await apiResponse(path);
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.json();
}
