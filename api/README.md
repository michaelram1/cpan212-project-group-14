# TripTally API — M4 MongoDB REST API

## Install and run

Node.js **24** required; Express **5**, Mongoose **9** and zod. Records persist in MongoDB.

```bash
npm install
# Copy .env.example to .env and set MONGODB_URI
npm run seed
npm run dev
```

Open http://localhost:4000/api/trips . API reads `PORT` (default `4000`) and `FRANKFURTER_BASE_URL` (default `https://api.frankfurter.dev`); see `.env.example`. To customize, copy `.env.example` to `.env`. Don't commit `.env`.

Scripts: `npm run dev` for watched Node 24 server; `npm start` for non-watched server; `npm test` for test cases.

## Endpoints

| Method | Path | Purpose | Normal status |
|---|---|---|---|
| GET | `/api/trips` | List all trips | 200 |
| GET | `/api/trips/:id` | Read trip | 200 |
| POST | `/api/trips` | Add trip | 201 |
| PATCH | `/api/trips/:id` | Edit trip | 200 |
| DELETE | `/api/trips/:id` | Delete trip and child expenses | 204 |
| GET | `/api/expenses?tripId=:id` | List expenses for a trip | 200 |
| GET | `/api/expenses/:id` | Read expense | 200 |
| POST | `/api/expenses` | Add expense with conversion snapshot | 201 |
| PATCH | `/api/expenses/:id` | Edit expense | 200 |
| DELETE | `/api/expenses/:id` | Delete expense | 204 |
| GET | `/api/rates?from=USD&to=CAD&amount=50` | Convert money (server fetch) | 200 |

Create/update invalid body → 400 with field details. Unknown id or route → 404. External upstream failure → 502; timeout → 504. All non-204 failures follow `{ "error": { "message": "...", "details": ... } }` and never expose stack traces.

Data validation:
- Trip: title 3–80, destination 2–80, startDate/endDate YYYY-MM-DD and chronological, budgetTotal positive, budgetCurrency CAD/USD/EUR/GBP, optional notes ≤500. Budget currency cannot be changed after creation.
- Expense: existing tripId ObjectId; title 2–80; category `transport|lodging|food|activities|shopping|other`; positive amountOriginal; originalCurrency CAD/USD/EUR/GBP; valid date; optional notes ≤300.
- IDs, createdAt, convertedAmount, fxRate and fxRateDate are server-generated and cannot be overwritten by client request bodies.

Frankfurter docs: https://frankfurter.dev/ . The server fetches `/v2/rate/{from}/{to}` using `AbortSignal.timeout(3000)`. One-hour in-memory cached rates are keyed by currency pair and log `FX cache hit: USD:CAD` on reuse. We return our own `{from,to,amount,rate,convertedAmount,rateDate}` JSON. No API key is needed.

## Testing (Git Bash on Windows)

**Start the API first.** These commands cover every endpoint. Because ids are generated, copy one id from the results and assign the variables below **before testing get/update/delete**. Do **not** delete a record until after its read and update tests.

```bash
# 1. List trips: expected 200
curl -i http://localhost:4000/api/trips

# 2. Create a trip: expected 201 (copy the returned id)
curl -i -X POST http://localhost:4000/api/trips -H 'Content-Type: application/json' -d '{"title":"Rome Weekend","destination":"Rome, Italy","startDate":"2027-05-10","endDate":"2027-05-14","budgetTotal":1200,"budgetCurrency":"CAD","notes":"Museums and cafés"}'

# Replace the placeholder with the id from that 201 response:
TRIP_ID='PASTE_RETURNED_TRIP_OBJECT_ID'

# 3. Get one trip: expected 200
curl -i "http://localhost:4000/api/trips/$TRIP_ID"

# 4. Edit a trip: expected 200
curl -i -X PATCH "http://localhost:4000/api/trips/$TRIP_ID" -H 'Content-Type: application/json' -d '{"budgetTotal":1400}'

# 5. List this trip's expenses: expected 200 (empty initially)
curl -i "http://localhost:4000/api/expenses?tripId=$TRIP_ID"

# 6. Create an expense: expected 201. Replace PASTE_RETURNED_TRIP_OBJECT_ID with the same trip id:
curl -i -X POST http://localhost:4000/api/expenses -H 'Content-Type: application/json' -d '{"tripId":"PASTE_RETURNED_TRIP_OBJECT_ID","title":"Metro ticket","category":"transport","amountOriginal":28,"originalCurrency":"CAD","spentOn":"2027-05-10","notes":"Airport transfer"}'

# Replace this placeholder with the expense id from the 201 response:
EXPENSE_ID='PASTE_RETURNED_EXPENSE_OBJECT_ID'

# 7. Get one expense: expected 200
curl -i "http://localhost:4000/api/expenses/$EXPENSE_ID"

# 8. Edit an expense: expected 200
curl -i -X PATCH "http://localhost:4000/api/expenses/$EXPENSE_ID" -H 'Content-Type: application/json' -d '{"title":"Airport express"}'

# 9. Foreign currency preview: expected 200 if provider is reachable
curl -i 'http://localhost:4000/api/rates?from=USD&to=CAD&amount=50'

# 10. Repeat the exact preview query: expected 200, plus terminal "FX cache hit: USD:CAD"
curl -i 'http://localhost:4000/api/rates?from=USD&to=CAD&amount=50'

# 11. Invalid trip create: expected 400 with fields in error.details
curl -i -X POST http://localhost:4000/api/trips -H 'Content-Type: application/json' -d '{"title":""}'

# 12. Missing trip: expected 404 in shared error shape
curl -i http://localhost:4000/api/trips/not-an-id

# 13. Unknown route: expected 404
curl -i http://localhost:4000/api/does-not-exist

# 14. Delete expense: expected 204, no body
curl -i -X DELETE "http://localhost:4000/api/expenses/$EXPENSE_ID"

# 15. Delete trip: expected 204, no body
curl -i -X DELETE "http://localhost:4000/api/trips/$TRIP_ID"
```

**Video sequence (M2 first 3 minutes):** GET `/api/trips`; GET one real id; GET missing id and show 404; GET `/api/rates` twice and show `FX cache hit` in the API terminal. This is the M2 portion of the group's single M2/M3 video.

## Contributions

Update the root `CONTRIBUTIONS.md` M4 section with real members and actual commits/PRs. Root `README.md` contains the AI use disclosure. Do not commit secrets or dependency folders.

## M4 database configuration

`MONGODB_URI` is required before the server starts. Use a running local MongoDB instance or an Atlas URI. `npm run seed` resets both collections (30 trips, 60 expenses); never run against production.

Trip list query parameters: `currency` (CAD/USD/EUR/GBP), `sort` (title, destination, startDate, budgetTotal, createdAt, optionally prefixed with `-`), `page` (default 1), `limit` (default 10, maximum 50). Invalid sort fields return 400.

```bash
curl -i "http://localhost:4000/api/trips?currency=CAD&sort=-budgetTotal&page=1&limit=5" # 200
curl -i "http://localhost:4000/api/trips?sort=unknown" # 400
```

Set `MONGODB_TEST_URI` to a dedicated test database for integration tests; the test creates and removes its own records.
