## Issue: DB schema — migracje core tables (Supabase/Postgres)

### Tytuł
db: add core tables migration (clubs, members, book_proposals, votes, meetings, messages)

### Opis
Dodać migrację SQL tworzącą podstawowe tabele wymagane przez Stage 0 oraz prosty helper DB w `lib/db.ts` dla połączenia z Supabase/Postgres.

### Deliverables (pliki)
- `db/migrations/001_create_core_tables.sql` (pełna migracja SQL)
- `lib/db.ts` (export helpera korzystającego z `pg` lub supabase-js client)
- `.env.example` uaktualniony o `DATABASE_URL` i `SUPABASE_*`.

### Migracja SQL (treść przykładowa)
```sql
-- 001_create_core_tables.sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  organizer_id uuid,
  invite_code text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  name text,
  email text,
  invite_token text,
  invite_status text DEFAULT 'pending',
  joined_at timestamptz DEFAULT now()
);

CREATE TABLE book_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  title text NOT NULL,
  author text,
  description text,
  proposer_id uuid,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES book_proposals(id) ON DELETE CASCADE,
  voter_token text,
  choice text CHECK (choice IN ('yes','no','abstain')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  title text,
  datetime timestamptz,
  location text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  author_name text,
  content text,
  created_at timestamptz DEFAULT now()
);
```

### TS types / example schema (for frontend/backend)
```ts
type Club = { id: string; name: string; description?: string; organizerId?: string; inviteCode?: string }
type Member = { id: string; clubId: string; name?: string; email?: string; inviteToken?: string; inviteStatus?: 'pending'|'accepted' }
type BookProposal = { id: string; clubId: string; title: string; author?: string }
type Vote = { id: string; proposalId: string; voterToken?: string; choice: 'yes'|'no'|'abstain' }
type Meeting = { id: string; clubId: string; title?: string; datetime?: string; location?: string }
type Message = { id: string; clubId: string; authorName?: string; content: string; createdAt: string }
```

### API payload examples (when connected to endpoints)
- Create club: `POST /api/clubs` body `{ "name":"Moje Club","description":"..." }`
- Create member via invite: `POST /api/clubs/:id/members` body `{ "inviteToken":"xyz","name":"Jan" }`

### Acceptance criteria
- Migracja tworzy tabele bez błędów na lokalnym DB (test przejścia).
- `lib/db.ts` umożliwia wykonywanie zapytań (przykład: `await db.query('SELECT 1')`).

### Testy do napisać
- Migration smoke test: uruchom migrację w test DB i sprawdź, że tabele istnieją.
- Integration test: insert/select podstawowego wiersza do `clubs`.

### Edge cases i mitigacje
- Brak rozszerzenia `pgcrypto`: dodać instrukcję instalacji lub przełącznik na `uuid_generate_v4()` z `uuid-ossp`.
- Up/down migracje: przygotować prostą down migration jeśli potrzebne.

### PR granularity i commity
- PR: `db: add core tables migration`
- Commity:
  - `db(migrations): add 001_create_core_tables.sql`
  - `chore(db): add lib/db.ts helper`

### Local dev steps (db)
```bash
# wymagane: lokalny Postgres lub Supabase lokal
psql $DATABASE_URL -f db/migrations/001_create_core_tables.sql
# lub: supabase db push / supabase migration run
```
