# WF_User_Journey_Map - BookClub Pro

**Cel:** Zaprojektowanie ścieżki użytkownika od wejścia do momentu "sukcesu", z identyfikacją friction points i momentów AHA.

---

## 🎯 Success Metric (Co to jest "sukces użytkownika"?)

Użytkownik będzie uważał, że narzędzie warte jest 29 zł/miesiąc, jeśli:
→ **"W 3 minuty założę book club, zaproszę członków i przeprowadzę głosowanie na książkę bez przekopywania się przez 500 wiadomości w WhatsAppie"**

---

## Stage 1: Landing (0-30 sekund)

### What they see:

| Element | Treść |
|---------|-------|
| **Headline** | "Zorganizuj swój book club w jednym miejscu" |
| **Sub-headline** | "Zamiast 5 narzędzi - jedna platforma do zarządzania członkami, głosowania na książki i planowania spotkań" |
| **CTA Primary** | "Załóż darmowy klub" |
| **CTA Secondary** | "Jak to działa?" (link do demo) |
| **Social proof** | "Używany przez 50+ book clubi w Polsce" |

### Friction Points:

- [ ] **Issue:** Zbyt wiele opcji na stronie (Free vs Pro vs Premium)
  - **Solution:** Pokazać tylko Free, Premium po 30 dniach lub przekroczeniu limitu

- [ ] **Issue:** Headline niejasny ("Najlepsza platforma do book clubi")
  - **Solution:** Jasny problem + rozwiązanie (aktualnie OK)

- [ ] **Issue:** Brak preview funkcjonalności
  - **Solution:** Dodać screenshot aplikacji lub krótki GIF (3 sekundy)

### Aha Moment:
> "To rozwiązuje mój problem z WhatsAppem"

### CTA:
> **[ZAŁÓŻ DARMOWY KLUB]** - kolor wyróżniający się, bez scrollowania

---

## Stage 2: Sign-Up (1-3 minuty)

### Flow:

1. **Email + Password** (2 pola, żadnych dodatkowych)
2. **Instant email link** (nie PIN, nie 2FA)
3. **Quick start** (opcjonalnie: "Pomiń, zacznij teraz")
4. **Enter app** → widzę główny dashboard

### Rejestracja - szczegóły:

| Pole | Wartość |
|------|---------|
| Email | Wymagane |
| Hasło | Minimum 6 znaków |
| Nazwa klubu | Wymagane (placeholder: "Mój book club") |
|验证码 | BRAK w MVP |

### Friction Points:

- [ ] **Issue:** Formularz pyta o "Cel użycia" albo "Rola"
  - **Solution:** Pomiń to - użytkownik chce wejść, nie wypełniać ankietę

- [ ] **Issue:** Przekierowanie na "Zaproś członków" przed wejściem do app
  - **Solution:** Najpierw dashboard, potem zaproszenia (drag & drop)

- [ ] **Issue:** Strona "Gratulacje! Teraz zaproś 5 znajomych"
  - **Solution:** NIE - to przedwczesne, user nie widział value

### Aha Moment:
> User widzi główny dashboard: "Mój book club" z przyciskiem "Dodaj głosowanie"

### Follow-up Email (5 min after):
> **Subject:** "Twój book club jest gotowy - co teraz?"
> **Body:** 1 link: "[Dodaj pierwsze głosowanie]" - prowadzi prosto do feature'u

---

## Stage 3: First Data Input (5-15 minut)

### Input type:
**Tworzenie pierwszego głosowania na książkę**

### Required fields:

| Pole | Instrukcja |
|------|-------------|
| **Tytuł głosowania** | "Wybór książki na marzec" (przykład pre-filled) |
| **Propozycje książek** | Tytuł + autor (min 2, max 10) |
| **Deadline** | Kalendarz (domyślnie: 7 dni) |

### Pre-filled example:
- "Nowy rok, nowa książka" - użytkownik klika "Proceed" i edytuje

