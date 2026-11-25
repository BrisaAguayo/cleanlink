import { useState, type ReactNode } from 'react';
import { mockListings } from '../data/mock-listings';
import { providerKindLabels } from '../data/provider-kinds';
import { formatSchedule } from '../data/schedule';
import { services } from '../data/services';
import { getSession, isProviderBrowsing } from '../session/session';
import type { ProviderListing } from '../types/provider';
import { AppNavbar } from './app-navbar';
import { Avatar } from './avatar';
import { Badge } from './badge';
import { Button } from './button';
import { Card } from './card';
import { Icon } from './icon';
import { Rating } from './rating';

// Regla 3 de ANOTACIONES.txt: en el perfil la ubicación es SOLO ciudad y estado, nunca la colonia.
// Los datos de prueba solo traen la colonia (todas son de Tijuana).
// API: tomar city y state de GET /api/providers/{id}.
const LOCATION = 'Tijuana, Baja California';

/** Personas que atienden, en texto. */
function teamLabel(provider: ProviderListing) {
  if (provider.kind === 'persona' || !provider.teamSize) return '1 persona';
  return `${provider.teamSize} personas`;
}

/** Fila de la ficha de información: icono, etiqueta y valor. */
function InfoRow({ icon, label, children }: { icon: string; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-9 flex-none items-center justify-center rounded-md bg-surface-tint text-primary">
        <Icon name={icon} size={18} />
      </span>
      <div className="flex min-w-0 flex-col">
        <dt className="text-caption text-ink-muted">{label}</dt>
        <dd className="m-0 text-body-sm font-semibold">{children}</dd>
      </div>
    </div>
  );
}

/**
 * Acción para contratar.
 * - Sin sesión: lleva a iniciar sesión (regla 1 de ANOTACIONES.txt).
 * - Proveedor navegando: deshabilitada; solo puede ver la información.
 * - Cliente: el flujo de solicitud aún no existe, así que se avisa en pantalla.
 */
