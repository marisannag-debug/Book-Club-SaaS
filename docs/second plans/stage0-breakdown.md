## Stage 0 — Rozbicie na zadania

### Synopsis
- Stage 0 dostarcza minimalny, end-to-end przepływ: załóż klub → zaproś członków → stwórz głosowanie → publiczny link do głosowania (anonimowe głosy) → proste wyniki → prosty czat → lista spotkań. Implementacja frontend: React + Next.js + shadcn UI; API: Next.js API Routes; DB: Supabase/Postgres.

---

## Zadania (1–11)

### 1) Scaffold projektu i podstawowe konfiguracje
- Cel: Utworzyć bazowy projekt Next.js z Tailwind, shadcn UI i konfiguracją lint/format.
- Deliverables:
  - `package.json`, `next.config.js`, `tailwind.config.js`
  - `pages/_app.tsx`, `pages/index.tsx` (landing placeholder)
  - `components/ui/*` (shadcn wrappery), `styles/globals.css`
  - `/.eslintrc.json`, `/.prettierrc`
- shadcn components: konfiguracja wrapperów (przygotować `components/ui/*`).
- TS types / SQL: brak.
- API payloads: brak.
- Acceptance criteria:
  - `npm run dev` startuje bez błędów.
  - `npm run lint` i `npm run format` działają.
- Testy: prosty unit smoke test, E2E: odwiedź `/` → oczekuj status 200.
- Edge cases: brak.
- PR granularity: jeden PR. PR title: "chore: init nextjs + tailwind + shadcn".

---

### 2) DB schema: tabele core (clubs, members, book_proposals, votes, meetings, messages)
- Cel: Dodać minimalny schemat Postgres do użycia w Supabase.
- Deliverables:
  - `db/migrations/001_create_core_tables.sql`
  - `lib/db.ts` (DB client wrapper / supabase helper)
- SQL (create):
  - `CREATE TABLE clubs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, description text, organizer_id uuid, invite_code text, created_at timestamptz DEFAULT now());`
  - `CREATE TABLE members (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), club_id uuid REFERENCES clubs(id), name text, email text, invite_token text, invite_status text DEFAULT 'pending', joined_at timestamptz DEFAULT now());`
  - `CREATE TABLE book_proposals (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), club_id uuid REFERENCES clubs(id), title text NOT NULL, author text, description text, proposer_id uuid, created_at timestamptz DEFAULT now());`
  - `CREATE TABLE votes (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), proposal_id uuid REFERENCES book_proposals(id), voter_token text, choice text CHECK (choice IN ('yes','no','abstain')), created_at timestamptz DEFAULT now());`
  - `CREATE TABLE meetings (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), club_id uuid REFERENCES clubs(id), title text, datetime timestamptz, location text, created_at timestamptz DEFAULT now());`
  - `CREATE TABLE messages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), club_id uuid REFERENCES clubs(id), author_name text, content text, created_at timestamptz DEFAULT now());`
- Acceptance criteria:
  - Migracja uruchamia się lokalnie i tabele są dostępne.
- Testy: migration smoke test (connect & check tables exist).
- Edge cases: upewnić się, że `pgcrypto` lub `uuid-ossp` jest dostępne; jeśli nie, użyć `uuid_generate_v4()`.
- PR granularity: migration + db helper in one PR. PR title: "db: add core tables migration".

---

### 3) API: Clubs CRUD + create club page
- Cel: Dodać API i stronę tworzenia klubu.
- Deliverables:
  - `pages/app/clubs/new.tsx` (form)
  - `pages/app/dashboard.tsx` (placeholder)
  - `pages/api/clubs/index.ts` (POST create, GET list)
  - `pages/api/clubs/[id].ts` (GET club)
  - `lib/validators/club.ts` (zod schema)
- shadcn components: `Input`, `Textarea`, `Button`, `Card`, `Toast`.
- TS types:
  - ```ts
    type Club = { id: string; name: string; description?: string; organizerId?: string; inviteCode?: string }
    ```
- API request/response:
  - POST `/api/clubs` body: `{ "name": "Moje Club", "description": "opis" }`
  - Response: `{ "id": "uuid", "inviteCode": "abc123" }`
- Acceptance criteria:
  - Submit form tworzy klub bez pełnego reloadu i redirectuje do `/app/clubs/[id]`.
  - API zwraca `201` i payload z `id`.
- Testy:
  - Unit: `ClubForm` validation.
  - Integration: POST create club writes to DB (test DB).
  - E2E: odwiedź `/app/clubs/new` → wypełnij form → kliknij "Utwórz" → oczekuj redirect do `/app/clubs/:id`.
