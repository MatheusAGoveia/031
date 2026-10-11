import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { contacts } from "@/db/schema";

export async function findOrCreateContact(data: {
  name: string;
  contact: string;
  normalizedContact: string;
}): Promise<string> {
  const db = getDb();
  await db.insert(contacts).values({
    id: crypto.randomUUID(),
    name: data.name,
    contact: data.contact,
    normalizedContact: data.normalizedContact,
  }).onConflictDoNothing();

  const [row] = await db.select({ id: contacts.id }).from(contacts)
    .where(eq(contacts.normalizedContact, data.normalizedContact)).limit(1);
  if (!row) throw new Error("Contact lookup failed");
  return row.id;
}
