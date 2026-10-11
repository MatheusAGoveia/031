export function apiJson(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function apiError(status: number, error: string): Response {
  return apiJson({ error }, status);
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown> | Response> {
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return apiError(415, "Envie os dados em JSON.");
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > 8192) {
    return apiError(413, "O formulário é grande demais.");
  }

  // Bound the streamed body even when Content-Length is absent.
  const reader = request.body?.getReader();
  if (!reader) return apiError(400, "Corpo da requisição ausente.");
  const chunks: Uint8Array[] = [];
  let byteCount = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    byteCount += value.byteLength;
    if (byteCount > 8192) {
      await reader.cancel();
      return apiError(413, "O formulário é grande demais.");
    }
    chunks.push(value);
  }
  const body = new Uint8Array(byteCount);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    const parsed: unknown = JSON.parse(new TextDecoder().decode(body));
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return apiError(400, "Dados inválidos.");
    }
    return parsed as Record<string, unknown>;
  } catch {
    return apiError(400, "JSON inválido.");
  }
}

export function textField(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized.length <= max ? normalized : null;
}

export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function isValidTime(value: string): boolean {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function publicFormFields(body: Record<string, unknown>):
  | { name: string; contact: string; normalizedContact: string }
  | Response {
  const name = textField(body.name, 80);
  const contact = textField(body.contact, 160);
  if (!name || name.length < 2) return apiError(400, "Informe seu nome.");
  if (!contact || contact.length < 5) return apiError(400, "Informe um contato válido.");
  if (body.consent !== true) return apiError(400, "É necessário concordar com o uso do contato para esta inscrição.");

  const normalizedContact = contact.toLowerCase().replace(/\s+/g, "");
  return { name, contact, normalizedContact };
}

export function isHoneypotFilled(body: Record<string, unknown>): boolean {
  return typeof body.website === "string" && body.website.trim().length > 0;
}
