# PR: Wdrożenie UI (Stage 0 — zadania 1–3) — postęp

Branch: `db/core-tables-migration` → Target: `main`

## Tytuł PR
feat(ui): implement Club creation UI + API + validators + tests

## Krótki opis
Ten PR zawiera dotychczasowe prace nad wdrożeniem UI związanego z Stage 0 (zadania 1–3):
- shared validator (z bezpiecznym fallbackem),
- generator `inviteCode`,
- implementacja API `/api/clubs` (GET/POST) i `/api/clubs/[id]`,
- komponenty UI (shadcn wrappers istniejące + `ClubForm`),
- strona `pages/app/clubs/new.tsx` i placeholder dashboard,
- podstawowe unit tests (validator + invite),
- docker-compose + `.env.postgres` do lokalnego test DB,
- prosty fallback walidatora aby umożliwić lokalne uruchomienie bez zod.

## Zmiany (najważniejsze pliki)
- docs/second plans/03-5-ui.md — plan wdrożenia UI (opis + backlog)
- docs/second plans/ui-implementation-plan-stage0-1-3.md — rozszerzony plan
- pages/api/clubs/index.ts — GET list, POST create
- pages/api/clubs/[id].ts — GET by id
- lib/validators/club.js — zod usage + fallback safeParse
- lib/utils/invite.js — generateInviteCode
- components/clubs/ClubForm.tsx — react-hook-form form
- pages/app/clubs/new.tsx — page using ClubForm
- pages/app/dashboard.tsx — placeholder (fixed imports)
- components/ui/* — UI wrappers already present (Input, Button, Card, Toast, etc.)
- docker-compose.yml, .env.postgres — local Postgres setup
- tests/unit/validator.test.js, tests/unit/invite.test.js — unit tests

Pełna lista plików zmodyfikowanych/dodanych jest dostępna w commicie na branchu.

## Co zostało przetestowane lokalnie
- `npm run test:unit` — validator + invite tests passed.
- Local Postgres via `docker compose up -d` started successfully.
- `npm run test:db` wymaga `DATABASE_URL` w środowisku; po ustawieniu testy integracyjne przechodzą (smoketest + integration).
- Dev server uruchomiony i strony:
  - `/app/clubs/new` — renderuje i działa formularz (client validation + POST to API)
  - `/app/dashboard` — renderuje placeholder

## Instrukcja uruchomienia lokalnie (quickstart)
1. Skopiuj env: `cp .env.postgres .env.local`
2. Start DB: `docker compose up -d`
3. Install: `npm install`
4. Dev server: `npm run dev`
5. Run tests:
   - unit: `npm run test:unit`
   - integration: `npm run test:db` (wymaga `DATABASE_URL` w środowisku — np. z `.env.local`)

## Checklist (reviewers)
- [ ] Migracje / DB: `db/migrations/001_create_core_tables.sql` działa lokalnie.
- [ ] API: POST `/api/clubs` zwraca 201 i `{ id, inviteCode }`.
- [ ] UI: `/app/clubs/new` waliduje i redirectuje do `/app/clubs/:id`.
- [ ] Unit tests: uruchamiają się i przechodzą.
- [ ] E2E: (opcjonalnie) dodać test Cypress dla create‑club flow.

## Znane ograniczenia / decyzje tymczasowe
- Usunięto zależność `zod` z `package.json` i zastosowano fallback validator, żeby umożliwić łatwe lokalne uruchomienie. Zalecane: przywrócić `zod` w stabilnej wersji w następnym PR.
- `ClubForm` używa prostego react-hook-form validation — docelowo podłączyć `zod` resolver po zainstalowaniu.

## Kroki do merge (sugestia)
1. Dodać integration tests dla API (jeśli brak) i uruchomić na CI z migracjami.
2. Przywrócić `zod` w `package.json` (wersja publikowana) i zaktualizować client resolver.
3. Dodać E2E Cypress test tworzenia klubu.

## Proponowany opis PR dla reviewera
Implementuje podstawowy flow tworzenia klubu: backend endpointy, validator (z fallbackiem), generator inviteCode, formularz i stronę tworzenia klubu. Zawiera też podstawowe unit tests i konfig dla lokalnego Postgresa (docker-compose). Cel: umożliwić szybkie dalsze rozszerzenia (invite, members, proposals/votes).

---

Jeśli potwierdzasz, mogę również:
- automatycznie otworzyć PR na GitHub (jeśli masz token/połączenie), lub
- utworzyć dodatkowy plik `PR_CHECKLIST.md` z krokami do merge.
