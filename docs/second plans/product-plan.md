**Plan działania — BookClub Pro (React / Next.js / shadcn UI)**

Wstęp
- Źródła: materiały w folderze docs/first plans użyte jako podstawa decyzji produktowych.
- Technologie: frontend w React.js + Next.js; UI: komponenty shadcn UI.
- Zakres: brak implementacji auth/registration/payments — zamiast tego punkty integracyjne/adapters.

Struktura dokumentu: etapowy plan (Stage 0 — MVP, Stage 1, Stage 2, ...). Każdy etap — jedna nowa funkcja + testy i kryteria akceptacji.

**Stage 0 — MVP (Minimalna baza)**
- Cel: dostarczyć najprostszy, end-to-end działający przepływ: załóż klub → zaproś członków → stwórz głosowanie → zobacz wyniki → prosty czat → harmonogram spotkań.

Nowa funkcja: Core club management i prosty voting flow (publiczne głosowanie bez logowania).

Deliverables:
- Next.js routes/pages (przykładowe ścieżki):
  - `/` — landing / marketing
  - `/app/dashboard` — dashboard organizatora
  - `/app/clubs/new` — tworzenie klubu
  - `/app/clubs/[clubId]` — widok klubu
  - `/app/clubs/[clubId]/votes/new` — tworzenie głosowania
  - `/app/clubs/[clubId]/votes/[voteId]` — publiczny link do głosowania
  - `/api/clubs` (GET, POST), `/api/clubs/[id]`, `/api/clubs/[id]/members`, `/api/clubs/[id]/votes`, `/api/clubs/[id]/meetings`, `/api/clubs/[id]/messages`

- shadcn UI components: `Button`, `Input`, `Textarea`, `Card`, `Avatar`, `Dialog`, `Toast`, `Table`, `Badge`, `Label`, `Checkbox`, `RadioGroup`, `Calendar/DatePicker (Popover+Calendar)`.
- Stan/aplikacja: React Context dla `CurrentClubContext` + SWR (fetcher) do pobierania zasobów; krótkie mutacje POST/PUT z optimistic UI.
- Modele danych (przykładowe typy TypeScript):
  - Club { id, name, description, organizerId, inviteCode }
  - Member { id, clubId, name?, email?, joinedAt }
  - BookProposal { id, clubId, title, author, description?, proposerId, createdAt }
  - Vote { id, proposalId, voterId?, choice: 'yes'|'no'|'abstain', createdAt }
  - Meeting { id, clubId, title, datetime, location?, bookId?, createdAt }
  - Message { id, clubId, authorId?, authorName?, content, createdAt }
- Przykładowe API endpoints: jak powyżej; dodatkowo adapter endpoints dla zewnętrznych usług:
  - `/api/integrations/auth-callback` — punkt integracji auth (placeholder)
  - `/api/integrations/billing-webhook` — punkt integracji płatności (placeholder)

UI/UX:
- Layout: główny layout `AppShell` (shadcn `Sidebar` + `Topbar`). Na mobilne: kolumna nawigacji + główny content.
- Priorytetowe widoki: Dashboard organizatora, Widok klubu (votes | meetings | members | chat), Publiczny widok głosowania.
- Accessibility: używać semantic HTML, aria labels dla `Dialog`/`Toast`, keyboard focus dla form.

Acceptance criteria:
- Organizator może utworzyć klub i otrzymać unikalny link zaproszenia.
- Organizator może stworzyć głosowanie i otrzymać publiczny link; anonimowy użytkownik może oddać głos bez logowania.
- Wyniki głosowania aktualizują się i są widoczne organizatorowi.
- Możliwość wysłania prostego emaila (placeholder integracji) przy nowym głosowaniu.

Testy:
- Jednostkowe: komponent `VoteForm` (walidacja pól), `ClubCard` render.
- Integracyjne: flow tworzenia klubu → dodanie propozycji → oddanie głosu → odczyt wyników (test API routes z in-memory DB / test DB).
- E2E: Cypress/Playwright scenariusz: zakładanie klubu → kopiowanie linku → oddanie głosu jako anonim → sprawdzenie wyników.
- Manualne kroki QA: załóż klub, stwórz głosowanie, udostępnij link, oddaj głos z innej przeglądarki, sprawdź email placeholder.

