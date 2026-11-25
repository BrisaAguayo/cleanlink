import type { ServiceId } from '../types/provider';
import type { SpaceTypeId } from './space-types';

/**
 * Lo que cada proveedor captura para cotizar (regla 7 de ANOTACIONES.txt):
 * - prices: precio FINAL en MXN por m² (IVA incluido) de cada servicio que ofrece.
 * - adjustments: ajuste por tipo de espacio; si no aparece, vale 1.0.
 * - maxM2: m² máximos que atiende.
 */
export type ProviderPricing = {
  prices: Partial<Record<ServiceId, number>>;
  adjustments: Partial<Record<SpaceTypeId, number>>;
  maxM2: number;
};

// Datos de prueba por id de mockListings. API: precios y ajustes de GET /api/providers/{id}.
export const mockPricing: Record<string, ProviderPricing> = {
  '1': { prices: { profunda: 22, oficinas: 16, 'post-obra': 30 }, adjustments: { oficina: 0.9, bodega: 1.3 }, maxM2: 800 },
  '2': { prices: { casas: 14, profunda: 20 }, adjustments: { departamento: 0.9, vacacional: 1.15 }, maxM2: 150 },
  '3': { prices: { ventanas: 12, oficinas: 15 }, adjustments: { local: 1.1, escuela: 1.2 }, maxM2: 600 },
  '4': { prices: { casas: 13, mudanzas: 18 }, adjustments: { departamento: 0.9 }, maxM2: 120 },
  '5': { prices: { 'post-obra': 28, oficinas: 14, ventanas: 11 }, adjustments: { bodega: 1.25, oficina: 0.95 }, maxM2: 2000 },
  '6': { prices: { ventanas: 12, casas: 15 }, adjustments: {}, maxM2: 180 },
  '7': { prices: { casas: 15, profunda: 21 }, adjustments: { departamento: 0.95, vacacional: 1.2 }, maxM2: 300 },
  '8': { prices: { casas: 14, oficinas: 16 }, adjustments: { oficina: 1.05 }, maxM2: 200 },
  '9': { prices: { oficinas: 13, ventanas: 10 }, adjustments: { oficina: 0.9, escuela: 1.1, consultorio: 1.2 }, maxM2: 1500 },
  '10': { prices: { mudanzas: 17, 'post-obra': 26 }, adjustments: {}, maxM2: 150 },
  '11': { prices: { oficinas: 15, profunda: 21 }, adjustments: { consultorio: 1.15 }, maxM2: 250 },
  '12': { prices: { casas: 14, ventanas: 11, profunda: 20 }, adjustments: { vacacional: 1.1 }, maxM2: 400 },
  '13': { prices: { casas: 13 }, adjustments: { departamento: 0.9 }, maxM2: 120 },
  '14': { prices: { ventanas: 12, 'post-obra': 27 }, adjustments: { local: 1.1, bodega: 1.3 }, maxM2: 1200 },
  '15': { prices: { mudanzas: 16, casas: 13 }, adjustments: {}, maxM2: 150 },
  '16': { prices: { oficinas: 13, profunda: 19, 'post-obra': 27 }, adjustments: { escuela: 1.15, bodega: 1.2 }, maxM2: 2500 },
  '17': { prices: { casas: 15, profunda: 22 }, adjustments: {}, maxM2: 140 },
  '18': { prices: { mudanzas: 18, casas: 14, 'post-obra': 28 }, adjustments: { bodega: 1.2 }, maxM2: 900 },
  '19': { prices: { ventanas: 13, oficinas: 16 }, adjustments: { local: 1.05 }, maxM2: 220 },
  '20': { prices: { oficinas: 15, ventanas: 12, profunda: 21 }, adjustments: { consultorio: 1.2, oficina: 0.95 }, maxM2: 700 },
};
