import { getDb } from "@/db";
import { interests } from "@/db/schema";
import { apiError, apiJson, isHoneypotFilled, publicFormFields, readJsonObject } from "@/lib/api";
import { findOrCreateContact } from "@/lib/public-data";

export async function POST(request: Request) {
  const body = await readJsonObject(request);
  if (body instanceof Response) return body;
  if (isHoneypotFilled(body)) return apiJson({ ok: true }, 202);
  const fields = publicFormFields(body);
  if (fields instanceof Response) return fields;

  try {
    const contactId = await findOrCreateContact(fields);
    await getDb().insert(interests).values({
      id: crypto.randomUUID(),
      contactId,
    }).onConflictDoNothing();
    // The same answer for new and repeated contact values does not expose
    // whether a person is already on the list.
    return apiJson({ ok: true }, 202);
  } catch {
    return apiError(500, "Não foi possível registrar seu interesse agora.");
  }
}