function HireAction() {
  const [notice, setNotice] = useState(false);
  const session = getSession();

  if (!session) {
    return (
      <div className="flex flex-col gap-2">
        <Button href="/login" size="lg" icon="event_available">
          Solicitar servicio
        </Button>
        <p className="text-caption text-ink-muted">Inicia sesión para contratar.</p>
      </div>
    );
  }

  if (isProviderBrowsing()) {
    return (
      <div className="flex flex-col gap-2">
        <Button size="lg" icon="event_available" disabled aria-describedby="aviso-proveedor">
          Solicitar servicio
        </Button>
        <p id="aviso-proveedor" className="flex items-start gap-1 text-caption text-ink-muted">
          <Icon name="info" size={14} className="mt-px flex-none" />
          Estás navegando como proveedor: puedes ver la información, pero no contratar servicios.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button size="lg" icon="event_available" onClick={() => setNotice(true)}>
        Solicitar servicio
      </Button>
      {notice && (
        <p role="status" className="text-caption text-ink-muted">
          Muy pronto podrás enviar tu solicitud desde aquí.
        </p>
      )}
    </div>
  );
}

/** Perfil público de un proveedor (/proveedor?id=), al que lleva "Ver perfil" en los resultados. */
export function ProviderProfileView() {
  const id = new URLSearchParams(window.location.search).get('id');
  // API: GET /api/providers/{id}. Mientras tanto se toma de los datos de prueba.
  const provider = mockListings.find((p) => p.id === id);

  return (
    <div className="min-h-svh">
      <AppNavbar />
      <main className="mx-auto flex max-w-[1100px] flex-col gap-6 px-6 py-8">
        <a href="/resultados" className="inline-flex items-center gap-1 self-start text-label text-primary no-underline">
          <Icon name="arrow_back" size={18} />
          Volver a resultados
        </a>

        {provider ? <ProviderProfile provider={provider} /> : <NotFound />}
      </main>
    </div>
  );
}

function NotFound() {
  return (
    <Card padding="lg" className="items-center text-center">
      <Icon name="person_search" size={32} className="text-ink-muted" />
      <h1 className="text-heading">No encontramos a este proveedor</h1>
      <p className="text-body-sm text-ink-muted">Puede que el enlace esté incompleto o que el perfil ya no exista.</p>
      <Button href="/resultados" variant="outline">
        Ver todos los proveedores
      </Button>
    </Card>
  );
}

function ProviderProfile({ provider }: { provider: ProviderListing }) {
  const isGroup = provider.kind !== 'persona';
  const featured = services.filter((s) => provider.featuredServices.includes(s.id));
  const others = services.filter((s) => provider.services.includes(s.id) && !provider.featuredServices.includes(s.id));

  return (
    <>
      <Card as="section" padding="lg" elevation="raised" aria-labelledby="nombre-proveedor">
        <div className="flex flex-wrap items-center gap-6">
          <Avatar name={provider.name} isGroup={isGroup} size={96} />
          <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={isGroup ? 'grupo' : 'persona'}>{providerKindLabels[provider.kind]}</Badge>
              {provider.verified ? (
                <Badge tone="success" icon="verified">
                  Verificado
                </Badge>
              ) : (
                <Badge tone="warning">Sin verificar</Badge>
              )}
            </div>
            <h1 id="nombre-proveedor" className="text-title break-words">
              {provider.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-body-sm text-ink-muted">
              <Rating value={provider.rating} reviews={provider.reviews} />
              <span className="inline-flex items-center gap-1">
                <Icon name="location_on" size={16} />
                {LOCATION}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-6">
          <Card as="section" padding="lg" elevation="raised" aria-labelledby="servicios">
            <div className="flex flex-col gap-1">
              <h2 id="servicios" className="text-heading">
                Servicios que ofrece
              </h2>
              <p className="text-body-sm text-ink-muted">
                {provider.services.length} {provider.services.length === 1 ? 'servicio' : 'servicios'} en total.
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {featured.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-primary bg-primary-soft px-4 py-3"
                >
                  <span className="flex items-center gap-2 text-label text-on-primary-soft">
                    <Icon name="star" size={18} filled />
                    {s.label}
                  </span>
                  <span className="text-caption font-semibold text-on-primary-soft">Destacado</span>
                </li>
              ))}
              {others.map((s) => (
                <li key={s.id} className="flex items-center gap-2 rounded-md border border-line px-4 py-3 text-label">
                  <Icon name="check_circle" size={18} className="text-primary" />
                  {s.label}
                </li>
              ))}
            </ul>
          </Card>

          <Card as="section" padding="lg" elevation="raised" aria-labelledby="resenas">
            <h2 id="resenas" className="text-heading">
              Reseñas
            </h2>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[40px] leading-[48px] font-bold">{provider.rating.toFixed(1)}</span>
                <span className="text-caption text-ink-muted">de 5</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="inline-flex gap-0.5" role="img" aria-label={`${provider.rating.toFixed(1)} de 5 estrellas`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      name="star"
                      size={20}
                      filled={star <= Math.round(provider.rating)}
                      className={star <= Math.round(provider.rating) ? 'text-warning' : 'text-line'}
                    />
                  ))}
                </span>
                <span className="text-body-sm text-ink-muted">Basado en {provider.reviews} reseñas de clientes</span>
              </div>
            </div>
          </Card>
        </div>

        <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-6 md:sticky md:top-6">
          <Card padding="lg" elevation="raised" aria-labelledby="contratar">
            <h2 id="contratar" className="text-heading">
              Contratar
            </h2>
            <HireAction />
          </Card>

          <Card padding="lg" elevation="raised" aria-labelledby="informacion">
            <h2 id="informacion" className="text-heading">
              Información
            </h2>
            <dl className="m-0 flex flex-col gap-4">
              <InfoRow icon={isGroup ? 'groups' : 'person'} label="Tipo de proveedor">
                {providerKindLabels[provider.kind]}
              </InfoRow>
              <InfoRow icon="badge" label="Personas que atienden">
                {teamLabel(provider)}
              </InfoRow>
              <InfoRow icon="schedule" label="Horario de atención">
                {formatSchedule(provider.schedule)}
              </InfoRow>
              <InfoRow icon="location_on" label="Ubicación">
                {LOCATION}
              </InfoRow>
              <InfoRow icon={provider.verified ? 'verified' : 'pending'} label="Verificación">
                {provider.verified ? 'Cuenta verificada' : 'Aún sin verificar'}
              </InfoRow>
            </dl>
          </Card>
        </aside>
      </div>
    </>
  );
}
