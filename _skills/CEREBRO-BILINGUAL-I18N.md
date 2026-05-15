# CEREBRO BILINGUAL I18N SKILL

This skill defines how all Cerebro websites must handle Greek/English content.

---

## Core Rules

- Every visible text must exist in both Greek and English.
- Default language for the Cerebro official website is Greek.
- English must remain available through a language switcher.
- Language switcher format: **EL · EN**
- Desktop language switcher position: inside the nav, after Contact.
- Mobile language switcher position: inside the hamburger menu, at the bottom of the nav links.
- Do not use flags.
- Active language should be visually stronger; inactive language should be muted.
- Store selected language in `localStorage`.
- If no saved language exists, default to Greek.
- Provide fallback to English if a translation key is missing.

---

## Translation Quality Rules

- Greek must be natural, professional, premium, and suitable for Greek SMEs, doctors, clinics, hotels, and tourism businesses.
- Do NOT use literal Google Translate style.
- Translate with copywriting logic, not word-by-word.
- English must remain concise, premium, agency-style.
- Preserve the meaning and commercial intent of each section.
- Keep CTA text clear and action-oriented.

---

## Do Not Translate

The following must never be translated, transliterated, or altered:

- Cerebro
- Cerebro Software
- Invoice Sender
- Cerebro Mail Responder
- Mail Responder
- Product version names
- URLs
- Emails
- File names
- API names
- Code identifiers
- Environment variables
- Brand/domain names

---

## Implementation Rules

- Use a translation dictionary file, preferably `js/i18n.js` or `js/translations.js`.
- Use translation keys with `data-i18n` attributes on all translatable elements.
- Do not hardcode new visible text directly into HTML unless it also receives a translation key.
- Any new section or component must include both `el` and `en` translations before shipping.
- Preserve CSS classes, JS selectors, IDs, and animation hooks — do not alter them during i18n work.
- Never break `.hw` spans used for GSAP word reveal animations.
- Hero text may require special handling because of line breaks and `.hw` spans.
- If a hero headline needs different line breaks in Greek and English, implement language-specific line structure safely without breaking the animation system.
- Form labels, placeholders, buttons, success messages, error messages, and validation messages must also be translated.
- SEO/meta titles and descriptions should have Greek and English versions if implemented.
- Do not translate hidden technical attributes unless they are user-facing accessibility text.
- `aria-label` text should be translated when user-facing.

---

## Workflow

Before implementing i18n on any section or feature, follow these steps in order:

1. Audit all visible text — identify every string that a user can read.
2. Produce a grouped list of all extracted text by section.
3. Create or update the translation dictionary with `el` and `en` keys.
4. Add `data-i18n` keys to all relevant HTML elements.
5. Add or update the language switcher (desktop nav + mobile menu).
6. Add `localStorage` persistence logic.
7. Test Greek and English on desktop and mobile.
8. Report untranslated or missing keys.

---

## Required Report After Any i18n-Related Task

After completing any i18n task, provide a structured report covering:

| Item | Status |
|------|--------|
| New translation keys added | — |
| Greek copy added | — |
| English copy added | — |
| Hardcoded text check result | — |
| Desktop check | — |
| Mobile check | — |
| Missing translation keys | — |
