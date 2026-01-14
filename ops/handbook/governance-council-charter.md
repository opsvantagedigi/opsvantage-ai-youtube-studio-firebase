Governance Council Charter

Purpose
The Governance Council provides oversight for database stewardship, migration policy, emergency rollbacks, and long‑term schema strategy. The Council ensures the OpsVantage doctrine is upheld and evolves conservatively.

Membership
- Size: 3–7 members.
- Composition: Senior engineer(s), a data steward (owner of migrations), and a product or operations representative.
- Term: 6 months, staggered to preserve continuity.

Authority
- Approve high‑risk migrations (those affecting production data, large schema reshapes, or destructive changes).
- Require pre‑migration audits and backups for production work.
- Authorize emergency rollbacks and coordinate restore operations.
- Amend rituals and the stewardship charter by 2/3 majority vote.

Responsibilities
- Review and approve migration proposals flagged as high‑risk.
- Maintain an Ops Log recording migration approvals, test results, incidents, and post‑migration validation outcomes.
- Convene within 24 hours of any production incident affecting data integrity.
- Run quarterly audits of schema drift, unused columns, and enum health.

Meetings and Process
- Regular cadence: bi‑weekly sync (30 minutes). Cadence may increase during active migration windows.
- Ad‑hoc: emergency meetings may be called by any member; quorum is majority.
- Decisions: recorded in the Ops Log with rationale, vote tally, and next steps.

Escalation Path
- If Council consensus cannot be reached, escalate to the founder or designated executive (single arbitrator) for final decision.

Amendments
- Charter changes require a formal proposal, public comment window (48 hours), and a 2/3 Council majority.

Transparency and Records
- All Council votes, minutes, and Ops Log entries are stored in the repository under `ops/logs/` and must be retained for at least 2 years.

Adoption
- This charter becomes effective upon majority signature of the inaugural Council members.
