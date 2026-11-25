import type { ServiceId } from '../types/provider';
import type { ProviderPricing } from './mock-pricing';
import { services } from './services';
import type { SpaceTypeId } from './space-types';

/** Una línea de la cotización: un servicio aplicado a los m² y al tipo de espacio. */
export type QuoteLine = {
  serviceId: ServiceId;
  label: string;
  pricePerM2: number;
  m2: number;
  factor: number;
  subtotal: number;
};

export type Quote = { lines: QuoteLine[]; total: number };

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Cotización exacta (regla 7 de ANOTACIONES.txt):
 * total = suma de (precio por m² × m² × ajuste del tipo de espacio). Sin cobro mínimo; precios con IVA.
 * API: el backend deberá calcular lo mismo al guardar la solicitud.
 */
export function buildQuote(pricing: ProviderPricing, serviceIds: ServiceId[], spaceType: SpaceTypeId, m2: number): Quote {
  const factor = pricing.adjustments[spaceType] ?? 1;
  const lines = serviceIds
    .filter((id) => pricing.prices[id] !== undefined)
    .map((id) => {
      const pricePerM2 = pricing.prices[id]!;
      return {
        serviceId: id,
        label: services.find((s) => s.id === id)?.label ?? id,
        pricePerM2,
        m2,
        factor,
        subtotal: round2(pricePerM2 * m2 * factor),
      };
    });
  return { lines, total: round2(lines.reduce((sum, line) => sum + line.subtotal, 0)) };
}
