import type { ProviderListing } from '../types/provider';
import { services } from './services';

/** Minúsculas y sin acentos, para comparar "Limpieza" con "limpieza" o "Hipódromo" con "hipodromo". */
export function normalize(text: string) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

const serviceLabels = new Map(services.map((s) => [s.id, `${s.label} ${s.short}`]));

/**
 * ¿El proveedor coincide con lo que escribió el usuario?
 * Busca en el nombre y en TODOS sus servicios (regla 4 de ANOTACIONES.txt).
 * Cada palabra escrita debe aparecer: "brillo" solo trae a quien lleve "brillo".
 * API: el backend hará lo mismo con ?query= en GET /api/providers.
 */
export function matchesQuery(provider: ProviderListing, query: string) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const text = normalize([provider.name, ...provider.services.map((id) => serviceLabels.get(id) ?? '')].join(' '));
  return words.every((word) => text.includes(word));
}