- Edge cases: walidacja po stronie serwera i klienta.
- PR granularity: split API ("api: clubs create endpoint") and UI ("feat: create-club page").

---

### 4) API + feature: Invite link (public join) i members list
- Cel: Wygenerować invite link i umożliwić dołączenie bez konta (minimal profile).
- Deliverables:
  - `pages/api/clubs/[id]/invite.ts` (POST generate invite token / public link)
  - `pages/api/clubs/[id]/members/index.ts` (GET list, POST join via token)
  - `pages/app/clubs/[clubId]/members.tsx` (members UI)
  - `pages/clubs/join/[inviteToken].tsx` (public join route)
- shadcn components: `Dialog`, `Input`, `Button`, `Table`, `Toast`, `Avatar`.
- TS types / SQL:
  - ALTER: `ALTER TABLE members ADD COLUMN invite_token text;`
- API request/response:
  - POST `/api/clubs/:id/invite` -> `{ "inviteToken": "xyz" , "link": "https://app/.../clubs/join/xyz" }`
  - POST `/api/clubs/:id/members` body `{ "inviteToken":"xyz", "name":"Jan" }` -> response `{ "member": { ... } }`
- Acceptance criteria:
  - Generowany link pozwala dołączyć (public route) i zapisuje membera w DB.
  - Members page pokazuje nowych członków.
- Tests:
  - Integration: create invite -> join with token -> member exists in DB.
  - E2E: generate invite -> open incognito link -> submit name -> member appears in members list.
- Edge cases: token expiry/revoke; mitigation: add `invite_expires_at` and revoke endpoint.
- PR granularity: API and UI separate PRs recommended.

---

### 5) API + feature: Create book proposal + voting endpoint
- Cel: Umożliwić dodawanie propozycji książek i tworzenie głosowania publicznego.
- Deliverables:
  - `pages/api/clubs/[id]/book_proposals.ts` (POST proposal)
  - `pages/api/clubs/[id]/votes.ts` (POST create vote / GET votes for proposal)
  - `pages/app/clubs/[clubId]/votes/new.tsx` (UI form)
  - `lib/validators/vote.ts`
- shadcn components: `Input`, `Textarea`, `RadioGroup`, `Button`, `Card`, `Toast`.
- TS types:
  - ```ts
    type BookProposal = { id:string; clubId:string; title:string; author?:string }
    type Vote = { id:string; proposalId:string; voterToken?:string; choice:'yes'|'no'|'abstain' }
    ```
- API payloads:
  - POST `/api/clubs/:id/book_proposals` `{ "title":"Lalka","author":"Prus" }` -> returns proposal
  - POST `/api/clubs/:id/votes` `{ "proposalId":"uuid" }` -> returns `{ "voteId":"uuid", "publicLink":"/clubs/:id/votes/:voteId" }`
- Acceptance criteria:
  - Organizator dodaje propozycję i tworzy głosowanie; public link dostępny.
- Tests:
  - Integration: create proposal -> create vote -> DB rows present.
  - E2E: create proposal -> create vote -> public link exists.
- Edge cases: validation; mitigation: zod schemas.
- PR granularity: API + UI separate.

---

### 6) Public vote page: allow anonymous voting (no auth)
- Cel: Publiczny widok głosowania, anonimowy głos i aktualizacja wyników (SWR/polling).
- Deliverables:
  - `pages/clubs/[clubId]/votes/[voteId].tsx`
  - `pages/api/clubs/[id]/votes/[voteId]/cast.ts` (POST cast vote)
  - `components/VoteResults.tsx`
- shadcn components: `RadioGroup`, `Button`, `Toast`, `Card`.
- API payloads:
  - POST cast: `{ "voteId":"uuid","choice":"yes" }` -> `{ "status":"ok","totals":{"yes":2,"no":1,"abstain":0} }`
- Acceptance criteria:
  - Anonimowy użytkownik może oddać głos bez loginu.
  - Po oddaniu głosu licznik aktualizuje się bez przeładowania.
- Tests:
  - Integration: POST cast -> DB increment.
  - E2E: incognito open -> select -> submit -> totals updated.
- Edge cases: spam -> rate-limit by IP; future: voter_token/email verification.
- PR granularity: one PR.

---

### 7) Simple chat/messages (club-level)
- Cel: Prosty append-only chat dla klubu.
- Deliverables:
  - `pages/api/clubs/[id]/messages.ts` (GET, POST)
  - `components/MessageList.tsx`, `components/MessageForm.tsx`
  - `pages/app/clubs/[clubId]/index.tsx` (messages section)
