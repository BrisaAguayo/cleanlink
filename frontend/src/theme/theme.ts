// Tema claro u oscuro elegido por el usuario. Sin elección, sigue al sistema operativo
// (ver index.css). La elección se aplica con data-theme en <html>; index.html la aplica
// antes de pintar para que la página no parpadee.
export type Theme = 'light' | 'dark';

const KEY = 'cleanlink.theme';

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

/** Tema que se ve ahora: el elegido o, si no hay, el del sistema. */
export function currentTheme(): Theme {
  return storedTheme() ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Sin almacenamiento: el tema dura lo que la página.
  }
}
