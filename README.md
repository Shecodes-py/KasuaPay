# KasuaPay Students

A responsive, browser-local budgeting MVP for Nigerian students. No package installation is required.

Run `npm start` and open http://127.0.0.1:3000. Run `npm test` for the financial calculation checks.

Includes student profile, recorded income, editable category budgets, savings goals and contributions, expense tracking, transaction search/filter, CSV export, and a daily safe-to-spend estimate. Start with your own information; no sample financial records are preloaded.

Data stays in localStorage in the current browser and origin. It does not sync across devices and can be lost when browser data is cleared. No bank connection, account authentication, payments, custody, automatic transaction imports, or actual money transfers are implemented. Savings contributions are planning entries.

Safe to spend equals recorded income minus recorded expenses, savings contributions, and the remaining emergency allocation, divided by days until the next income date (at least one). Future income is not assumed. Budgets currently cover all recorded spending in one ongoing plan; automatic recurring periods and goal withdrawals are future work.

Source files are in `dist/` and can be served as a static website. `server.cjs` provides a local preview only. Google Fonts is optional; system fonts are used if unavailable.
