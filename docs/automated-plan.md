# Automated plan architecture

The existing app remains plain HTML, CSS and JavaScript. The existing manual workspace and its `kasuapay-v1` records are preserved. There is no production backend or authentication to replace. The new automatic plan is the default route for a fresh URL, with separate guest and demo data.

## Business logic and persistence

`dist/allocation.js` is a reusable, pure transaction service. Every operation returns a new state rather than mutating the original. Money is represented as integer kobo. Decimal input is parsed as text before conversion, and proportional allocations use BigInt intermediate multiplication and largest-remainder rounding. Essential categories are funded first; nonessential categories follow. Extra income remains unallocated. Savings cannot be spent through the expense service. Emergency money remains an explicit reserve category and can fund emergency expenses.

Income and expense references are unique within each plan. Replaying a matching reference returns the existing state. A conflicting payload is rejected. An income record contains the category allocations and a snapshot of the rules used at the time, so editing future rules does not change earlier balances. Expenses debit one category only. Balances are derived from the immutable records, rather than independently edited totals. Failed UI actions are recorded separately without changing balances.

`dist/smart-ui.js` handles forms, accessible feedback and browser persistence. The guest key is `kasuapay-smart-guest-v1`; the demo key is `kasuapay-smart-demo-v1`. `kasuapay-smart-mode` remembers the selected workspace. Reset demo replaces only demo state. No local user data is uploaded. A storage failure is reported and an allowance is not shown as successfully processed if it could not be saved.

This is a single-browser demonstration, not a financial ledger suitable for production. Browser storage is user-editable and has no server transaction guarantees or cross-device synchronization. A production service must enforce idempotency, authorization, concurrency control and atomic ledger entries in a database. The guest, demo and manual workspaces intentionally do not share balances.

## Recurring expenses

Each subscription stores the provider/network preference, plan, amount, next date, monthly maximum, category and renewal condition. A date condition permits an explicit simulation on or after its due date. A depletion condition requires the user's manual confirmation. Renewals check the category balance and calendar-month limit, record an expense, and move the next date forward by one month, clamping month-end dates safely. No scheduler, network-depletion detector or actual payment API is present.

Category budgets carry forward until new income arrives or demo state is reset. The displayed remaining plan balance includes savings and emergency reserves; it is not labelled safe-to-spend. Subscription and card monthly spending limits reset by the dates of their transactions. No balance is silently deleted at a calendar-month boundary.

## Accountability

The nominee is simulated, with four independent read-only sharing flags: totals, categories, milestones and spending alerts. `partnerView` constructs only the permitted financial fields. The UI shows that result separately from the owner's settings. Nothing is sent externally. No withdrawal, transfer or settings-write capability exists for the partner.

A future real invitation requires authenticated accounts, an expiring single-use invitation, explicit acceptance, server-side authorization on every summary read, permission revocation and an audit trail. Client-side hiding alone must never be used as a real access-control boundary.

## Card provider boundary

`dist/card-provider.js` exports a simulated provider with `describe(state)` and `purchase(state, input)` operations. Purchases use the same expense ledger and the linked category, preventing a second wallet from inventing funds. The simulator enforces active/frozen status and monthly card limits. It exposes no card numbers, CVVs or credentials.

BMoney is only a potential partner named in the product brief. No verified API documentation or credentials were supplied. The UI is a concept simulation and makes no claim about BMoney's card issuance, wallets, webhooks or public API capabilities.

Any authorized real provider should be integrated through a backend adapter, with secrets confined to that backend, verified provider callbacks, unique provider references, consent and reconciliation. Card tokens or masked display data should follow the verified provider contract; sensitive payment credentials must not be stored in browser localStorage. Replacing the simulator is not sufficient by itself to enable real payments.

## Demo walkthrough

1. Open `/#smart` without logging in.
2. Select **₦100,000 student demo**. This loads preset rules, a demo subscription and a demo sibling, with no money received yet.
3. Review or edit the future rules.
4. Click **Simulate Incoming Allowance**. Food gets ₦30,000, Transport ₦15,000, Data ₦10,000, Savings ₦20,000, Emergency ₦10,000 and Flexible ₦15,000.
5. Open the Campus data renewal, indicate that data has finished, and simulate its ₦2,500 renewal. Data falls to ₦7,500. The expense appears in the ledger.
6. Inspect Accountability, change sharing permissions and preview the permitted summaries.
7. Open BMoney concept, freeze/unfreeze the demo card, change its category/limit, and simulate a purchase. The linked budget and transaction history update.
8. Inspect the allocation ledger, including failed attempts and saved rule snapshots.
9. Refresh to verify persistence. Use **Reset demo** to start over without affecting guest or manual records.

Run `npm test` and `npm run build`. The build validates every browser script and its referenced local JS/CSS assets without adding a framework or dependency. Vercel continues to serve `dist/`.
