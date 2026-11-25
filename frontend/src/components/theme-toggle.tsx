import { useState } from 'react';
import { currentTheme, setTheme, type Theme } from '../theme/theme';
import { Button } from './button';

/** Botón de la barra para cambiar entre modo claro y oscuro. Recuerda la elección. */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setThemeState] = useState<Theme>(currentTheme);
  const next: Theme = theme === 'dark' ? 'light' : 'dark';
  const label = next === 'dark' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro';

  function toggle() {
    setTheme(next);
    setThemeState(next);
  }

  return (
    <Button
      variant="ghost"
      icon={theme === 'dark' ? 'light_mode' : 'dark_mode'}
      aria-label={label}
      title={label}
      onClick={toggle}
      className={className}
    />
  );
}
