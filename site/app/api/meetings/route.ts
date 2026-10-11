import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { meetings } from "@/db/schema";
import { apiError, apiJson } from "@/lib/api";

export async function GET() {
  try {
    const rows = await getDb().select({
      id: meetings.id,
      title: meetings.title,
      date: meetings.date,
      time: meetings.time,
      location: meetings.location,
      description: meetings.description,
      registrationOpen: meetings.registrationOpen,
    }).from(meetings).where(eq(meetings.status, "published"))
      .orderBy(asc(meetings.date), asc(meetings.time));
    return apiJson({ meetings: rows });
  } catch {
    return apiError(500, "Não foi possível carregar os encontros.");
  }
}
