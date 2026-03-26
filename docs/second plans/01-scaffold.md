## Issue: Scaffold projektu — init Next.js + Tailwind + shadcn UI

### Tytuł
chore: init nextjs + tailwind + shadcn

### Opis
Utworzyć bazowy scaffold projektu: Next.js (TypeScript), Tailwind CSS, konfiguracja shadcn UI (komponenty wrapper), ESLint, Prettier, podstawowy layout `AppShell` i landing page. Plik startowy dla tests/CI nie jest wymagany w tym kroku poza smoke testem.

### Deliverables (pliki do utworzenia/modyfikacji)
- `package.json` (skrypty: dev, build, start, lint, format, test)
- `next.config.js`
- `tsconfig.json`
- `tailwind.config.js`, `postcss.config.js`
- `pages/_app.tsx`, `pages/index.tsx`
- `components/ui/*` (wrappery shadcn, Button.tsx, Input.tsx, Card.tsx)
- `components/Layout/AppShell.tsx` (Sidebar + Topbar placeholder)
- `styles/globals.css`
- `/.eslintrc.json`, `/.prettierrc`, `.editorconfig`
- `.env.example` (szablon env)

### Komponenty shadcn do wykorzystania (setup)
- Button, Input, Textarea, Card, Avatar, Dialog, Toast (wrappery w `components/ui/`)

### Acceptance criteria (testowalne)
- `npm run dev` uruchamia aplikację i zwraca stronę pod `/` bez błędów JavaScript/TypeScript.
- `npm run lint` nie zwraca krytycznych błędów (konfiguracja ESLint działa).
- Landing (`/`) renderuje `AppShell` z widocznym headerem i CTA.

### Testy do napisać
- Unit: smoke test renderu `pages/index` (React Testing Library).
- E2E: prosty test (Cypress/Playwright) — odwiedź `/` → sprawdź, że przycisk CTA istnieje.

### Edge cases i mitigacje
- Różne wersje Node: dodać `engines` w `package.json` (Node >=16). 
- Brak globalnych stylów: upewnić się, że `globals.css` importowany w `_app.tsx`.

### PR granularity i przykładowe komunikaty
- PR: pojedynczy PR "chore: init nextjs + tailwind + shadcn"
- Commity:
  - `chore: init project with nextjs typescript`
  - `chore: add tailwind and postcss config`
  - `chore: add shadcn ui wrappers`

### Pliki referencyjne/scaffold commands
```bash
npx create-next-app@latest --ts .
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install @shadcn/ui # or follow shadcn install steps
```

### Notatka
Po mergu PR: utwórz branch `dev` jako główny development branch (opcjonalnie) i zainicjuj CI skeleton w kolejnym kroku.
