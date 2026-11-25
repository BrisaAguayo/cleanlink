import { formatDate, formatMoney } from '../data/format';
import { clientKindLabels, type ServiceRequest } from '../data/service-requests';
import { spaceTypeLabel } from '../data/space-types';
import { Card } from './card';
import { Icon } from './icon';
import { StatusBadge } from './status-badge';

type ServiceSummaryCardProps = {
  request: ServiceRequest;
  /** A dónde lleva la tarjeta (el detalle del servicio). */
  href: string;
};

/**
 * Resumen de un servicio en el panel del proveedor: cliente, estado, tipo de cliente, fecha,
 * espacio, tipo de limpieza y costo. Toda la tarjeta es enlace al detalle.
 */
export function ServiceSummaryCard({ request, href }: ServiceSummaryCardProps) {
  return (
    <Card as="a" href={href} padding="sm" className="h-full gap-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-body font-semibold break-words">{request.client.name}</h3>
        <StatusBadge status={request.status} />
      </div>

      <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-3 text-body-sm">
        <div>
          <dt className="text-caption text-ink-muted">Cliente</dt>
          <dd className="m-0">{clientKindLabels[request.client.kind]}</dd>
        </div>
        <div>
          <dt className="text-caption text-ink-muted">Fecha</dt>
          <dd className="m-0">{formatDate(request.date)}</dd>
        </div>
        <div>
          <dt className="text-caption text-ink-muted">Espacio</dt>
          <dd className="m-0">
            {spaceTypeLabel(request.spaceType)} · {request.m2} m²
          </dd>
        </div>
        <div>
          <dt className="text-caption text-ink-muted">Tipo de limpieza</dt>
          <dd className="m-0">{request.lines.map((l) => l.label).join(' + ')}</dd>
        </div>
      </dl>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-3">
        <span className="text-body font-bold text-primary">{formatMoney(request.total)}</span>
        <span className="inline-flex items-center gap-1 text-label text-primary">
          Ver detalle
          <Icon name="arrow_forward" size={16} />
        </span>
      </div>
    </Card>
  );
}
