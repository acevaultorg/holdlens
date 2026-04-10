// User profile + portfolio — localStorage-backed.
//
// v1 design: zero auth, zero backend, zero friction. The user creates a "profile"
// purely on their own device, can enter holdings, and gets cross-referenced
// against the superinvestor signals. Works completely offline once cached.
//
// v2 (later): if there's user demand, sync to Cloudflare Workers KV behind
// magic-link email auth. The localStorage shape stays the same — KV is just
// another transport.

export type Holding = {
  ticker: string;
  shares: number;
  costBasis?: number;     // total $ paid (not per-share)
  addedAt: string;        // ISO date
  note?: string;
};

export type Profile = {
  displayName: string;
  email?: string;
  createdAt: string;
  holdings: Holding[];
  preferences: {
    showAds: boolean;
    weeklyDigest: boolean;
  };
};

const KEY = "holdlens_profile_v1";
const EVENT = "holdlens:profile:update";

const DEFAULT_PROFILE: Profile = {
  displayName: "",
  createdAt: new Date().toISOString(),
  holdings: [],
  preferences: {
    showAds: true,
    weeklyDigest: false,
  },
};

export function getProfile(): Profile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      preferences: { ...DEFAULT_PROFILE.preferences, ...(parsed?.preferences || {}) },
      holdings: Array.isArray(parsed?.holdings) ? parsed.holdings : [],
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(p: Profile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
    window.dispatchEvent(new CustomEvent(EVENT, { detail: p }));
  } catch {
    // quota
  }
}

export function updateProfile(updates: Partial<Profile>): Profile {
  const current = getProfile();
  const next = { ...current, ...updates };
  saveProfile(next);
  return next;
}

export function hasProfile(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return !!localStorage.getItem(KEY);
  } catch {
    return false;
  }
}

// ---------- HOLDINGS ----------

export function addHolding(h: Holding): Profile {
  const p = getProfile();
  // If ticker already exists, replace it
  const filtered = p.holdings.filter((x) => x.ticker.toUpperCase() !== h.ticker.toUpperCase());
  filtered.push({ ...h, ticker: h.ticker.toUpperCase() });
  return updateProfile({ holdings: filtered });
}

export function removeHolding(ticker: string): Profile {
  const p = getProfile();
  const filtered = p.holdings.filter((h) => h.ticker.toUpperCase() !== ticker.toUpperCase());
  return updateProfile({ holdings: filtered });
}

export function getHolding(ticker: string): Holding | undefined {
  return getProfile().holdings.find((h) => h.ticker.toUpperCase() === ticker.toUpperCase());
}

// ---------- SUBSCRIBE ----------

export function subscribeProfile(cb: (p: Profile) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<Profile>).detail;
    cb(detail || getProfile());
  };
  window.addEventListener(EVENT, handler);
  const storageHandler = (e: StorageEvent) => {
    if (e.key === KEY) cb(getProfile());
  };
  window.addEventListener("storage", storageHandler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", storageHandler);
  };
}
