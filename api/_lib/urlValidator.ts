const FORBIDDEN_SCHEMES = ["javascript:", "data:", "file:"];

export function isValidHttpUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }
    const lower = raw.trim().toLowerCase();
    if (FORBIDDEN_SCHEMES.some((scheme) => lower.startsWith(scheme))) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

