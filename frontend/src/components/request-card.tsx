import { formatDate, formatMoney } from '../data/format';
import { providerKindLabels } from '../data/provider-kinds';
import { statusLabels, type ClientKind, type RequestStatus, type ServiceRequest } from '../data/service-requests';
import { spaceTypeLabel } from '../data/space-types';
import { Avatar } from './avatar';
import { Badge, type BadgeTone } from './badge';
import { Card } from './card';
import { Icon } from './icon';

const statusTones: Record<RequestStatus, BadgeTone> = {
  pendiente: 'warning',
  aceptada: 'persona',
  finalizada: 'neutral',
};

const clientKindLabels: Record<ClientKind, string> = {
  persona: 'Persona',
  empresa: 'Empresa',
  institucion: 'Institución',
};

type RequestCardProps = {
  request: ServiceRequest;
  /** Desde qué lado se ve: el proveedor ve al cliente; el cliente ve al proveedor. */
  viewer: 'proveedor' | 'cliente';
};

/** Servicio solicitado o contratado: con quién, qué, dónde, cuándo y cuánto. Solo informativa. */
export function RequestCard({ request, viewer }: RequestCardProps) {
  const { client, provider } = request;
  const name = viewer === 'proveedor' ? client.name : provider.name;
  const kind = viewer === 'proveedor' ? clientKindLabels[client.kind] : providerKindLabels[provider.kind];
  const isGroup = viewer === 'proveedor' ? client.kind !== 'persona' : provider.kind !== 'persona';

  return (
    <Card as="article" elevation="raised" radius="md" className="h-full">
      <div className="flex items-start gap-3">
        <Avatar name={name} isGroup={isGroup} size={44} />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-caption text-ink-muted">
            {viewer === 'proveedor' ? 'Cliente' : 'Proveedor'} · {kind}
          </span>
          <h3 className="text-body font-semibold break-words">{name}</h3>
        </div>
        <Badge tone={statusTones[request.status]}>{statusLabels[request.status]}</Badge>
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

      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-3 text-caption text-ink-muted">
        {viewer === 'proveedor' ? (
          <>
            <span className="inline-flex items-center gap-1">
              <Icon name="badge" size={16} />
              {client.contact}
            </span>
            <a href={`mailto:${client.email}`} className="inline-flex items-center gap-1 text-ink-muted hover:text-primary">
              <Icon name="mail" size={16} />
              {client.email}
            </a>
            {client.phone && (
              <a href={`tel:${client.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1 text-ink-muted hover:text-primary">
                <Icon name="call" size={16} />
                {client.phone}
              </a>
            )}
          </>
        ) : (
          <a href={`/proveedor?id=${provider.id}`} className="inline-flex items-center gap-1 text-label text-primary no-underline">
            Ver perfil del proveedor
            <Icon name="arrow_forward" size={16} />
          </a>
        )}
      </div>
    </Card>
  );
}
