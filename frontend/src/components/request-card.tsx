import { formatDate, formatMoney } from '../data/format';
import { providerKindLabels } from '../data/provider-kinds';
import type { ServiceRequest } from '../data/service-requests';
import { spaceTypeLabel } from '../data/space-types';
import { Avatar } from './avatar';
import { Card } from './card';
import { Icon } from './icon';
import { StatusBadge } from './status-badge';

/**
 * Servicio contratado, visto por el cliente: con quién, qué, dónde, cuándo y cuánto.
 * Solo informativa. (El proveedor usa ServiceSummaryCard y el detalle del servicio.)
 */
export function RequestCard({ request }: { request: ServiceRequest }) {
  const { provider } = request;

  return (
    <Card as="article" radius="md" className="h-full">
      <div className="flex items-start gap-3">
        <Avatar name={provider.name} isGroup={provider.kind !== 'persona'} size={44} />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-caption text-ink-muted">Proveedor · {providerKindLabels[provider.kind]}</span>
          <h3 className="text-body font-semibold break-words">{provider.name}</h3>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
        <span className="text-label">{request.lines.map((l) => l.label).join(' + ')}</span>
        <span className="text-body font-bold text-primary">{formatMoney(request.total)}</span>
      </div>

      <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-3 text-body-sm">
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
        <div className="col-span-2">
          <dt className="text-caption text-ink-muted">Desglose</dt>
          <dd className="m-0 flex flex-col">
            {request.lines.map((l) => (
              <span key={l.serviceId}>
                {l.label}: {l.m2} m² × {formatMoney(l.pricePerM2)}
                {l.factor !== 1 && ` × ${l.factor}`} = {formatMoney(l.subtotal)}
              </span>
            ))}
          </dd>
        </div>
        {request.notes && (
          <div className="col-span-2">
            <dt className="text-caption text-ink-muted">Indicaciones</dt>
            <dd className="m-0">{request.notes}</dd>
          </div>
        )}
      </dl>

      <div className="mt-auto border-t border-line pt-3">
        <a href={`/proveedor?id=${provider.id}`} className="inline-flex items-center gap-1 text-label text-primary no-underline">
          Ver perfil del proveedor
          <Icon name="arrow_forward" size={16} />
        </a>
      </div>
    </Card>
  );
}
