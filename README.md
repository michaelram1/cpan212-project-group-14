# TripTally — Travel Budget Tracker

**CPAN 212 Term Project · M1–M4 practice implementation**

Plan trips, record travel expenses, and convert foreign-currency amounts into your trip's budget currency. Built with **Node.js 24, Express 5, Next.js 16, React, and the Frankfurter exchange-rate API**. The API's two CRUD resources are `Trip` and `Expense`.

> M4 practice copy: MongoDB persistence replaces in-memory storage. Authentication and deployment remain future milestones. Database integration and frontend build require local verification.

## Group and repository details

- **Blackboard group number:** `14`
- **Repository:** `https://github.com/michaelram1/cpan212-project-group-14`
- **Members + GitHub usernames:** `[FILL IN ACTUAL NAMES/USERNAMES]`

Do not invent members or contributions. This course requires each member to commit from their own GitHub account.

## Requirements

- Install **Node.js 24** (not Node 22). Verify with `node -v`.
- Git and VS Code are recommended.
- Internet access is needed to install packages and for **foreign-currency** conversions with Frankfurter. Same-currency expense creation still works if the provider is offline.
- MongoDB is required (local server or Atlas). No Frankfurter API key is required.

## Run both projects locally

**Terminal 1 — Express server:**

```bash
cd api
npm install
# Copy .env.example to .env and configure MONGODB_URI before continuing.
npm run seed
npm run dev
```

The API should print: `TripTally API ready at http://localhost:4000`.

**Terminal 2 — Next.js frontend:**

```bash
cd web
npm install
```

Create `web/.env.local` (the file should **not** be committed) with the line:

```ini
EXPRESS_API_ORIGIN=http://localhost:4000
```

Then run:

```bash
npm run dev
```

Open **http://localhost:3000** in your browser. After seeding, you should see 30 sample trips across three pages.

### Windows PowerShell notes

- In VS Code choose **Terminal > New Terminal**, then open a second terminal with the `+` button. Keep both terminals running.
- To create the `.env.local` from the supplied example in PowerShell while inside `web`, run: `Copy-Item .env.example .env.local`.
- PowerShell `curl` may refer to a PowerShell alias; use **Git Bash** for the README's test commands or `curl.exe` explicitly.

## Site navigation and features

- `/trips`: list of trips (with empty and loading states).
- `/trips/new`: create trip with field validation.
- `/trips/[id]`: detail, budget spent/remaining, expenses, delete trip.
- `/trips/[id]/edit`: edit trip.
- `/trips/[id]/expenses/new`: create an expense with a server-powered foreign-currency preview.
- `/expenses/[id]/edit`: edit an expense.

A user may delete individual expenses, and deleting a trip deletes its expenses. Saving or editing an expense with an original currency different from the trip's budget currency snapshots the published rate, conversion amount and rate date in the record. Currency is fixed after creating a trip to keep these stored conversions meaningful.

The UI uses React Context to remember a selected trip across pages. The root header links to the selected trip's detail and edit routes. Next.js server components load trips and expenses from Express, while browser requests use `/api/...` rewrites.

**Deviation from M1 wireframes:** The four conceptual pages and fields remain the same, but the implemented M3 cards, budget summary and spacing use a revised responsive design. The additional expense create/edit pages implement the second resource's CRUD functionality.

## API endpoints

| Method | Path | Purpose | Success |
|---|---|---|---|
| GET | `/api/trips` | All trips | 200 |
| GET | `/api/trips/:id` | One trip | 200 |
| POST | `/api/trips` | Create trip | 201 |
| PATCH | `/api/trips/:id` | Update trip | 200 |
| DELETE | `/api/trips/:id` | Delete trip and expenses | 204 |
| GET | `/api/expenses?tripId=:id` | Trip expenses | 200 |
| GET | `/api/expenses/:id` | One expense | 200 |
| POST | `/api/expenses` | Create and convert an expense | 201 |
| PATCH | `/api/expenses/:id` | Update an expense | 200 |
| DELETE | `/api/expenses/:id` | Delete expense | 204 |
| GET | `/api/rates?from=USD&to=CAD&amount=50` | Preview currency conversion | 200 |

