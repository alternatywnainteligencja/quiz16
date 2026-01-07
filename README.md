QUIZ MAŁŻEŃSKI
DIAGRAM ARCHITEKTURY APLIKACJI (LOGIKA + DANE)
┌────────────────────┐
│      main.tsx      │
│ (entry point React)│
└─────────┬──────────┘
          ↓
┌────────────────────┐
│      App.tsx       │
│ (bootstrap only)   │
│ renderuje:         │
│ <MarriageQuiz />   │
└─────────┬──────────┘
          ↓
┌──────────────────────────────────────────┐
│            MarriageQuiz.tsx               │
│------------------------------------------ │
│ • centralny kontroler logiki              │
│ • wybór Pathway (Before/Married/etc)      │
│ • zarządzanie stanem quizu i wyniku       │
│ • decyzja: quiz vs wynik                  │
└─────────┬────────────────────────────────┘
          ↓
┌──────────────────────────────────────────┐
│          Pathway Components               │
│------------------------------------------ │
│ BeforePathway.tsx                         │
│ MarriedPathway.tsx                        │
│ CrisisPathway.tsx                         │
│ DivorcePathway.tsx                        │
│------------------------------------------ │
│ • logika przebiegu quizu                  │
│ • pobieranie pytań i wag                  │
│ • zarządzanie pytaniami i odpowiedziami   │
└─────────┬────────────────────────────────┘
          ↓
┌──────────────────────────────────────────┐
│        googleSheetsService.ts             │
│------------------------------------------ │
│ ROLA SERWISU:                             │
│ • JEDYNE miejsce dostępu do Google CSV    │
│ • normalizacja danych                     │
│ • separacja I/O od logiki UI              │
│ • możliwość podmiany źródła danych        │
│------------------------------------------│
│ Funkcje:                                 │
│ • fetchQuestions()                       │
│ • fetchWeights()                         │
│ • parseCSV()                             │
└─────────┬────────────────────────────────┘
          ↓
┌──────────────────────────────────────────┐
│               .env                        │
│------------------------------------------ │
│ VITE_SHEET_CSV_URL_*                      │
│ • linki do Google Sheets (CSV export)     │
│ • konfiguracja per Pathway               │
└─────────┬────────────────────────────────┘
          ↓
┌──────────────────────────────────────────┐
│        Google Sheets (CSV)               │
│------------------------------------------│
│ • pytania                                │
│ • odpowiedzi                             │
│ • kategorie                              │
│ • wagi                                   │
│ • polecane książki                       │
└──────────────────────────────────────────┘

──────────────  PO ZAKOŃCZENIU QUIZU  ──────────────

┌─────────────────────┐
│  ResultDisplay.tsx  │
│---------------------│
│ • prezentacja wyniku│
│ • restart quizu     │
└─────────┬───────────┘
          ↓
┌────────────────────┐
│ calculations.tsx   │
│--------------------│
│ • agregacja punktów│
│ • logika wag       │
│ • obliczenie wyniku│
└─────────┬──────────┘
          ↓
┌────────────────────┐
│  ResultDisplay.tsx │
│ (render finalny)   │
└────────────────────┘
