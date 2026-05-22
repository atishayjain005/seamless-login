import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import clsx from "clsx";
import { useCountries } from "../hooks/useCountries";
import type { Country } from "../hooks/useCountries";

interface CountrySelectProps {
  dialCode: string;
  flag: string;
  onSelect: (country: Country) => void;
}

// Searchable country-code dropdown populated from the RestCountries API.
export function CountrySelect({ dialCode, flag, onSelect }: CountrySelectProps) {
  const { countries, loading } = useCountries();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(q) || country.dialCode.includes(q),
    );
  }, [countries, query]);

  const handleSelect = (country: Country) => {
    onSelect(country);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-[60px] cursor-pointer items-center gap-2 rounded-xl border border-line bg-white pl-4 pr-3 shadow-card transition hover:border-line-strong"
      >
        <span className="text-xl leading-none">{flag}</span>
        <span className="text-base font-medium text-navy">{dialCode}</span>
        <ChevronDown
          size={18}
          strokeWidth={2}
          className={clsx(
            "text-label transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[68px] z-20 w-[min(320px,calc(100vw-2.5rem))] overflow-hidden rounded-xl border border-line bg-white shadow-card-hover">
          <div className="flex items-center gap-2 border-b border-line px-3.5">
            <Search size={16} className="shrink-0 text-label" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search country or code"
              className="h-11 flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-placeholder"
            />
          </div>

          <ul className="max-h-[260px] overflow-y-auto py-1" role="listbox">
            {loading && (
              <li className="px-4 py-3 text-sm text-label">
                Loading countries…
              </li>
            )}
            {!loading && filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-label">No matches found</li>
            )}
            {filtered.map((country) => (
              <li key={country.code}>
                <button
                  type="button"
                  onClick={() => handleSelect(country)}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-brand-tint"
                >
                  <span className="text-lg leading-none">{country.flag}</span>
                  <span className="flex-1 truncate text-sm text-navy">
                    {country.name}
                  </span>
                  <span className="text-sm font-medium text-label">
                    {country.dialCode}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