### Friction Points:

- [ ] **Issue:** "Musisz najpierw dodać członków" - wymaganie przed głosowaniem
  - **Solution:** NIE wymagaj - głosowanie może być bez członków, oni dołączą później

- [ ] **Issue:** Brak instrukcji "Jak dodać książkę"
  - **Solution:** Tooltip przy polu: "Wpisz tytuł i autora, np. 'Lalka - Bolesław Prus'"

- [ ] **Issue:** Walidacja po submit (error po kliknięciu)
  - **Solution:** Real-time validation - podświetl red, gdy pole puste

### Aha Moment:
> System akceptuje głosowanie i wyświetla: "Głosowanie utworzone! Udostępnij link członkom: [COPY]"

---

## Stage 4: Processing (15-20 sekund)

### UX:

| Element | Treść |
|---------|-------|
| **Progress bar** | ✅ POKAŻ |
| **Text** | "Tworzymy głosowanie..." |
| **Time estimate** | "< 5 sekund" |

### Error handling:

- Błąd walidacji → podświetl pole na czerwono, nie blokuj
- Błąd serwera → "Coś poszło nie tak, spróbuj ponownie" + przycisk

### Friction Points:

- [ ] **Issue:** Biały ekran ze spinnerem
  - **Solution:** Progress bar z tekstem (aktualnie OK)

- [ ] **Issue:** Czas >15 sekund
  - **Solution:** Upewnić się, że wszystko <15s, inaczej pokazać preview

---

## Stage 5: First Output / AHA MOMENT (20-60 sekund) ⭐ MOST CRITICAL

### Output format:
**Strona głosowania z unikalnym linkiem do udostępnienia**

### Visual Design:

**User instantly sees:**
- Nazwa głosowania: "Wybór książki na marzec"
- Lista propozycji (książki)
- Licznik głosów: "0 głosów"
- Status: "Aktywne"
- Link do udostępnienia: "[KOPIUJ]"

**User instantly can do:**
- [ ] KOPIUJ link
- [ ] Udostępnij (Facebook/Twitter - opcjonalnie)
- [ ] Dodaj więcej książek
- [ ] Zobacz podgląd (jak widzą członkowie)

### Export Options:
- Link do głosowania (główne)
- Opcjonalnie: Email do członków (po dodaniu emaili)

### Friction Points:

- [ ] **Issue:** "Aby zobaczyć wyniki, dodaj członków"
  - **Solution:** NIE - wyniki widać bez członków

- [ ] **Issue:** "Upgrade do Pro, aby udostępnić"
  - **Solution:** NIE - to musi być darmowe w Free tier

- [ ] **Issue:** Link wymaga logowania, aby zagłosować
  - **Solution:** Public link - każdy może głosować BEZ logowania (kluczowe!)

### Aha Moment:
> "Wow, w 2 minuty stworzyłem głosowanie i mam link do wysłania! Już nie muszę robić tego w Excelu."

### ⏱️ TOTAL TIME FROM LANDING TO AHA:
**3-4 minuty** (target: <5 minut ✅)

---

## Stage 6: Second Action (1-3 dni później)

### Trigger:

| Element | Treść |
|---------|-------|
| **Email at 24h** | "Ile osób oddało głosy? Sprawdź: [LINK]" |
| **In-app widget** | "Stwórz kolejne głosowanie" |
| **History** | Lista poprzednich głosowań |

### Message (24h email):
> **Subject:** "3 osoby oddały głosy w Twoim book club!"
> **Body:** "Sprawdź wyniki: [LINK] | Dodaj następne głosowanie: [LINK]"

### Goal:
User performs second action **WITHOUT email reminder** (来自 własnej inicjatywy)

### Friction Points:

- [ ] **Issue:** Brak follow-up emaila
  - **Solution:** Automatyczny email po 24h (Resend free tier = 3000/mies)