Edge cases i ryzyka:
- Problem: spamowe głosowania przez publiczny link → mitigacja: rate-limit API i optionalne CAPTCHA (v1: limit per IP + inviteCode requirement optional).
- Brak auth dla votujących → ryzyko manipulacji; mitigacja: w MVP zaakceptować anonimowe głosy, monitorować nadużycia, plan na voty z email w v2.
- Offline / sieć: użyć optimistic updates i rollback w przypadku błędu.

Propozycja commit/PR granularity:
- Jeden PR = jedna feature user-facing (np. "Add create-club page + API").
- Mniejsze PRy: UI only / API only / Tests only.

PR checklist (co sprawdzić przed mergem):
- Lints i format (Prettier, ESLint) green.
- Unit tests pass.
- Komponenty responsywne (desktop + mobile basic).
- Accessibility basic checks (aria labels present).
- Env-keys not leaked.

Minimalne wymagania lokalne:
```bash
npm install
cp .env.example .env.local # uzupełnić: DATABASE_URL, RESEND_API_KEY, NEXT_PUBLIC_APP_URL
npm run dev
```

---

**Stage 1 — Zaproszenia i zarządzanie członkami (one feature)**
- Cel: Usprawnić onboarding i zarządzanie członkami (link-invite + email invites + lista członków).

Nowa funkcja: Invite flow + member management.

Deliverables:
- Routes: `/app/clubs/[clubId]/members`, API: `POST /api/clubs/[id]/invite`, `GET /api/clubs/[id]/members`, `DELETE /api/clubs/[id]/members/[memberId]`.
- shadcn components: `Dialog` (invite modal), `Input`, `Table` (lista członków), `Toast`.
- State: użyć React Context + SWR cache invalidation po zaproszeniu.
- Data model: Member rozszerzony o `inviteStatus`, `inviteToken`.

UI/UX:
- Invite modal z polem email i opcją generowania publicznego linku.
- Lista członków z filtrami i przyciskiem do kopii linku.

Acceptance criteria:
- Można dodać email do wysyłki zaproszenia (email wysyłany przez integrację - w MVP logowany jako placeholder jeśli brak klucza).
- Publiczny link działa i dodaje nowego członka z minimalnym profilem.

Testy:
- Unit: invite modal validation.
- Integration: API invite tworzy `inviteToken` i zapisuje `inviteStatus`.
- E2E: wysłanie invite linku i dołączenie jako nowy członek.

Edge cases i ryzyka:
- Niewłaściwe emaile → walidacja, bounce handling w integracji e-mail.
- Nadużycie linków → możliwość unieważnienia invite tokens (revoke endpoint).

PR granularity i checklist: UI+API w oddzielnych PR, tests included.

Migration: dodanie pól `inviteToken` i `inviteStatus` do tabeli `members`.

---

**Stage 2 — Harmonogram i przypomnienia (one feature)**
- Cel: Dodać calendar view meetings + przypomnienia email.

Nowa funkcja: Meetings calendar + scheduled reminders.

Deliverables:
- Routes: `/app/clubs/[clubId]/meetings`, API `POST /api/clubs/[id]/meetings`, `POST /api/clubs/[id]/meetings/[meetingId]/remind`.
- shadcn components: `Calendar` (Popover + Calendar), `DatePicker`, `Badge` for upcoming events.
- Background: jobs (serverless cron / edge function) placeholder for scheduled reminders; webhook endpoint for external scheduler.

Acceptance criteria:
- Tworzenie spotkania zapisuje meeting z datą; organizator może wysłać natychmiastowe przypomnienie email; zaplanowane przypomnienia wywoływane przez job listę.

Tests: unit (date handling), integration (meeting creation), e2e (create meeting → simulate reminder → verify placeholder email/log).

Edge cases: timezone handling (store ISO timestamps UTC), recurring events (v2), daylight savings.

