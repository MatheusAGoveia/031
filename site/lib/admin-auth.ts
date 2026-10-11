import { env } from "cloudflare:workers";
import { getChatGPTUser, type ChatGPTUser } from "@/app/chatgpt-auth";
import { apiError } from "@/lib/api";

// ADMIN_EMAILS is a comma-separated runtime variable. An empty allowlist
// deliberately grants nobody administrative access.
export async function isAdminUser(user: ChatGPTUser): Promise<boolean> {
  const configured = (env as Cloudflare.Env & { ADMIN_EMAILS?: string }).ADMIN_EMAILS
    || process.env.ADMIN_EMAILS
    || "";
  const allowed = configured.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(user.email.trim().toLowerCase());
}

export async function adminAccessError(): Promise<Response | null> {
  const user = await getChatGPTUser();
  if (!user) return apiError(401, "Faça login para acessar a gerência.");
  if (!(await isAdminUser(user))) return apiError(403, "Esta conta não tem acesso à gerência.");
  return null;
}