All failures return `{"error":{"message":"...","details":...}}`. The API responds with 400 for invalid fields, 404 for missing records/routes, 502 for provider errors, 504 for provider timeouts. See [api/README.md](api/README.md) for every `curl` test.

## Unit tests and build checks

```bash
cd api
npm test
```

```bash
cd web
npm run build
```

M2 demo: show an API list, real id, missing id error, and call the rate endpoint twice to show `FX cache hit` logged in the Express terminal.

M3 demo: show the main browser flow, create/edit and an inline validation error. Each member must record the assignment's separate **2–3 minute walkthrough** using code from their own commits.

## External API

- [Frankfurter API documentation](https://frankfurter.dev/)
- Provider request from Express: `GET https://api.frankfurter.dev/v2/rate/usd/cad`
- No API key. Responses are cached in memory for one hour, with a terminal log on cache hits. Rate requests time out after three seconds.
- Rates are indicative **reference rates**, not guaranteed credit-card settlement rates.

## M1 proposal and wireframes

- [docs/proposal.md](docs/proposal.md)
- Four PNG sketches in [docs/wireframes/](docs/wireframes/): list, detail, create, edit.

**Complete the TODOs in `docs/proposal.md`** (including one real Frankfurter request/response from your machine), and complete real member info before submitting.

## Milestone roadmap

- **M4:** MongoDB and Mongoose models, pagination/filtering/sorting, seeded records (practice implementation; verify locally).
- **M5:** password hashing, register/login/logout, server sessions, ownership and secure routes.
- **M6:** Render + Atlas + Vercel deployment, unlisted presentation, responsive polish and a category spending chart.

## Known limitations

- M4 stores records in MongoDB. Run the seed only when you intend to reset sample data.
- Currency conversion requires Frankfurter's server to be reachable. The application shows an error if a conversion cannot be completed.
- There is no login/ownership yet: required in M5, not M4.
- Sample trips/expenses in `api/src/seed.js` are illustrative; no historical currency quotes are hardcoded.

## AI use

The M4 practice implementation was generated with ChatGPT, including models, controllers, database connection, seed, list controls and test changes. No individual authorship or completed live tests are claimed.

AI tools assisted in preparing the initial project concept, the proposal draft, wireframes, application scaffolding, Express routes/controllers, validation, Next.js pages, stylesheet, and tests. The project members must review, run, debug, understand, and accurately disclose their own work. All contributor names, commit references, actual test results, and walkthrough videos must reflect real activity rather than generated claims.

## Submitting

For each milestone, push the relevant files to `main`, then **one group member** submits the **public GitHub repo URL as text** to that milestone's Blackboard group dropbox (no zip attachment). M4 requires a second line `Tag: m4` and the pushed Git tag. M3's submission also needs each member's walkthrough video URL and the group demo video URL. Refer to [SUBMISSION_STEPS.md](SUBMISSION_STEPS.md) for commands and final checks.

## M4 database and list queries

Set `MONGODB_URI` in `api/.env` to `mongodb://127.0.0.1:27017/triptally` for a running local MongoDB or to your Atlas connection string. Never commit the actual `.env`. `npm run seed` deletes all Trip and Expense documents in the configured database and creates 30 trips and 60 expenses. Use a development database only.

`GET /api/trips` accepts `currency` (CAD, USD, EUR, GBP), `sort` (title, destination, startDate, budgetTotal, createdAt; prefix `-` for descending), `page` (default 1), `limit` (default 10, capped at 50). It returns items, total, page, limit and totalPages. Example: `/api/trips?currency=CAD&sort=-budgetTotal&page=1&limit=5`. Expenses return populated trip details in `trip` and retain a string `tripId`.

To run integration tests set `MONGODB_TEST_URI` to a separate test database; without it the integration test is skipped. Never use your production database for testing.
