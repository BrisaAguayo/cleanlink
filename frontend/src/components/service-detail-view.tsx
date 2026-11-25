import { useEffect, useState, type ReactNode } from 'react';
import { formatDate, formatMoney } from '../data/format';
import { clientKindLabels, requestsForProvider, setRequestStatus, type ClientKind } from '../data/service-requests';
import { spaceTypeLabel } from '../data/space-types';
import { getSession } from '../session/session';
import { AppNavbar } from './app-navbar';
import { Avatar } from './avatar';
import { Badge } from './badge';
import { Button } from './button';
import { Icon } from './icon';
import { StatusBadge } from './status-badge';

const clientKindIcons: Record<ClientKind, string> = {
  persona: 'person',
  empresa: 'apartment',
  institucion: 'account_balance',
};

/** Bloque del detalle con encabezado (icono + título) y contenido. */
function DetailBlock({ icon, title, children }: { icon?: string; title?: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-surface-raised">
      {title && (
        <h2 className="m-0 flex items-center gap-2 border-b border-line px-4 py-3 text-label">
          {icon && <Icon name={icon} size={18} className="text-primary" />}
          {title}
        </h2>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

/**
 * Detalle de un servicio del panel del proveedor (/panel/servicio?id=):
 * servicio, cotización, indicaciones y datos del cliente. Aquí se acepta una solicitud pendiente.
 */
export function ServiceDetailView() {
  const session = getSession();
  const isProvider = session?.user.accountType === 'proveedor';
  // Sube al aceptar, para volver a leer la solicitud con su nuevo estado.
  const [, setVersion] = useState(0);

  useEffect(() => {
    if (!isProvider) window.location.assign('/login');
  }, [isProvider]);

  if (!session || !isProvider) return null;

  // API: GET /api/tenant/requests/{id}. Mientras tanto, se busca entre las del panel.
  const id = new URLSearchParams(window.location.search).get('id');
  const request = requestsForProvider(session.user).find((r) => r.id === id);

  function accept() {
    if (!request) return;
    setRequestStatus(request.id, 'aceptada');
    setVersion((v) => v + 1);
  }

  return (
    <div className="min-h-svh">
      <AppNavbar />
      <main className="mx-auto flex max-w-[1100px] flex-col gap-6 px-6 py-8">
        <a href="/panel" className="inline-flex items-center gap-1 self-start text-label text-primary no-underline">
          <Icon name="arrow_back" size={18} />
          Clientes y servicios
        </a>

        {!request ? (
          <p className="rounded-lg border border-line bg-surface-raised p-8 text-center text-body text-ink-muted">
            No encontramos este servicio.
          </p>
        ) : (
          <>
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={request.client.name} isGroup={request.client.kind !== 'persona'} size={48} />
                <div className="flex min-w-0 flex-col">
                  <h1 className="text-title break-words">{request.client.name}</h1>
                  <span className="text-body-sm text-ink-muted">Solicitud recibida el {formatDate(request.createdAt)}</span>
                </div>
              </div>
              <StatusBadge status={request.status} />
            </header>

            <div className="grid items-start gap-4 md:grid-cols-[1.6fr_1fr]">
              <div className="flex flex-col gap-4">
                <DetailBlock icon="cleaning_services" title="Servicio">
                  <dl className="m-0 grid grid-cols-2 gap-4 text-body-sm">
                    <div>
                      <dt className="text-caption text-ink-muted">Fecha</dt>
                      <dd className="m-0 first-letter:uppercase">
                        {formatDate(request.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-caption text-ink-muted">Tipo de limpieza</dt>
                      <dd className="m-0">{request.lines.map((l) => l.label).join(' + ')}</dd>
                    </div>
                    <div>
                      <dt className="text-caption text-ink-muted">Espacio</dt>
                      <dd className="m-0">{spaceTypeLabel(request.spaceType)}</dd>
                    </div>
                    <div>
                      <dt className="text-caption text-ink-muted">Superficie</dt>
                      <dd className="m-0">{request.m2} m²</dd>
                    </div>
                  </dl>
                </DetailBlock>

                <DetailBlock icon="request_quote" title="Cotización">
                  <table className="w-full border-collapse text-body-sm">
                    <thead>
                      <tr className="border-b border-line text-left text-caption text-ink-muted">
                        <th className="py-2 font-medium">Concepto</th>
                        <th className="py-2 font-medium">Cálculo</th>
                        <th className="py-2 text-right font-medium">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {request.lines.map((l) => (
                        <tr key={l.serviceId} className="border-b border-line">
                          <td className="py-2">{l.label}</td>
                          <td className="py-2 text-ink-muted">
                            {l.m2} m² × {formatMoney(l.pricePerM2)}
                            {l.factor !== 1 && ` × ${l.factor}`}
                          </td>
                          <td className="py-2 text-right">{formatMoney(l.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="text-body font-bold">
                        <td colSpan={2} className="pt-3">
                          Total
                        </td>
                        <td className="pt-3 text-right text-primary">{formatMoney(request.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </DetailBlock>

                {request.notes && (
                  <DetailBlock icon="sticky_note_2" title="Indicaciones del cliente">
                    <p className="m-0 text-body-sm">{request.notes}</p>
                  </DetailBlock>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <DetailBlock icon={clientKindIcons[request.client.kind]} title="Cliente">
                  <div className="flex flex-col gap-3">
                    <dl className="m-0 flex flex-col gap-3 text-body-sm">
                      <div>
                        <dt className="text-caption text-ink-muted">Tipo de cliente</dt>
                        <dd className="m-0 mt-1">
                          <Badge tone={request.client.kind === 'persona' ? 'persona' : 'grupo'}>
                            {clientKindLabels[request.client.kind]}
                          </Badge>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-caption text-ink-muted">Contacto</dt>
                        <dd className="m-0">{request.client.contact}</dd>
                      </div>
                    </dl>
                    <div className="flex flex-col gap-1 border-t border-line pt-3 text-body-sm">
                      <a href={`mailto:${request.client.email}`} className="inline-flex items-center gap-2 py-1 break-all text-ink no-underline hover:text-primary">
                        <Icon name="mail" size={18} className="text-ink-muted" />
                        {request.client.email}
                      </a>
                      {request.client.phone && (
                        <a href={`tel:${request.client.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 py-1 text-ink no-underline hover:text-primary">
                          <Icon name="call" size={18} className="text-ink-muted" />
                          {request.client.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </DetailBlock>

                {request.status === 'pendiente' && (
                  <DetailBlock>
                    <div className="flex flex-col gap-2">
                      <Button icon="check" onClick={accept}>
                        Aceptar solicitud
                      </Button>
                      <span className="text-center text-caption text-ink-muted">El cliente verá la solicitud como aceptada.</span>
                    </div>
                  </DetailBlock>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
