# TripTally — Step-by-step setup and submission guide

This document covers **M1, M2 and M3**. It does not claim MongoDB/authentication/deployment is finished. The instructor requires **one public GitHub repo**, one Blackboard submission per group milestone, and unlisted YouTube videos for M2/M3.

## Step 0 — Check the dates

The course document lists M1 due **Oct 6, 2026**, M2 due **Nov 1, 2026**, M3 due **Nov 3, 2026**, and the M2/M3 group demo due **Nov 8, 2026**. The document describes a five-calendar-day late window. As of **Nov 11, 2026**, those deadlines have passed. **Email the instructor for a written extension or permission before assuming late work will earn credit**. Continue the project for M4 (Nov 24) regardless.

## Step 1 — Download and open

1. Download this project ZIP from ChatGPT and extract it in Downloads.
2. Rename the extracted folder from `cpan212-project-group-14` to `cpan212-project-group-<YOUR ACTUAL BLACKBOARD NUMBER>`.
3. Open **VS Code → File → Open Folder** and choose that folder.
4. Install **Node.js 24**. In VS Code Terminal, run `node -v` (must print v24.x.x), `npm -v`, and `git --version`.

## Step 2 — Start Express

In VS Code Terminal 1:

```powershell
cd api
npm install
npm run dev
```

Leave this running. Visit http://localhost:4000/api/trips — it should show a JSON object with `items` containing three sample trips.

## Step 3 — Start Next.js

Open a **second VS Code terminal**. If you are still in the root folder:

```powershell
cd web
npm install
Copy-Item .env.example .env.local
npm run dev
```

Leave this running. Visit **http://localhost:3000**. Click a sample trip, edit it, create a new trip, add an expense, view conversion and delete an expense. The changes update the budget summary. Note that records reset when Express restarts; MongoDB is M4.

## Step 4 — Run tests and checks

In the `api` folder (a third terminal, or stop the API temporarily):

```powershell
npm test
```

In the `web` folder, stop its dev server temporarily with Ctrl+C, then:

```powershell
npm run build
```

If the build passes, rerun `npm run dev`. Also follow **api/README.md → Testing** using Git Bash for all 11 endpoint commands and the 400/404 checks. Test an invalid create form in the browser and confirm the field error is shown. Test an unknown trip URL and an API-down page.

## Step 5 — Finish the non-code M1 requirements

1. In `docs/proposal.md`, replace the group number, actual members and GitHub usernames.
2. Run `curl https://api.frankfurter.dev/v2/rate/usd/cad` in Git Bash, then paste the actual URL and trimmed JSON response under "External API". Do not leave the format-only example as a supposedly real result.
3. The four actual wireframe PNGs are already included in `docs/wireframes/` and linked in `docs/proposal.md`.
4. Assign the required real roles (API, frontend, database, repo/PR) as appropriate; do not invent fake contributors.
5. Update `CONTRIBUTIONS.md` with each member's **real** commits for M1, M2 and M3. Confirm every person used their own linked GitHub email.
6. Update the root README with the real group number and usernames.

## Step 6 — Make the public GitHub repository

On GitHub, click **New repository**. Name it `cpan212-project-group-<N>` with your *real* group number; set **Public**; leave "Add a README" unchecked because this project already includes one.

In your project's **root VS Code terminal** (not api/ or web/):

```powershell
git init
# Only if needed: replace both values with YOUR real GitHub identity
git config user.name "YOUR REAL NAME"
git config user.email "YOUR GITHUB EMAIL"
git add .
git status
git commit -m "Create TripTally M1-M3 project"
git branch -M main
git remote add origin https://github.com/michaelram1/cpan212-project-group-14.git
git push -u origin main
```

If Git prompts for authentication, follow GitHub sign-in. **Check the browser repo is Public and all files appear**. Make later meaningful changes in additional commits from the correct personal GitHub accounts; an imported scaffold committed by one person does not establish that every member contributed.

## Step 7 — Record the M2/M3 group video

1. Use your screen recorder. Start Express and Next.js *before* recording.
2. M2 portion (maximum 3 minutes): open `http://localhost:4000/api/trips`, open one actual trip id, open `/api/trips/missing-id` and show error JSON, then open `/api/rates?from=USD&to=CAD&amount=50` twice and show the Express terminal cache log.
3. Say "Now this is the M3 frontend demo".
4. M3 portion (maximum 3 minutes): in browser, open the trips list and detail page, create or edit a trip, submit invalid form data to show the API field error beside an input, then successfully save. Show expense conversion if time permits.
5. Upload the **one combined video** to YouTube as **Unlisted**, and test the link in a private/incognito window.

## Step 8 — Individual M3 walkthroughs

Each real member records their own **2–3 minute unlisted** walkthrough: open a function/component from their *own Git commits*, explain what it does/why/bad input, make a small working code change while VS Code and the running app are visible, and **do not commit that demonstration-only change**. Speak throughout. Test each link privately.

## Step 9 — Submit on Blackboard

Blackboard → **Course Content → Start here → Project** → open the correct **M1**, **M2**, or **M3** group dropbox.

For M1 or M2, the submission text is just your **real public repo URL** (and an approved extension line if applicable). For M3, add the group demo link and each actual member's walkthrough on separate lines:

```text
https://github.com/michaelram1/cpan212-project-group-14
Member 1 Actual Name: https://youtu.be/ACTUAL_WALKTHROUGH_1
Member 2 Actual Name: https://youtu.be/ACTUAL_WALKTHROUGH_2
Demo video: https://youtu.be/ACTUAL_GROUP_DEMO
```

Attach **nothing**; the repo is the submission. Click **Submit**, not "Save Draft", and verify receipt. The instructor grades the newest commit on `main` before the Blackboard submission time.

**M2/M3 have already passed their specified deadlines.** If Blackboard no longer accepts submissions, don't try to bypass it; contact the instructor with your repo link, confirm any extension in writing, and continue preparing M4.

## Step 10 — What comes next

M4: convert both CRUD resources from in-memory arrays into MongoDB with Mongoose 9; add required seed (25+ expenses), filter/sort/paging with URL query controls and populate. M5: real sessions/passwords and ownership. M6: deploy to Render/Atlas/Vercel, build a category chart and record the final 5–8 minute video. **These later milestones are not part of this ZIP yet.**
