import { chatGPTSignOutPath, requireChatGPTUser } from "../chatgpt-auth";
import { isAdminUser } from "../../lib/admin-auth";
import AdminDashboard from "./AdminDashboard";
import "./admin.css";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  const allowed = await isAdminUser(user);

  if (!allowed) {
    return (
      <main className="admin-shell admin-denied">
        <a className="admin-back" href="/">← Voltar ao site</a>
        <p className="admin-eyebrow">BLOCO 31 / ACESSO</p>
        <h1>Área da gerência.</h1>
        <p>Esta conta ainda não tem acesso ao painel. Peça à gerência para incluí-la.</p>
        <p className="admin-signed">Conta conectada: {user.email}</p>
        <a className="admin-outline" href={chatGPTSignOutPath("/")} target="_top">Sair desta conta</a>
      </main>
    );
  }

  return <AdminDashboard userName={user.displayName} signOutPath={chatGPTSignOutPath("/")} />;
}
