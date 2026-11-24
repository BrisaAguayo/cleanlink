import { LandingForGroups } from './landing-for-groups';
import { LandingHero } from './landing-hero';
import { LandingHowItWorks } from './landing-how-it-works';
import { PublicNavbar } from './public-navbar';
import type { SearchQuery } from './search-bar';

const links = [
  { label: 'Explorar', href: '#' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Para grupos', href: '#para-quien' },
];

/**
 * Pantalla 1: página principal para quien aún no inicia sesión.
 * Buscar no requiere sesión (ver ANOTACIONES.txt).
 */
export function LandingView() {
  function handleSearch(search: SearchQuery) {
    // Igual que en el feed: la búsqueda viaja en la URL y la pantalla de resultados llama a la API.
    const params = new URLSearchParams();
    if (search.query) params.set('q', search.query);
    if (search.zone) params.set('zona', search.zone);
    window.location.assign(`/resultados?${params}`);
  }

  return (
    <div className="min-h-svh">
      <PublicNavbar links={links} loginHref="/login" signupHref="/registro" />
      <main>
        <LandingHero onSearch={handleSearch} />
        <LandingHowItWorks />
        <LandingForGroups />
      </main>
    </div>
  );
}
