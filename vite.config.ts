import { defineConfig } from 'vite'; 
// Co robi: Importuje funkcję defineConfig z Vite.  Dlaczego jest potrzebna:  Ułatwia pisanie konfiguracji Vite w czytelny sposób.  W TypeScript pozwala na autouzupełnianie i sprawdzanie typów (choć w JS też można jej używać).
// Efekt: Funkcja nie zmienia działania kodu, ale sprawia, że konfiguracja jest “formalnie poprawna” dla Vite.
import react from '@vitejs/plugin-react';
//Co robi: Importuje plugin React dla Vite. Dlaczego jest potrzebny:
// Vite sam z siebie nie rozumie JSX ani TSX, więc potrzebuje tego pluginu.
//Plugin obsługuje:
//JSX/TSX w React,
//Hot Module Replacement (HMR, czyli szybkie odświeżanie zmian bez przeładowania strony),
//inne optymalizacje bundla dla projektów React.
//Efekt: Bez tego Twój kod React może nie kompilować się poprawnie w Vite.
export default defineConfig({
  plugins: [react()],
  base: '/quiz16/', // GitHub Pages
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
