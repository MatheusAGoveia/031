import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { meetings, registrations } from "@/db/schema";
import { apiError, apiJson, isHoneypotFilled, publicFormFields, readJsonObject } from "@/lib/api";
import { findOrCreateContact } from "@/lib/public-data";

export async function POST(request: Request) {
  const body = await readJsonObject(request);
  if (body instanceof Response) return body;
  if (isHoneypotFilled(body)) return apiJson({ ok: true }, 202);

  const meetingId = body.meetingId;
  if (typeof meetingId !== "string" || meetingId.length === 0 || meetingId.length > 64) {
    return apiError(400, "Encontro inválido.");
  }
  const fields = publicFormFields(body);
  if (fields instanceof Response) return fields;

  try {
    const db = getDb();
    const [meeting] = await db.select({ id: meetings.id }).from(meetings).where(and(
      eq(meetings.id, meetingId),
      eq(meetings.status, "published"),
      eq(meetings.registrationOpen, true),
    )).limit(1);
    if (!meeting) return apiError(409, "As pré-inscrições para este encontro não estão abertas.");

    const contactId = await findOrCreateContact(fields);
    await db.insert(registrations).values({
      id: crypto.randomUUID(),
      meetingId,
      contactId,
    }).onConflictDoNothing();
    return apiJson({ ok: true }, 202);
  } catch {
    return apiError(500, "Não foi possível receber sua pré-inscrição agora.");
  }
}
