# M4 practice copy — local verification

1. Install Node 24 and MongoDB (or configure Atlas).
2. Open the existing project folder. In PowerShell run `cd api`, `npm install`, `Copy-Item .env.example .env`. Edit `.env` with your database URI.
3. For a disposable development database only, run `npm run seed` (deletes all existing trip and expense records). Then `npm run dev`.
4. In a second terminal from the root, run `cd web`, `npm install`, `Copy-Item .env.example .env.local`, `npm run dev`.
5. Open http://localhost:3000. Test create/edit/delete, currency conversion, filtering, sort, next/previous, and reload. Restart Express and confirm a created record persists. Run `npm run build` in web. In api, set a dedicated MONGODB_TEST_URI before `npm test`.
6. This is an AI-generated practice copy. Do not represent it as independently authored coursework. Actual contribution records, runtime verification and Git history are not included.

For a legitimate milestone submission, after completing and verifying your own work, push main, create `git tag m4`, push `git push origin m4`, and submit the repository URL followed by `Tag: m4` as text. Do not attach a ZIP.
