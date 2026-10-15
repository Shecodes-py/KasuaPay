# KasuaPay Students

A responsive, browser-local budgeting MVP for Nigerian students. Uses plain HTML, CSS, JavaScript and Node.js 22. No package installation is required.

Run `npm start` and open http://127.0.0.1:3000. Run `npm test` for the financial calculation and app flow checks, and `npm run build` to check the application JavaScript. The static files are already in `dist/`; the build command does not generate or overwrite them.

Includes student profile, recorded income, editable category budgets, savings goals and contributions, expense tracking, transaction search/filter, CSV export, and a daily safe-to-spend estimate. Start with your own information; no sample financial records are preloaded.

Data stays in localStorage in the current browser and origin. It does not sync across devices and can be lost when browser data is cleared. No bank connection, account authentication, payments, custody, automatic transaction imports, or actual money transfers are implemented. Savings contributions are planning entries.

Safe to spend equals recorded income minus recorded expenses, savings contributions, and the remaining emergency allocation, divided by days until the next income date (at least one). Future income is not assumed. Budgets currently cover all recorded spending in one ongoing plan; automatic recurring periods and goal withdrawals are future work.

Source files are in `dist/` and can be served as a static website. `server.cjs` provides a local preview only. Google Fonts is optional; system fonts are used if unavailable.

## Push to GitHub

Create an empty repository in your GitHub account. Leave the options to add a README, license, and gitignore unchecked because this project already has files and Git history. Choose the repository visibility you want.

Run the following in PowerShell. Replace `YOUR-USERNAME` and the repository name with the URL of your new repository:

```powershell
Set-Location -LiteralPath 'C:\Users\USER\Documents\Kasua-pay'
npm test
npm run build
git add .
git commit -m "Prepare KasuaPay for GitHub and Vercel"
git remote add origin https://github.com/YOUR-USERNAME/kasuapay-students.git
git push -u origin main
```

The repository is already initialized on `main`. If `origin` is configured later, inspect it with `git remote -v` before using `git remote set-url origin YOUR-REPOSITORY-URL`. GitHub may ask you to sign in through Git Credential Manager. Do not put an access token into a remote URL or commit it to a file.

`.github/workflows/checks.yml` runs the tests and JavaScript checks on pushes and pull requests. No GitHub Actions secrets are needed. The existing local `.openai/` hosting metadata is excluded from new commits; it is unrelated to Vercel.

## Deploy on Vercel

1. Sign in to Vercel and choose **Add New → Project**.
2. Connect GitHub if prompted and import the repository you pushed.
3. Keep the root directory at the repository root. The checked-in `vercel.json` configures Framework Preset **Other**, Build Command **npm run build**, Output Directory **dist**, and skips dependency installation.
4. No environment variables are required. Deploy the project.
5. Open the deployment URL, add a test allowance, create a budget and savings goal, then refresh to confirm that entries persist in that browser. Check the layout on your phone too.

Vercel serves only the `dist/` files. It does not run `npm start` or the local Node server. Navigation uses URL hashes such as `/#goals`, so no SPA rewrite rule is needed. With the GitHub integration, subsequent pushes trigger deployments according to the project's branch settings.

Official configuration reference: https://vercel.com/docs/project-configuration/vercel-json

Your hosted app starts with separate browser data from localhost. Preview URLs, the production URL, and any custom domain each have separate localStorage. This MVP has no server-side accounts or shared database. Export any local transactions you want to retain before clearing browser data; the current CSV export is not a complete backup of budgets and savings goals.
