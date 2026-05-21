import type { ProjectTypeId } from "@/components/ui/contact-modal-project-type";

export const PROJECT_TYPE_LABELS: Record<ProjectTypeId, string> = {
  development: "Разработка",
  support: "Техническая поддержка",
  outstaff: "Аутстафф",
};

export type ContactRequestBody = {
  full_name: string;
  phone: string;
  project_types: ProjectTypeId[];
  page_url?: string;
  preferred_contact_method?: "PHONE" | "WHATSAPP" | "TELEGRAM" | "MAX";
};

export function formatProjectTypesMessage(types: ProjectTypeId[]) {
  return types.map((id) => PROJECT_TYPE_LABELS[id]).join(", ");
}

export async function submitContactRequest(payload: ContactRequestBody) {
  const response = await fetch("/api/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      preferred_contact_method: payload.preferred_contact_method ?? "PHONE",
      page_url: payload.page_url ?? (typeof window !== "undefined" ? window.location.href : undefined),
    }),
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : "Не удалось отправить заявку. Попробуйте позже.";

    throw new Error(message);
  }

  return data;
}
