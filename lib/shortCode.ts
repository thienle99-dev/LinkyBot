const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateShortCode(length = 7): string {
  let result = "";
  const max = ALPHABET.length;
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * max);
    result += ALPHABET[idx];
  }
  return result;
}
