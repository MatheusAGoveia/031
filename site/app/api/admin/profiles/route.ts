import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { adminProfiles } from "@/db/schema";
import { adminAccessError } from "@/lib/admin-auth";
import { apiError, apiJson, readJsonObject, textField } from "@/lib/api";
import { isProfileId, PROFILE_BASE } from "@/lib/profiles";

export async function GET() {
  const denied = await adminAccessError();
  if (denied) return denied;
  try {
    const rows = await getDb().select().from(adminProfiles);
    const saved = new Map(rows.map((row) => [row.id, row]));
    return apiJson({ profiles: PROFILE_BASE.map((base) => ({
      ...base,
      bio: saved.get(base.id)?.bio ?? "",
      handle: saved.get(base.id)?.handle ?? "",
    })) });
  } catch {
    return apiError(500, "Não foi possível carregar os perfis.");
  }
}

export async function PATCH(request: Request) {
  const denied = await adminAccessError();
  if (denied) return denied;
  const body = await readJsonObject(request);
  if (body instanceof Response) return body;
  if (!isProfileId(body.id)) return apiError(400, "Perfil inválido.");
  if (body.bio === undefined && body.handle === undefined) {
    return apiError(400, "Informe a bio ou o arroba para atualizar.");
  }

  try {
    const db = getDb();
    const [current] = await db.select().from(adminProfiles).where(eq(adminProfiles.id, body.id)).limit(1);
    const bio = body.bio === undefined ? (current?.bio ?? "") : textField(body.bio, 240);
    const handle = body.handle === undefined ? (current?.handle ?? "") : textField(body.handle, 40);
    if (bio === null || handle === null || (handle && !/^@?[\w.]{1,30}$/.test(handle))) {
      return apiError(400, "Bio ou arroba inválido.");
    }
    await db.insert(adminProfiles).values({
      id: body.id,
      bio,
      handle,
      updatedAt: new Date().toISOString(),
    }).onConflictDoUpdate({
      target: adminProfiles.id,
      set: { bio, handle, updatedAt: new Date().toISOString() },
    });
    const base = PROFILE_BASE.find((profile) => profile.id === body.id)!;
    return apiJson({ profile: { ...base, bio, handle } });
  } catch {
    return apiError(500, "Não foi possível atualizar o perfil.");
  }
}
