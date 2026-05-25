import type { ProjectTypeId } from "@/components/ui/contact-modal-project-type";
import { getNationalPhoneDigits, NATIONAL_PHONE_LENGTH } from "@/lib/ru-phone";

export const PROJECT_TYPE_LABELS: Record<ProjectTypeId, string> = {
  development: "Разработка",
  support: "Техническая поддержка",
  outstaff: "Аутстафф",
};

export type RequestKind = "contact" | "callback";

export type ContactRequestBody = {
  full_name: string;
  phone: string;
  project_types: ProjectTypeId[];
  page_url?: string;
  preferred_contact_method?: "PHONE" | "WHATSAPP" | "TELEGRAM" | "MAX";
};

export type CallbackRequestBody = {
  phone: string;
  page_url?: string;
};

type SiteRequestPayload = {
  kind: RequestKind;
  phone: string;
  full_name?: string;
  project_types?: ProjectTypeId[];
  page_url?: string;
  preferred_contact_method?: ContactRequestBody["preferred_contact_method"];
};

export function formatProjectTypesMessage(types: ProjectTypeId[]) {
  return types.map((id) => PROJECT_TYPE_LABELS[id]).join(", ");
}

function parseApiError(data: unknown, fallback: string) {
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof (data as { error: unknown }).error === "string"
  ) {
    return (data as { error: string }).error;
  }

  return fallback;
}

async function postSiteRequest(payload: SiteRequestPayload) {
  const response = await fetch("/api/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      page_url: payload.page_url ?? (typeof window !== "undefined" ? window.location.href : undefined),
    }),
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(parseApiError(data, "Не удалось отправить заявку. Попробуйте позже."));
  }

  return data;
}

export function isPhoneComplete(phone: string) {
  return getNationalPhoneDigits(phone).length >= NATIONAL_PHONE_LENGTH;
}

export async function submitContactRequest(payload: ContactRequestBody) {
  return postSiteRequest({
    kind: "contact",
    full_name: payload.full_name,
    phone: payload.phone,
    project_types: payload.project_types,
    preferred_contact_method: payload.preferred_contact_method ?? "PHONE",
    page_url: payload.page_url,
  });
}

export async function submitCallbackRequest(payload: CallbackRequestBody) {
  return postSiteRequest({
    kind: "callback",
    phone: payload.phone,
    preferred_contact_method: "PHONE",
    page_url: payload.page_url,
  });
}
