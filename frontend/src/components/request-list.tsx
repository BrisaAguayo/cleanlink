import { useState } from 'react';
import { statusLabels, type RequestStatus, type ServiceRequest } from '../data/service-requests';
import { Chip } from './chip';
import { RequestCard } from './request-card';

type Filter = 'todos' | RequestStatus;

const filters: Filter[] = ['todos', 'pendiente', 'aceptada', 'finalizada'];

type RequestListProps = {
  requests: ServiceRequest[];
  viewer: 'proveedor' | 'cliente';
  emptyText: string;
  onAccept?: (id: string) => void;
};

/** Lista de solicitudes con filtro por estado. */
export function RequestList({ requests, viewer, emptyText, onAccept }: RequestListProps) {
  const [filter, setFilter] = useState<Filter>('todos');
  const visible = filter === 'todos' ? requests : requests.filter((r) => r.status === filter);

  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Chip key={f} variant="solid" selected={filter === f} onClick={() => setFilter(f)}>
            {f === 'todos' ? 'Todos' : statusLabels[f]} ({f === 'todos' ? requests.length : requests.filter((r) => r.status === f).length})
          </Chip>
        ))}
      </div>

      {visible.length > 0 ? (
        <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2">
          {visible.map((request) => (
            <li key={request.id}>
              <RequestCard request={request} viewer={viewer} onAccept={onAccept} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-line bg-surface-raised p-8 text-center text-body-sm text-ink-muted">
          {emptyText}
        </p>
      )}
    </div>
  );
}
