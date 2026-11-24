import { useId, type ReactNode } from 'react';
import { Button } from './button';

type NavbarPopoverProps = {
  icon: string;
  /** Nombre accesible del botón y del panel. */
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
};

/**
 * Botón de icono de la barra con un panel informativo debajo.
 * Controlado por AppNavbar, que decide cuál está abierto y lo cierra al hacer clic fuera o con Escape.
 */
export function NavbarPopover({ icon, label, open, onToggle, children }: NavbarPopoverProps) {
  const panelId = useId();
  return (
    <div className="relative">
      <Button
        variant="ghost"
        icon={icon}
        aria-label={label}
        title={label}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className={open ? 'bg-surface-tint' : ''}
      />
      {open && (
        <div
          id={panelId}
          role="region"
          aria-label={label}
          className="absolute top-full right-0 z-20 mt-2 flex w-[300px] max-w-[calc(100vw-32px)] flex-col gap-4 rounded-lg border border-line bg-surface-raised p-4 shadow-md"
        >
          {children}
        </div>
      )}
    </div>
  );
}
