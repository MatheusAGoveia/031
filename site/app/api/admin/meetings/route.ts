import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { meetings } from "@/db/schema";
import { adminAccessError } from "@/lib/admin-auth";
import { apiError, apiJson, isValidDate, isValidTime, readJsonObject, textField } from "@/lib/api";

export async function GET() {
  const denied = await adminAccessError();
  if (denied) return denied;
  try {
    const rows = await getDb().select().from(meetings).orderBy(desc(meetings.createdAt));
    return apiJson({ meetings: rows });
  } catch {
    return apiError(500, "Não foi possível carregar os encontros.");
  }
}

export async function POST(request: Request) {
  const denied = await adminAccessError();
  if (denied) return denied;
  const body = await readJsonObject(request);
  if (body instanceof Response) return body;

  const title = textField(body.title, 100);
  if (!title) return apiError(400, "Informe um título de até 100 caracteres.");
  const date = optionalDate(body.date);
  if (date === false) return apiError(400, "Data inválida.");
  const time = optionalTime(body.time);
  if (time === false) return apiError(400, "Horário inválido.");
  const location = body.location === undefined ? "" : textField(body.location, 160);
  const description = body.description === undefined ? "" : textField(body.description, 1200);
  if (location === null || description === null) return apiError(400, "Local ou descrição acima do limite permitido.");

  try {
    const [meeting] = await getDb().insert(meetings).values({
      id: crypto.randomUUID(), title, date, time, location, description,
      status: "draft", registrationOpen: false,
    }).returning();
    return apiJson({ meeting }, 201);
  } catch {
    return apiError(500, "Não foi possível criar o encontro.");
  }
}

export async function PATCH(request: Request) {
  const denied = await adminAccessError();
  if (denied) return denied;
  const body = await readJsonObject(request);
  if (body instanceof Response) return body;
  if (typeof body.id !== "string" || !body.id || body.id.length > 64) {
    return apiError(400, "Encontro inválido.");
  }

  try {
    const db = getDb();
    const [current] = await db.select().from(meetings).where(eq(meetings.id, body.id)).limit(1);
    if (!current) return apiError(404, "Encontro não encontrado.");

    const title = body.title === undefined ? current.title : textField(body.title, 100);
    const date = body.date === undefined ? current.date : optionalDate(body.date);
    const time = body.time === undefined ? current.time : optionalTime(body.time);
    const location = body.location === undefined ? current.location : textField(body.location, 160);
    const description = body.description === undefined ? current.description : textField(body.description, 1200);
    const status = body.status === undefined ? current.status : body.status;
    const registrationOpen = body.registrationOpen === undefined ? current.registrationOpen : body.registrationOpen;

    if (!title || date === false || time === false || location === null || description === null) {
      return apiError(400, "Verifique título, data, horário, local e descrição.");
    }
    if (status !== "draft" && status !== "published") return apiError(400, "Estado do encontro inválido.");
    if (typeof registrationOpen !== "boolean") return apiError(400, "Estado das inscrições inválido.");
    if (status === "published" && (!date || !time || !location)) {
      return apiError(400, "Defina data, horário e local antes de publicar.");
    }

    const [meeting] = await db.update(meetings).set({
      title, date, time, location, description, status,
      registrationOpen: status === "published" ? registrationOpen : false,
      updatedAt: new Date().toISOString(),
    }).where(eq(meetings.id, body.id)).returning();
    return apiJson({ meeting });
  } catch {
    return apiError(500, "Não foi possível atualizar o encontro.");
  }
}

function optionalDate(value: unknown): string | null | false {
  if (value === null || value === "" || value === undefined) return null;
  return typeof value === "string" && isValidDate(value) ? value : false;
}

function optionalTime(value: unknown): string | null | false {
  if (value === null || value === "" || value === undefined) return null;
  return typeof value === "string" && isValidTime(value) ? value : false;
}