- [ ] **Issue:** App po 24h wygląda tak samo - user zapomina
  - **Solution:** Dashboard pokazuje "Ostatnia aktywność: 2 dni temu"

- [ ] **Issue:** Drugie głosowanie trudniejsze niż pierwsze
  - **Solution:** Identyczny workflow - copy/paste z poprzedniego

### Second action success:
> User widzi w dashboardie: "Masz 5 aktywnych głosowań" i klika "Dodaj następne"

---

## Stage 7: Conversion (7-30 dni)

### Trigger:

| Scenariusz | Message |
|-----------|---------|
| **10+ członków** | "Twój club przekroczył 10 osób. Aby dodać więcej, przejdź na Pro: [LINK]" |
| **Trial ends (brak w Free)** | NIE MA - Free forever, ale z limitem |
| **14 dni bez aktywności** | "Tęsknimy! Twoje głosowanie nadal działa: [LINK]" |

### Pricing messaging:

| Plan | Price | Limit |
|------|-------|-------|
| **Free** | 0 zł | 10 członków, 3 aktywne głosowania |
| **Pro** | 29 zł/mies | 30 członków, nielimitowane głosowania |
| **Premium** | 59 zł/mies | Bez limitu + branding |

### Friction Points:

- [ ] **Issue:** "Only 29 zł, ale zawiera 5 funkcji" - niejasne
  - **Solution:** Jasne: "Pro: więcej członków, więcej głosowań"

- [ ] **Issue:** Wymaganie karty kredytowej na trial
  - **Solution:** NIE wymagaj - Free forever do limitu

- [ ] **Issue:** Pricing ukryty do końca
  - **Solution:** Footer: "Ceny: Free / 29 zł / 59 zł" - transparentnie

### Aha Moment:
> User myśli: "Mój club rośnie, przekroczyłem limit. 29 zł to mniej niż koszt mojego czasu na zarządzanie w WhatsAppie."

---

## Summary Metrics

| Metryka | Cel | Pomiar |
|---------|-----|--------|
| Landing → Sign-up | >5% | Analytics |
| Sign-up → First Output | >70% | Supabase events |
| Time to first output | <5 min | Analytics |
| Aha Moment survey | >80% | Post-signup survey |
| Day 1 Return Rate | >40% | Week 1 |
| Day 7 Return Rate | >30% | Week 2 |
| Trial → Paid | >5% | Month 1 |

---

## 🚩 Critical Checkpoints

| Checkpoint | Status | Action |
|------------|--------|--------|
| Aha Moment po >5 min | ✅ OK (3-4 min) | N/A |
| Output wymaga settings | ✅ OK (widoczny od razu) | N/A |
| Second return <30% | ⚠️ Monitor | Post-launch |
| Conversion <3% | ⚠️ Monitor | Post-launch |
| Support tickets "Jak używać?" | ⚠️ Dokumentacja | Dodaj help |

---

## Biggest Friction Point (Jeden punkt niszczący konwersje)

> **Link do głosowania wymaga logowania członków** - to zabija wiralność.

**Solution:** Public link - każdy głosuje bez konta. Tylko organizator musi się zalogować.

---

## Quick Wins (Zmiany w <4h)

1. **Publiczne głosowania** - bez logowania dla głosujących
2. **Progress bar w Stage 4** - tekst "Tworzenie głosowania..."
3. **Email after 24h** - "3 osoby oddały głosy!"

---

## Common Journey Mistakes (Unikanie)

| Mistake | BookClub Pro |
|---------|--------------|
| Sign up → Settings → Dashboard | ✅ Dashboard first |
| Download extension first | ✅ Web version MVP |
| Invite team before success | ✅ User creates 1st vote first |
| Complex permissions | ✅ Solo: only Organizator + Członek |
| 7+ onboarding screens | ✅ 1 tip max, reszt through doing |

---

*Document created: 2026-03-25*
*Mode: Architect - WF_User_Journey_Map*