Migration: tabela `meetings` z polem `datetime` (UTC) i `reminderSchedule`.

---

**Stage 3 — Historia głosowań i statystyki (one feature)**
- Cel: Dodać historię głosowań i podstawowe statystyki użytkownika/klubu.

Nowa funkcja: Voting history + simple analytics.

Deliverables:
- Routes: `/app/clubs/[clubId]/history`, API `GET /api/clubs/[id]/votes?history=true`.
- shadcn components: `Tabs`, `Table`, `Chart` (lighweight chart lib wrapped in Card).
- Data: store `Vote.createdAt`, `Vote.voterId` (optional) i `Vote.metadata`.

Acceptance criteria:
- Lista poprzednich głosowań z wynikami i możliwością eksportu CSV.

Tests: unit (CSV export util), integration (history endpoint returns expected schema), e2e (export flow).

Edge cases: duże zbiory danych — paginacja, limit per request.

---

**Stage 4 — Integracje (one feature)**
- Cel: Dodać integracje z kalendarzem i opcjonalne webhooki dla zewnętrznych systemów.

Nowa funkcja: Google Calendar sync (v1: one-way export) + webhook support.

Deliverables:
- API: `/api/integrations/google-calendar/connect`, `/api/integrations/google-calendar/export`, `/api/webhooks/outgoing`.
- UI: `Connect` button (shadcn `Dialog` + OAuth flow placeholder).

Acceptance criteria:
- Można wyeksportować meeting do Google Calendar (patrz: placeholder flow - OAuth requires secrets).
- Webhook może wysyłać JSON payload przy eventach (vote_closed, meeting_created).

Tests: integration mocks for OAuth, webhook delivery retries.

Edge cases: revocation of tokens, webhooks failures (retry queue).

---

**Stage 5 — QoL: Search, Notifications, Profile (one feature)**
- Cel: Polepszyć odkrywalność i UX: global search (books, members), in-app notifications, podstawowe profile użytkowników.

Nowa funkcja: Global search + in-app notifications.

Deliverables:
- Routes: search page `/app/search?q=...`, API `/api/search?q=`.
- Components: `Combobox`, `Badge`, `Toast`.

Acceptance criteria:
- Search zwraca wyniki dla książek, członków i spotkań; powiadomienia są widoczne w UI.

Tests: unit search util, integration search indexing.

Edge cases: fuzzy search vs exact, pagination.

---

Priorytety i minimalizacja ryzyka
- Funkcje, które można opóźnić bez utraty wartości MVP: role użytkowników, wielokrotne kluby na konto, threaded comments, attachments, dark mode.
- Kluczowe zależności: Stage 0 → Stage1 (invite token needed by members), Stage1→Stage2 (members needed for reminders), Stage2→Stage3 (meetings & votes required for history).
- Minimalne integracje: mail sender (Resend or SMTP) i webhook endpointy; auth/billing adapter points pozostawić w `/api/integrations/*`.

Wyjście dodatkowe: checklisty i artefakty
- Release readiness (co musi być obecne przed wdrożeniem każdego etapu):
  - Lint + unit tests green
  - E2E scenariusz krytyczny przechodzi (create club → vote → public vote)
  - Env vars dokumentowane w `.env.example`
  - Dokumentacja endpointów (krótkie OpenAPI lub README w `docs/api.md`)

- Template zadania (GitHub Issue / Jira):
  - Tytuł: [Feature] krótkie streszczenie
  - Cel: jeden akapit co feature robi i dlaczego
  - Kryteria akceptacji: wypunktowane testowalne warunki
  - Kroki testowe: manualne kroki dla QA
  - Zależności: lista innych PR/etapów/aplikacji
  - Kontekst: linki do docs/first plans

---

Uwaga końcowa
- Dokument ten jest przygotowany tak, aby frontendowy zespół (React/Next + shadcn) mógł rozpocząć implementację każdego etapu bez dodatkowych pytań funkcjonalnych. Jeśli chcesz, podzielę Stage 0 na konkretne issues/PR checklisty i wygeneruję `docs/api.md` z endpointami i przykładowymi payloadami.
