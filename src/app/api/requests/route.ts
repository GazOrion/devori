import { NextResponse } from "next/server";

import type { ProjectTypeId } from "@/components/ui/contact-modal-project-type";
import {
  GAZ_ORION_TARGET_SITE,
  formatPhoneForApi,
  isGazOrionContactMethod,
  submitGazOrionRequest,
  type GazOrionContactMethod,
} from "@/lib/gaz-orion-crm";
import { PROJECT_TYPE_LABELS, formatProjectTypesMessage } from "@/lib/contact-request";

function parseProjectTypes(value: unknown): ProjectTypeId[] | null {
  if (Array.isArray(value)) {
    const types = value.filter(
      (item): item is ProjectTypeId =>
        typeof item === "string" && item in PROJECT_TYPE_LABELS,
    );
    return types.length > 0 ? types : null;
  }

  if (typeof value === "string" && value in PROJECT_TYPE_LABELS) {
    return [value as ProjectTypeId];
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
    }

    const {
      full_name: fullName,
      phone,
      project_types: projectTypesRaw,
      project_type: projectTypeLegacy,
      page_url: pageUrl,
      preferred_contact_method: preferredContactMethod,
    } = body as Record<string, unknown>;

    if (typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json({ error: "Укажите имя" }, { status: 400 });
    }

    if (typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json({ error: "Укажите телефон" }, { status: 400 });
    }

    const projectTypes =
      parseProjectTypes(projectTypesRaw) ?? parseProjectTypes(projectTypeLegacy);

    if (!projectTypes) {
      return NextResponse.json({ error: "Выберите тип проекта" }, { status: 400 });
    }

    const contactMethod: GazOrionContactMethod =
      typeof preferredContactMethod === "string" &&
      isGazOrionContactMethod(preferredContactMethod)
        ? preferredContactMethod
        : "PHONE";

    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") ?? "https";
    const website = host ? `${protocol}://${host}` : undefined;

    const result = await submitGazOrionRequest({
      full_name: fullName.trim(),
      phone: formatPhoneForApi(phone),
      preferred_contact_method: contactMethod,
      target_site: GAZ_ORION_TARGET_SITE,
      source: "Форма заявки на сайте Devori",
      website,
      page_url: typeof pageUrl === "string" ? pageUrl : undefined,
      message: `Тип проекта: ${formatProjectTypesMessage(projectTypes)}`,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось отправить заявку";

    if (message.includes("GAZ_ORION_API_KEY")) {
      return NextResponse.json({ error: "Сервис заявок временно недоступен" }, { status: 503 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
