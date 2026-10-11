import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { contacts, interests } from "@/db/schema";
import { adminAccessError } from "@/lib/admin-auth";
import { apiError, apiJson, readJsonObject } from "@/lib/api";

const VALID_STATUSES = new Set(["new", "contacted", "archived"]);

export async function GET() {
  const denied = await adminAccessError();
  if (denied) return denied;
  try {
    const rows = await getDb().select({
      id: interests.id,
      name: contacts.name,
      contact: contacts.contact,
      status: interests.status,
      createdAt: interests.createdAt,
    }).from(interests)
      .innerJoin(contacts, eq(interests.contactId, contacts.id))
      .orderBy(desc(interests.createdAt)).limit(500);
    return apiJson({ interests: rows });
  } catch {
    return apiError(500, "Não foi possível carregar a lista de interesse.");
  }
}

export async function PATCH(request: Request) {
  const denied = await adminAccessError();
  if (denied) return denied;
  const body = await readJsonObject(request);
  if (body instanceof Response) return body;
  if (typeof body.id !== "string" || !body.id || body.id.length > 64 ||
      typeof body.status !== "string" || !VALID_STATUSES.has(body.status)) {
    return apiError(400, "Interesse ou estado inválido.");
  }
  try {
    const [row] = await getDb().update(interests).set({
      status: body.status,
      updatedAt: new Date().toISOString(),
    }).where(eq(interests.id, body.id)).returning({ id: interests.id, status: interests.status });
    if (!row) return apiError(404, "Interesse não encontrado.");
    return apiJson({ interest: row });
  } catch {
    return apiError(500, "Não foi possível atualizar o interesse.");
  }
}
