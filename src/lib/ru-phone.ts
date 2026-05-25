export const PHONE_MASK_PREFIX = "+7 (";
export const NATIONAL_PHONE_LENGTH = 10;

export function getNationalPhoneDigits(value: string) {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  }

  if (digits.startsWith("7")) {
    digits = digits.slice(1);
  }

  return digits.slice(0, NATIONAL_PHONE_LENGTH);
}

export function formatRuPhoneMask(nationalDigits: string) {
  if (!nationalDigits.length) return "";

  let formatted = PHONE_MASK_PREFIX + nationalDigits.slice(0, 3);

  if (nationalDigits.length < 3) return formatted;

  formatted += ")";

  if (nationalDigits.length > 3) {
    formatted += ` ${nationalDigits.slice(3, 6)}`;
  }

  if (nationalDigits.length > 6) {
    formatted += `-${nationalDigits.slice(6, 8)}`;
  }

  if (nationalDigits.length > 8) {
    formatted += `-${nationalDigits.slice(8, 10)}`;
  }

  return formatted;
}

export function applyPhoneMask(prevPhone: string, nextRaw: string) {
  const prevDigits = getNationalPhoneDigits(prevPhone);
  const nextDigits = getNationalPhoneDigits(nextRaw);

  if (
    nextRaw.length < prevPhone.length &&
    nextDigits.length === prevDigits.length &&
    prevDigits.length > 0
  ) {
    return formatRuPhoneMask(prevDigits.slice(0, -1));
  }

  return formatRuPhoneMask(nextDigits);
}

export function validatePhone(value: string) {
  const nationalDigits = getNationalPhoneDigits(value);
  if (nationalDigits.length < NATIONAL_PHONE_LENGTH) {
    return "Введите номер полностью";
  }
  return null;
}

export function isPhoneMaskEmpty(value: string) {
  return getNationalPhoneDigits(value).length === 0;
}
