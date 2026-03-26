# Plan implementacji — API: Clubs CRUD + create club page

## Krótkie podsumowanie celu
Dodać endpointy CRUD dla klubów oraz stronę tworzenia klubu (`/app/clubs/new`) wraz z prostym dashboardem. Zapewnić walidację (zod), bezpieczne generowanie `inviteCode`, testy (unit/integration/E2E) i czytelne błędy API.

## Deliverables (pliki)
- `pages/app/clubs/new.tsx`
- `pages/app/dashboard.tsx`
- `pages/api/clubs/index.ts` (POST create, GET list)
- `pages/api/clubs/[id].ts` (GET club)
- `lib/validators/club.ts` (zod schema)
- (opcjonalnie) `lib/utils/invite.ts` (generowanie inviteCode)

## Specyfikacja API
- GET `/api/clubs`
  - Query: optional pagination (limit, offset)
  - Response 200: `{ clubs: Club[] }`
- POST `/api/clubs`
  - Body: `{ name: string, description?: string }`
  - Success: 201 Created, body: `{ id: string, inviteCode: string }`
  - Errors: 400 Bad Request (validation error, returns `{ error: string, issues?: any }`), 500 Internal Server Error
- GET `/api/clubs/:id`
  - Success 200: `{ club: Club }` or 404 Not Found

HTTP headers: use standard JSON responses and proper status codes. Validate input with zod and return structured validation errors (HTTP 400).

## Schemat walidacji (zod)
```ts
import { z } from 'zod'

export const ClubCreateSchema = z.object({
  name: z.string().min(3, 'Nazwa musi mieć co najmniej 3 znaki').max(100),
  description: z.string().max(1000).optional(),
})

export type ClubCreateInput = z.infer<typeof ClubCreateSchema>
```

## Typy TypeScript
```ts
export type Club = {
  id: string
  name: string
  description?: string
  organizerId?: string
  inviteCode?: string
}

// Request / Response types
export type CreateClubResponse = { id: string; inviteCode: string }
```

## Bezpieczne generowanie `inviteCode`
- Proponowany prosty, URL‑safe generator (Node):
```ts
import { randomBytes } from 'crypto'

export function generateInviteCode(len = 9) {
  return randomBytes(len).toString('base64url') // URL-safe
}
```

## Przykład zapisu do DB (używając `lib/db.ts`)
```ts
import db from 'lib/db'

async function createClub(name: string, description?: string, organizerId?: string) {
  const inviteCode = generateInviteCode()
  const res = await db.query(`
    INSERT INTO clubs (name, description, organizer_id, invite_code)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `, [name, description || null, organizerId || null, inviteCode])
  return { id: res.rows[0].id, inviteCode }
}
```

## Plan implementacji — kroki
1) Przygotuj walidator
   - Plik: `lib/validators/club.ts`
   - Zawartość: `ClubCreateSchema` (zod). Upewnij się, że jest eksportowany dla klienta i serwera.
   - Kryteria ukończenia: importowalny schemat; test jednostkowy walidacji (valid/invalid cases).

2) Dodaj helper generujący `inviteCode`
   - Plik: `lib/utils/invite.ts` lub funkcja w `lib/validators/club.ts`
   - Zawartość: `generateInviteCode()` używający `crypto.randomBytes(...).toString('base64url')`.
   - Kryteria ukończenia: funkcja zwraca URL-safe string; ma prosty unit test sprawdzający długość i unikalność przy kilku wywołaniach.

3) Implementuj API — POST `/api/clubs`
   - Plik: `pages/api/clubs/index.ts`
   - Co napisać: handler, który parsuje body, validuje zodem, generuje inviteCode i zapisuje rekord do DB używając `lib/db.ts`.
   - Obsługa błędów: zwróć 400 z `issues` z zod przy walidacji; 500 przy błędach DB.
   - Kryteria ukończenia: curl/postman `POST /api/clubs` z poprawnym body zwraca 201 i `{ id, inviteCode }`; błędne body zwraca 400.

4) Implementuj API — GET `/api/clubs` i GET `/api/clubs/[id]`
   - Pliki: `pages/api/clubs/index.ts` (GET), `pages/api/clubs/[id].ts` (GET)
   - Co napisać: prosty SELECT z paginacją opcjonalną; dla `/:id` SELECT WHERE id = $1.
   - Kryteria ukończenia: GET list zwraca strukturę `{ clubs: [...] }`; GET by id zwraca 200 lub 404.

