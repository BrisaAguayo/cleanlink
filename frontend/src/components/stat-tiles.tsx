import { Icon } from './icon';

export type StatTile = { label: string; value: string; icon: string };

/** Fila de cifras de resumen para los paneles. */
export function StatTiles({ tiles }: { tiles: StatTile[] }) {
  return (
    <dl className="m-0 grid grid-cols-2 gap-4 md:grid-cols-4">
      {tiles.map((t) => (
        <div key={t.label} className="flex flex-col gap-2 rounded-md border border-line bg-surface-raised p-4">
          <dt className="flex items-center gap-2 text-caption text-ink-muted">
            <span className="flex size-7 items-center justify-center rounded-sm bg-surface-tint text-primary">
              <Icon name={t.icon} size={16} />
            </span>
            {t.label}
          </dt>
          <dd className="m-0 text-heading font-bold">{t.value}</dd>
        </div>
      ))}
    </dl>
  );
}