- shadcn components: `Textarea`, `Button`, `Card`, `Avatar`, `Toast`.
- API payloads:
  - POST `{ "authorName":"Ewa","content":"..." }` -> message
  - GET -> array messages
- Acceptance criteria:
  - Wysłanie wiadomości pokazuje ją w UI bez reloadu (optimistic update).
  - Messages stored in DB.
- Tests: unit + integration + E2E send message -> visible.
- Edge cases: XSS -> sanitize/escape; length limit.
- PR granularity: API+UI single PR.

---

### 8) Meetings: add meeting list and create meeting
- Cel: Tworzenie i listowanie spotkań (bez recurring).
- Deliverables:
  - `pages/api/clubs/[id]/meetings.ts` (GET, POST)
  - `pages/app/clubs/[clubId]/meetings.tsx`
  - `components/DatePicker.tsx` (Popover+Calendar)
- shadcn components: `Popover`, `Calendar`, `Input`, `Button`, `Badge`.
- API payloads:
  - POST `{ "title":"Spotkanie","datetime":"2026-03-30T18:00:00Z","location":"Biblioteka" }` -> meeting
- Acceptance criteria:
  - Meeting zapisany w DB, widoczny w listach klubu.
  - Datetime stored as UTC.
- Tests: unit date util, integration create meeting, E2E create -> list.
- Edge cases: timezone display -> store UTC, display localized.
- PR granularity: API + UI separate.

---

### 9) Dashboard organizatora (podsumowanie)
- Cel: Agregacja: members count, 3 nearest meetings, active votes.
- Deliverables:
  - `pages/app/dashboard.tsx`
  - `components/DashboardCards.tsx`, `components/SmallList.tsx`
- shadcn components: `Card`, `Table`, `Badge`, `Avatar`.
- Acceptance criteria:
  - Dashboard pokazuje wymagane dane bez reloadu (SWR).
- Tests: unit render + E2E verifying sample data.
- PR granularity: single PR.

---

### 10) Tests: E2E suite + CI config
- Cel: Dodać 3 krytyczne E2E scenariusze i CI job skeleton.
- Deliverables:
  - `cypress/` lub `tests/playwright/` z testami:
    - create club flow
    - create vote + public cast
    - invite + join
  - `.github/workflows/e2e.yml`
- Acceptance criteria:
  - Tests uruchamiają się w CI i lokalnie (test DB reset).
- Edge cases: flaky tests -> stabilize selectors.
- PR granularity: separate PR.

---

### 11) QA checklist + docs
- Cel: Dodać `docs/qa-stage0.md`, zaktualizować `README.md` i `.env.example`.
- Deliverables:
  - `docs/qa-stage0.md`
  - `README.md` (dev instructions)
  - `.env.example`
- Acceptance criteria:
  - QA checklist zawiera manualne kroki i kryteria akceptacji.
- PR granularity: docs PR.

---

## Dependencies
- 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11

## Local dev checklist
```bash
npm install
cp .env.example .env.local
# required env vars (no secret values here):
# DATABASE_URL, NEXT_PUBLIC_APP_URL, SUPABASE_URL, SUPABASE_KEY, RESEND_API_KEY (opcjonalnie)
npm run dev
npm run lint
npm run format
npm run test
# e2e (example):
npm run cy:open
```

## Issue template (skopiuj do `.github/ISSUE_TEMPLATE/feature.md`)
```md
---
name: Feature
about: New feature
---

## Tytuł
Krótki tytuł feature

## Opis
Co robi feature i dlaczego

## Kryteria akceptacji
- [ ] Kryterium 1 (testowalne)
- [ ] Kryterium 2

## Kroki testowe (manualne)
1. Odwiedź `/app/clubs/new`
2. Wypełnij formę
3. Kliknij "Utwórz" i oczekuj redirectu

## Zależności
- #numer_innego_issue

## Pliki powiązane
- `pages/api/clubs/index.ts`
- `pages/app/clubs/new.tsx`

```

## E2E przykładowe scenariusze (skrót)
- Create club → odwiedź `/app/clubs/new` → wypełnij `name` → kliknij `Utwórz` → oczekuj redirect do `/app/clubs/:id`.
- Create vote & public cast → jako organizer: stwórz proposal i vote; otwórz public link w incognito → wybierz opcję → submit → sprawdź totals.
- Invite & join → generuj invite → odwiedź link incognito → wpisz name → dołącz → sprawdź members list.

## Co zrobić następnie
1. Rozbić tasky 3–9 na GitHub Issues zgodnie z PR granularity.
2. Uruchomić migracje lokalnie i zweryfikować połączenie z Supabase test DB.
3. Rozpocząć implementację tasków 2 i 3 równolegle (migracje + clubs API).
