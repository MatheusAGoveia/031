import { getDb } from "@/db";
import { adminProfiles } from "@/db/schema";
import { apiError, apiJson } from "@/lib/api";
import { PROFILE_BASE } from "@/lib/profiles";

export async function GET() {
  try {
    const rows = await getDb().select().from(adminProfiles);
    const saved = new Map(rows.map((row) => [row.id, row]));
    const profiles = PROFILE_BASE.map((base) => ({
      ...base,
      bio: saved.get(base.id)?.bio ?? "",
      handle: saved.get(base.id)?.handle ?? "",
    }));
    return apiJson({ profiles });
  } catch {
    return apiError(500, "Não foi possível carregar os perfis.");
  }
}
