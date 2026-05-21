export const COOKIE_PREFERENCES_KEY = "devori-cookie-preferences";
export const COOKIE_SETTINGS_OPEN_EVENT = "devori:cookie-settings-open";
export const COOKIE_PREFERENCES_UPDATED_EVENT = "devori:cookie-preferences-updated";

export type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
};

export const ALL_COOKIE_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: true,
  marketing: true,
  preferences: true,
};

export const NECESSARY_ONLY_COOKIE_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

export function readCookiePreferences(): CookiePreferences | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CookiePreferences>;
    return {
      necessary: true,
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
      preferences: !!parsed.preferences,
    };
  } catch {
    return null;
  }
}

export function saveCookiePreferences(preferences: CookiePreferences) {
  const payload = JSON.stringify(preferences);
  window.localStorage.setItem(COOKIE_PREFERENCES_KEY, payload);
  document.cookie = `devori_cookie_preferences=${encodeURIComponent(payload)}; path=/; max-age=31536000; samesite=lax`;
  window.dispatchEvent(new CustomEvent(COOKIE_PREFERENCES_UPDATED_EVENT));
}

export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_OPEN_EVENT));
}

export function hasCookieConsent(): boolean {
  return readCookiePreferences() !== null;
}
