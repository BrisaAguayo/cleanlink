// Tipos de espacio. Mismos ids que core.TipoEspacio (backend/database/migrations/002_catalogos.sql).
// API: GET /api/space-types cuando el perfil público lea los datos del backend.
export type SpaceTypeId = 'casa' | 'departamento' | 'oficina' | 'local' | 'escuela' | 'consultorio' | 'bodega' | 'vacacional';

export const spaceTypes: { id: SpaceTypeId; label: string }[] = [
  { id: 'casa', label: 'Casa' },
  { id: 'departamento', label: 'Departamento' },
  { id: 'oficina', label: 'Oficina' },
  { id: 'local', label: 'Local comercial' },
  { id: 'escuela', label: 'Escuela o universidad' },
  { id: 'consultorio', label: 'Consultorio o clínica' },
  { id: 'bodega', label: 'Bodega o nave industrial' },
  { id: 'vacacional', label: 'Renta vacacional' },
];

export function spaceTypeLabel(id: SpaceTypeId) {
  return spaceTypes.find((s) => s.id === id)?.label ?? id;
}
