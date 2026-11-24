import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { normalize } from '../data/search';
import { Icon } from './icon';

type ZoneInputProps = {
  /** Lugares sugeridos (colonias); también se acepta texto libre. */
  options: string[];
  /** Nombre del campo en el formulario. */
  name: string;
  placeholder: string;
  /** Título de la lista de sugerencias. */
  listTitle: string;
};

/**
 * Campo de lugar con sugerencias (combobox): la lista se filtra mientras se escribe,
 * sin importar mayúsculas ni acentos. Teclado: flechas para moverse, Enter elige, Escape cierra.
 */
export function ZoneInput({ options, name, placeholder, listTitle }: ZoneInputProps) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const listRef = useRef<HTMLUListElement>(null);

  const matches = options.filter((option) => normalize(option).includes(normalize(value)));
  const showList = open && matches.length > 0;

  // Mantiene visible la opción activa al moverse con el teclado.
  useEffect(() => {
    if (active >= 0) listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  function choose(option: string) {
    setValue(option);
    setOpen(false);
    setActive(-1);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && showList && active >= 0) {
      // Elige la sugerencia en vez de enviar el formulario.
      e.preventDefault();
      choose(matches[active]);
    } else if (e.key === 'Escape' && showList) {
      e.preventDefault();
      setOpen(false);
      setActive(-1);
    }
  }

  return (
    <div className="relative flex min-h-12 flex-[1_1_160px] border-line sm:border-l">
      <label className="flex flex-1 items-center gap-2 px-3">
        <Icon name="location_on" className="text-ink-muted" />
        <span className="sr-only">Zona</span>
        <input
          name={name}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
          className="min-w-0 flex-1 bg-transparent text-body text-ink outline-none placeholder:text-ink-muted"
        />
      </label>

      {showList && (
        <div className="absolute top-full right-0 left-0 z-20 mt-3 overflow-hidden rounded-lg border border-line bg-surface-raised shadow-md">
          <p className="px-4 pt-3 pb-1 text-caption text-ink-muted">{listTitle}</p>
          <ul ref={listRef} id={listId} role="listbox" aria-label={listTitle} className="max-h-64 overflow-y-auto p-2">
            {matches.map((option, index) => (
              <li
                key={option}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === active}
                // mousedown en vez de click: así el campo no pierde el foco antes de elegir.
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(option);
                }}
                onMouseEnter={() => setActive(index)}
                className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-body ${
                  index === active ? 'bg-surface-tint text-primary' : 'text-ink'
                }`}
              >
                <Icon name="location_on" size={18} className={index === active ? 'text-primary' : 'text-ink-muted'} />
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
