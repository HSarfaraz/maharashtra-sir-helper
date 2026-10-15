# SIR Saathi — Maharashtra SIR Helper

A mobile-first, English/Marathi Next.js app to organise household visit progress, field checklists, and official-process reminders.

## Privacy by design
- No sign-in, database, analytics, or cloud sync.
- Visit log and checklist are stored in the browser's `localStorage` on the current device.
- The tracker is intended for non-identifying house/serial codes only. Do not enter voter names, EPIC numbers, Aadhaar numbers, phone numbers, document details/photos, or other personal data.
- The CSV export includes only the values entered in the tracker. Review the file before sharing it.
- Clearing browser data can remove saved progress. There is a “Clear all local data” action in the footer.

## Run locally
Requires Node.js 18.17+ (Node 20 LTS recommended) and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build check

```bash
npm run build
npm start
```

## Deploy to Vercel
1. Create a GitHub repository and upload the contents of this folder (the files inside `maharashtra-sir-helper`, not the parent folder).
2. Sign in at https://vercel.com and choose **Add New → Project**.
3. Import the GitHub repository. Vercel should detect Next.js automatically.
4. Keep the defaults: Build Command `npm run build`, Output Directory default, Install Command `npm install`.
5. Click **Deploy**. No environment variables are needed.
6. Open the generated Vercel URL on the phone. Add it to the home screen from the browser menu if convenient.

## Official resources
- ECI Voters' Service Portal: https://voters.eci.gov.in/
- Chhatrapati Sambhajinagar district SIR 2026 page: https://chhatrapatisambhajinagar.maharashtra.gov.in/en/special-intensive-revision-sir-2026/
- Chief Electoral Officer, Maharashtra: https://ceoelection.maharashtra.gov.in/

## Important
This is an independent organiser, not an official Election Commission application. It does not submit forms or verify voter eligibility. Current instructions, documents, deadlines, and decisions must come from the authorised election officer/supervisor and official portal. Do not use this app instead of the prescribed government app or register.
