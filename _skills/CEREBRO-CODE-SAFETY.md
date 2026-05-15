# CEREBRO CODE SAFETY SKILL

This skill defines safety rules for all Cerebro development.

---

## Git Safety

- Always run `git status` before major changes.
- Do not work directly on production/master for risky features.
- Create a branch for major features.
- Commit a safe checkpoint before refactors.
- Do not commit before user review unless explicitly asked.
- Do not push to production unless explicitly asked.
- Never merge to master without confirmation.
- If there are conflicts, stop and ask.
- After changes, summarize changed files.
- For production deploys, confirm branch and deployment target before proceeding.

---

## Secrets Safety

- Never commit API keys.
- Never commit `.env` files.
- Never commit `resend API key.txt`.
- Never expose `RESEND_API_KEY`.
- Environment variables must live only in Vercel settings or local `.env` files ignored by git.
- Check `git status` before staging any files.
- Stage only the intended files — never use blind `git add .` without reviewing the output.
- If a secret is accidentally committed, immediately tell the user to rotate the key.

---

## File Safety

- Do not modify unrelated files.
- Do not touch footer, contact, products, or services sections unless the task explicitly asks for it.
- Do not change desktop layout when asked for mobile-only fixes.
- Do not change mobile layout when asked for desktop-only fixes.
- Preserve CSS classes, IDs, JS selectors, and animation hooks.
- Preserve `.hw` spans unless intentionally updating hero text structure.
- Do not remove code unless confirmed unused.
- For cleanup tasks, audit first, then ask the user before deleting anything.

---

## Implementation Safety

- Prefer small, scoped changes over large rewrites.
- Avoid repeated contradictory override blocks in CSS.
- Keep final CSS clean and easy to reason about.
- Do not add duplicate mobile hero blocks.
- Do not hardcode new visible text without i18n keys.
- Do not introduce new dependencies unless necessary and approved.
- Keep the current stack: Vanilla HTML/CSS/JS unless the user approves a different approach.
- For Vercel/serverless code, do not change API functions unless explicitly requested.

---

## Testing Safety

After any change, report what needs to be tested. Minimum testing requirements by task type:

| Task type | What to test |
|-----------|-------------|
| Visual changes | Desktop and mobile |
| i18n changes | Greek and English |
| Form changes | Success state and error state |
| Deployment | Vercel status is Ready, no function errors |

---

## Required Final Report After Any Task

After completing any task, provide a structured report covering:

| Item | Detail |
|------|--------|
| Branch name | — |
| Files changed | — |
| What changed | — |
| What was not changed | — |
| Secrets avoided | — |
| Commit made | — |
| Push/deploy made | — |
| Suggested next test steps | — |
