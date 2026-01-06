/**
 * Listy polecanych książek dla różnych ścieżek
 */

export function getReadingLists(
  pathway: string,
  riskBreakdown: Record<string, number>
) {
  const baseList = BASE_READING_LISTS[pathway] || BASE_READING_LISTS.before;
  const dynamicBooks = [];
  
  // Dodaj specyficzne książki dla wysokiego ryzyka
  if (riskBreakdown['Alienacja rodzicielska'] > 40) {
    dynamicBooks.push({
      title: "Alienacja rodzicielska - Poradnik dla ojców",
      author: "Eksperci prawa rodzinnego",
      description: "Jak rozpoznać i przeciwdziałać alienacji - praktyczne strategie"
    });
  }
  
  if (riskBreakdown['Manipulacja'] > 40) {
    dynamicBooks.push({
      title: "W pułapce toksycznego związku",
      author: "Shannon Thomas",
      description: "Rozpoznawanie i wychodzenie z relacji z osobami narcystycznymi"
    });
  }
  
  // Połącz i ogranicz do 5
  return [...dynamicBooks, ...baseList].slice(0, 5);
}

const BASE_READING_LISTS: Record<string, any> = {
  before: [
    {
      title: "No More Mr. Nice Guy",
      author: "Robert Glover",
      description: "Jak przestać się dostosowywać i odzyskać męską pewność siebie"
    },
    {
      title: "Attached",
      author: "Amir Levine",
      description: "Zrozumienie stylów przywiązania i ich wpływu na relacje"
    },
    {
      title: "Męska energia w związku",
      author: "David Deida",
      description: "Jak utrzymać siłę i autonomię nie tracąc bliskości"
    }
  ],
  
  crisis: [
    {
      title: "48 praw władzy",
      author: "Robert Greene",
      description: "Strategiczne myślenie - nie daj się manipulować"
    },
    {
      title: "Prawo rodzinne dla ojców",
      author: "Zespół prawników",
      description: "Praktyczny przewodnik po prawach ojców w Polsce"
    },
    {
      title: "Emocjonalna inteligencja 2.0",
      author: "Travis Bradberry",
      description: "Kontrola emocji w sytuacjach kryzysowych"
    },
    {
      title: "Granice w związkach",
      author: "Henry Cloud",
      description: "Ustalanie i utrzymywanie zdrowych granic"
    }
  ],
  
  divorce: [
    {
      title: "Rozwód i alimenty - praktyczny poradnik",
      author: "Kancelaria prawna",
      description: "Kompleksowy przewodnik po procesie rozwodowym w Polsce"
    },
    {
      title: "Ojcowie po rozwodzie",
      author: "Eksperci prawa rodzinnego",
      description: "Walka o prawa do dzieci i unikanie alienacji"
    },
    {
      title: "Sztuka wojny",
      author: "Sun Tzu",
      description: "Strategia - zachowaj spokój i myśl długoterminowo"
    },
    {
      title: "Medytacje",
      author: "Marek Aureliusz",
      description: "Stoicka filozofia - kontroluj tylko to, co możesz"
    },
    {
      title: "Odporność psychiczna",
      author: "Monika Górska",
      description: "Jak przetrwać najtrudniejsze momenty"
    }
  ],
  
  married: [
    {
      title: "5 języków miłości",
      author: "Gary Chapman",
      description: "Skuteczna komunikacja w długoletnim związku"
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      description: "Małe zmiany, wielkie efekty - rozwój osobisty"
    },
    {
      title: "Siła woli",
      author: "Kelly McGonigal",
      description: "Kontrola impulsów i budowanie dobrych nawyków"
    }
  ]
};