5) Stwórz UI — `pages/app/clubs/new.tsx`
   - Co napisać: formularz korzystający z shadcn `Input`, `Textarea`, `Button`, `Card`, `Toast`.
   - Funkcjonalność: klient waliduje lokalnie z tym samym zod schema (można użyć `react-hook-form` + `@hookform/resolvers/zod`), zapobiega podwójnemu submitowi (disable button + loader), robi `fetch('/api/clubs', { method: 'POST', body: JSON.stringify(...) })` i po sukcesie `router.push('/app/clubs/' + id)`.
   - Kryteria ukończenia: formularz wysyła request, przy sukcesie następuje redirect; przy błędzie walidacji pokazany `Toast` i pola z błędami.

6) Stwórz placeholder dashboard
   - Plik: `pages/app/dashboard.tsx`
   - Zawartość: prosty `Card` z linkiem do `new` i miejscem na statystyki.
   - Kryteria ukończenia: strona renderuje bez błędów i ma link do `app/clubs/new`.

7) Testy jednostkowe i integracyjne
   - Unit: testy zod schema dla `lib/validators/club.ts` oraz `generateInviteCode`.
   - Integration: test API `POST /api/clubs` używając testowej DB (uruchom migrację przed testem, rollback po teście). Test sprawdza: API 201, DB zawiera wiersz z danym id.
   - E2E: Cypress test: odwiedź `/app/clubs/new`, wypełnij form, kliknij `Utwórz`, oczekuj redirect do `/app/clubs/:id` i sprawdź, że URL zawiera UUID.

8) Dokumentacja i PRy
   - Przygotuj dwa PRy: (A) `api: clubs create endpoint` — zawiera `lib/validators/club.ts`, `lib/utils/invite.ts`, `pages/api/clubs/*`, testy integracyjne; (B) `feat: create-club page` — zawiera `pages/app/clubs/new.tsx`, `pages/app/dashboard.tsx`, unit tests dla formy, E2E test.
   - Każdy PR powinien zawierać opis, kroki testowe, i checklistę acceptance criteria.

## Testy — przykładowe przypadki
- Unit (zod):
  - valid input: `{ name: 'Książkoholicy' }` -> pass
  - invalid input: `{ name: '' }` -> fail with message
- Integration (API):
  - POST valid body -> 201, response has `id`, DB row exists with invite_code
  - POST invalid body -> 400, response contains validation issues
  - GET /api/clubs/:id -> 200 with club data; non-existent id -> 404
- E2E (Cypress):
  - Visit `/app/clubs/new`, fill name, submit -> expect location `/app/clubs/:id` and toast success

## Acceptance criteria (sformalizowane)
- POST `/api/clubs` tworzy rekord w DB i zwraca 201 oraz `{ id, inviteCode }`.
- Formularz `/app/clubs/new` tworzy klub bez pełnego reloadu i redirectuje do `/app/clubs/[id]`.
- Walidacja działa po stronie klienta i serwera; błędy prezentowane są użytkownikowi.

## Edge cases i mitigacje
- Duplikaty nazw: pozwól duplikaty, ale można dodać unikatowy constraint i obsłużyć 409.
- Race conditions przy generowaniu inviteCode: użyj unikalnego constraint na `invite_code` i retry w serwerze przy kolizji.
- Spam: rate-limit endpointy (IP / account) w kolejnych iteracjach.
- XSS: escape/strip HTML z pól tekstowych w wyświetleniu (np. in messages), ale opis klubu może zawierać markdown w przyszłości.

## Sugestie do PRów
- PR 1 title: `api: clubs create endpoint` — zawiera validator, invite util, API handlers, integration tests.
- PR 2 title: `feat: create-club page` — zawiera UI, client-side validation, E2E test, and dashboard placeholder.
- PR checklist (each PR): run migrations, run unit tests, run integration tests, run E2E locally.

## QA / Manualne kroki testowe
1. Uruchom migracje lokalne.
2. Start dev server: `npm run dev`.
3. Otwórz `/app/clubs/new`.
4. Wypełnij `name` i `description`, kliknij `Utwórz`.
5. Oczekuj: redirect do `/app/clubs/:id`, zobacz `Toast` z sukcesem.
6. Sprawdź w DB, że rekord istnieje i `invite_code` jest wygenerowany.

---
Plik zapisany jako `docs/second plans/3-clubs-api-plan.md`.
