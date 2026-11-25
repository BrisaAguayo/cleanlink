import { useEffect } from 'react';
import { formatMoney } from '../data/format';
import { requestsForClient } from '../data/service-requests';
import { getSession } from '../session/session';
import { AppNavbar } from './app-navbar';
import { Button } from './button';
import { RequestList } from './request-list';
import { StatTiles } from './stat-tiles';

/** Servicios contratados por el cliente (/mis-servicios): historial y los que están en curso. */
export function ClientServicesView() {
  const session = getSession();
  const isClient = session?.user.accountType === 'cliente';

  useEffect(() => {
    if (!isClient) window.location.assign('/login');
  }, [isClient]);

  if (!session || !isClient) return null;

  // API: GET /api/requests. Mientras tanto, datos de prueba y las solicitudes hechas en este navegador.
  const requests = requestsForClient(session.user);
  const upcoming = requests.filter((r) => r.status !== 'finalizada');
  const providers = new Set(requests.map((r) => r.provider.id));
  const spent = requests.filter((r) => r.status === 'finalizada').reduce((sum, r) => sum + r.total, 0);

  return (
    <div className="min-h-svh">
      <AppNavbar />
      <main className="mx-auto flex max-w-[1100px] flex-col gap-6 px-6 py-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-title">Mis servicios</h1>
            <p className="text-body-sm text-ink-muted">Los servicios que has contratado y los que tienes por venir.</p>
          </div>
          <Button href="/resultados" icon="search">
            Contratar otro servicio
          </Button>
        </header>

        <StatTiles
          tiles={[
            { label: 'Servicios contratados', value: String(requests.length), icon: 'cleaning_services' },
            { label: 'Por venir', value: String(upcoming.length), icon: 'event_upcoming' },
            { label: 'Proveedores', value: String(providers.size), icon: 'handshake' },
            { label: 'Pagado (finalizados)', value: formatMoney(spent), icon: 'payments' },
          ]}
        />

        <RequestList requests={requests} viewer="cliente" emptyText="No tienes servicios con este estado." />
      </main>
    </div>
  );
}
