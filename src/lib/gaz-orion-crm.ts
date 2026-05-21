export const GAZ_ORION_TARGET_SITE = "DEVORI" as const;

export const GAZ_ORION_CONTACT_METHODS = [
  "PHONE",
  "WHATSAPP",
  "TELEGRAM",
  "MAX",
] as const;

export type GazOrionContactMethod = (typeof GAZ_ORION_CONTACT_METHODS)[number];

export type GazOrionRequestPayload = {
  full_name: string;
  phone: string;
  preferred_contact_method: GazOrionContactMethod;
  target_site: typeof GAZ_ORION_TARGET_SITE;
  source: string;
  website?: string;
  page_url?: string;
  message?: string;
  meta?: Record<string, string>;
};

export type GazOrionRequestSuccess = {
  success: true;
  id: string;
  created_at: string;
  target_site: string;
  preferred_contact_method: string;
};

const DEFAULT_API_URL = "https://gaz-orion.ru/api/public/requests";

export function getGazOrionApiUrl() {
  return process.env.GAZ_ORION_API_URL?.trim() || DEFAULT_API_URL;
}

export function getGazOrionApiKey() {
  return process.env.GAZ_ORION_API_KEY?.trim() ?? "";
}

export function formatPhoneForApi(maskedOrRawPhone: string) {
  let digits = maskedOrRawPhone.replace(/\D/g, "");

  if (digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  }

  if (digits.startsWith("7")) {
    digits = digits.slice(1);
  }

  return `+7${digits.slice(0, 10)}`;
}

export function isGazOrionContactMethod(value: string): value is GazOrionContactMethod {
  return (GAZ_ORION_CONTACT_METHODS as readonly string[]).includes(value);
}

export async function submitGazOrionRequest(payload: GazOrionRequestPayload) {
  const apiKey = getGazOrionApiKey();
  if (!apiKey) {
    throw new Error("GAZ_ORION_API_KEY is not configured");
  }

  const response = await fetch(getGazOrionApiUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : `CRM API error (${response.status})`;

    throw new Error(message);
  }

  return data as GazOrionRequestSuccess;
}
