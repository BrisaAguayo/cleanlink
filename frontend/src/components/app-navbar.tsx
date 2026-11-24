import { useEffect, useRef, useState } from 'react';
import { clearSession, getSession, homeFor } from '../session/session';
import type { AccountType } from '../types/tenant';
import { Avatar } from './avatar';
import { Badge } from './badge';
import { Button } from './button';
import { Icon } from './icon';
import { Logo } from './logo';
import { NavbarPopover } from './navbar-popover';

type Panel = 'notificaciones' | 'perfil' | 'menu';

const accountLabels: Record<AccountType, string> = {
  cliente: 'Cliente',
  proveedor: 'Proveedor',
  admin: 'Admin de plataforma',
};

type MenuLink = { label: string; href: string; icon: string };

/** Enlaces del menú según el tipo de cuenta. */
function menuLinks(accountType: AccountType | null): MenuLink[] {
  const explore = { label: 'Buscar limpieza', href: '/resultados', icon: 'search' };
  const howItWorks = { label: 'Cómo funciona', href: '/#como-funciona', icon: 'help' };
  switch (accountType) {
    case 'cliente':
      return [{ label: 'Inicio', href: '/feed', icon: 'home' }, explore, howItWorks];
    case 'proveedor':
      return [{ label: 'Mi negocio', href: '/mi-negocio', icon: 'storefront' }, explore, howItWorks];
    case 'admin':
      return [{ label: 'Panel de CleanLink', href: '/admin', icon: 'shield_person' }, explore];
    default:
      return [{ label: 'Inicio', href: '/', icon: 'home' }, explore, howItWorks];
  }
}

const linkClasses =
  'flex items-center gap-3 rounded-md px-3 py-2.5 text-label text-ink no-underline transition-colors hover:bg-surface-tint';

/**
 * Barra de navegación dentro de la plataforma (con sesión).
 * - Logo: lleva al inicio de la cuenta (feed, mi negocio o panel), no a la landing.
 * - Notificaciones, perfil y menú abren un panel informativo; solo uno a la vez.
 */
export function AppNavbar() {
  const session = getSession();
  const user = session?.user ?? null;
  const [open, setOpen] = useState<Panel | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Cierra el panel al hacer clic fuera o con Escape.
  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(null);
    }
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function toggle(panel: Panel) {
    setOpen(open === panel ? null : panel);
  }

  function logout() {
    clearSession();
    window.location.assign('/login');
  }

  return (
    <header className="border-b border-line bg-surface-raised">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-3">
        <Logo href={user ? homeFor(user) : '/'} />
        <div ref={ref} className="flex items-center gap-2">
          <NavbarPopover
            icon="notifications"
            label="Notificaciones"
            open={open === 'notificaciones'}
            onToggle={() => toggle('notificaciones')}
          >
            <h2 className="text-body font-semibold">Notificaciones</h2>
            <div className="flex flex-col items-center gap-2 rounded-md bg-surface-tint px-4 py-6 text-center">
              <Icon name="notifications_off" size={28} className="text-ink-muted" />
              <p className="text-body-sm font-semibold">No tienes notificaciones</p>
              <p className="text-caption text-ink-muted">Aquí verás las solicitudes y los avisos de tu cuenta.</p>
            </div>
          </NavbarPopover>

          <NavbarPopover icon="person" label="Mi perfil" open={open === 'perfil'} onToggle={() => toggle('perfil')}>
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-body font-semibold">{user.name}</span>
                    <span className="truncate text-caption text-ink-muted">{user.email}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="persona" icon="badge">
                    {accountLabels[user.accountType]}
                  </Badge>
                </div>
                <div className="flex flex-col border-t border-line pt-3">
                  <a href={homeFor(user)} className={linkClasses}>
                    <Icon name="home" className="text-primary" />
                    Ir a mi inicio
                  </a>
                  <button type="button" onClick={logout} className={`${linkClasses} cursor-pointer text-left`}>
                    <Icon name="logout" className="text-primary" />
                    Cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  <span className="text-body font-semibold">No has iniciado sesión</span>
                  <span className="text-body-sm text-ink-muted">Entra para contratar servicios y ver tu historial.</span>
                </div>
                <div className="flex flex-col gap-2">
                  <Button href="/login">Iniciar sesión</Button>
                  <Button variant="outline" href="/registro">
                    Crear cuenta
                  </Button>
                </div>
              </>
            )}
          </NavbarPopover>

          <NavbarPopover icon="menu" label="Menú" open={open === 'menu'} onToggle={() => toggle('menu')}>
            <nav aria-label="Menú" className="flex flex-col">
              {menuLinks(user?.accountType ?? null).map((link) => (
                <a key={link.href} href={link.href} className={linkClasses}>
                  <Icon name={link.icon} className="text-primary" />
                  {link.label}
                </a>
              ))}
            </nav>
          </NavbarPopover>
        </div>
      </div>
    </header>
  );
}
