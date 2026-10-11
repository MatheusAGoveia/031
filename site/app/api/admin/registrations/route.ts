import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { contacts, meetings, registrations } from "@/db/schema";
import { adminAccessError } from "@/lib/admin-auth";
import { apiError, apiJson, readJsonObject } from "@/lib/api";

const VALID_STATUSES = new Set(["received", "contacted", "confirmed", "cancelled"]);

export async function GET() {
  const denied = await adminAccessError();
  if (denied) return denied;
  try {
    const rows = await getDb().select({
      id: registrations.id,
      meetingId: registrations.meetingId,
      meetingTitle: meetings.title,
      name: contacts.name,
      contact: contacts.contact,
      status: registrations.status,
      createdAt: registrations.createdAt,
    }).from(registrations)
      .innerJoin(meetings, eq(registrations.meetingId, meetings.id))
      .innerJoin(contacts, eq(registrations.contactId, contacts.id))
      .orderBy(desc(registrations.createdAt)).limit(500);
    return apiJson({ registrations: rows });
  } catch {
    return apiError(500, "Não foi possível carregar as pré-inscrições.");
  }
}

export async function PATCH(request: Request) {
  const denied = await adminAccessError();
  if (denied) return denied;
  const body = await readJsonObject(request);
  if (body instanceof Response) return body;
  if (typeof body.id !== "string" || !body.id || body.id.length > 64 ||
      typeof body.status !== "string" || !VALID_STATUSES.has(body.status)) {
    return apiError(400, "Pré-inscrição ou estado inválido.");
  }
  try {
    const [row] = await getDb().update(registrations).set({
      status: body.status,
      updatedAt: new Date().toISOString(),
    }).where(eq(registrations.id, body.id)).returning({ id: registrations.id, status: registrations.status });
    if (!row) return apiError(404, "Pré-inscrição não encontrada.");
    return apiJson({ registration: row });
  } catch {
    return apiError(500, "Não foi possível atualizar a pré-inscrição.");
  }
}
