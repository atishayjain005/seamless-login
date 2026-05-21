import { useEffect, useState } from "react";

export interface Country {
  /** ISO 3166-1 alpha-2 code, e.g. "IN". */
  code: string;
  name: string;
  /** International dial code, e.g. "+91". */
  dialCode: string;
  /** Flag emoji. */
  flag: string;
}

interface RawCountry {
  name?: { common?: string };
  idd?: { root?: string; suffixes?: string[] };
  cca2?: string;
  flag?: string;
}

const ENDPOINT =
  "https://restcountries.com/v3.1/all?fields=name,idd,cca2,flag";

/** A small offline fallback so the dropdown still works if the API is down. */
const FALLBACK: Country[] = [
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪" },
  { code: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
];

function toCountry(raw: RawCountry): Country | null {
  const root = raw.idd?.root;
  const name = raw.name?.common;
  const code = raw.cca2;
  if (!root || !name || !code) return null;

  const suffixes = raw.idd?.suffixes ?? [];
  // One suffix → a full dial code (e.g. +9 + 1). Many/none → the root is it.
  const dialCode = suffixes.length === 1 ? `${root}${suffixes[0]}` : root;

  return { code, name, dialCode, flag: raw.flag ?? "🏳️" };
}

interface CountriesState {
  countries: Country[];
  loading: boolean;
  error: string | null;
}

/** Loads the full country list (flag, name, dial code) from RestCountries. */
export function useCountries(): CountriesState {
  const [state, setState] = useState<CountriesState>({
    countries: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetch(ENDPOINT)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<RawCountry[]>;
      })
      .then((raw) => {
        if (cancelled) return;
        const countries = raw
          .map(toCountry)
          .filter((c): c is Country => c !== null)
          .sort((a, b) => a.name.localeCompare(b.name));
        setState({ countries, loading: false, error: null });
      })
      .catch(() => {
        if (cancelled) return;
        setState({
          countries: FALLBACK,
          loading: false,
          error: "Live country list unavailable — showing a short fallback.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
