"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Meeting = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: "draft" | "published";
  registrationOpen: boolean;
};
type Registration = {
  id: string;
  meetingId: string;
  meetingTitle?: string;
  name: string;
  contact: string;
  status: "received" | "contacted" | "confirmed" | "cancelled";
  createdAt: string;
};
type Interest = { id: string; name: string; contact: string; createdAt: string };
type Profile = { id: string; name: string; role: string; handle: string; bio: string };

const emptyMeeting = {
  title: "",
  date: "",
  time: "",
  location: "",
  description: "",
  registrationOpen: false,
  status: "draft" as const,
};

const endpoint = {
  meetings: "/api/admin/meetings",
  registrations: "/api/admin/registrations",
  interests: "/api/admin/interest",
  profiles: "/api/admin/profiles",
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { "content-type": "application/json", ...options?.headers },
    cache: "no-store",
  });
  const data: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = data && typeof data === "object" && "error" in data && typeof data.error === "string"
      ? data.error
      : "Não foi possível concluir. Tente novamente.";
    throw new Error(error);
  }
  return data as T;
}

function dateLabel(value: string) {
  if (!value) return "Data a definir";
  const [year, month, day] = value.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

export default function AdminDashboard({ userName, signOutPath }: { userName: string; signOutPath: string }) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [draft, setDraft] = useState(emptyMeeting);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [m, r, i, p] = await Promise.all([
        request<{ meetings: Meeting[] }>(endpoint.meetings),
        request<{ registrations: Registration[] }>(endpoint.registrations),
        request<{ interests: Interest[] }>(endpoint.interests),
        request<{ profiles: Profile[] }>(endpoint.profiles),
      ]);
      setMeetings(m.meetings);
      setRegistrations(r.registrations);
      setInterests(i.interests);
      setProfiles(p.profiles);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível carregar o painel.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const received = useMemo(() => registrations.filter((item) => item.status === "received").length, [registrations]);
  const published = useMemo(() => meetings.filter((item) => item.status === "published").length, [meetings]);

  async function createMeeting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await request(endpoint.meetings, { method: "POST", body: JSON.stringify(draft) });
      setDraft(emptyMeeting);
      setMessage("Encontro salvo como rascunho.");
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível salvar o encontro.");
    } finally {
      setSaving(false);
    }
  }

  async function updateMeeting(item: Meeting) {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await request(endpoint.meetings, { method: "PATCH", body: JSON.stringify(item) });
      setMessage("Encontro atualizado.");
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível atualizar o encontro.");
    } finally {
      setSaving(false);
    }
  }

  async function updateRegistration(id: string, status: Registration["status"]) {
    setError("");
    try {
      await request(endpoint.registrations, { method: "PATCH", body: JSON.stringify({ id, status }) });
      setRegistrations((list) => list.map((item) => item.id === id ? { ...item, status } : item));
      setMessage("Situação da pré-inscrição atualizada.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível atualizar a pré-inscrição.");
    }
  }

  async function updateProfile(item: Profile) {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await request(endpoint.profiles, { method: "PATCH", body: JSON.stringify(item) });
      setMessage(`Perfil de ${item.name} atualizado.`);
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível atualizar o perfil.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <a className="admin-back" href="/">← Ver site</a>
          <p className="admin-eyebrow">BLOCO 31 / ÁREA RESTRITA</p>
          <h1>PAINEL<span>.</span></h1>
          <p className="admin-subtitle">Encontros, inscrições e perfis em um só lugar.</p>
        </div>
        <div className="admin-user">
          <span>GERÊNCIA</span>
          <strong>{userName}</strong>
          <a href={signOutPath} target="_top">Sair</a>
        </div>
      </header>

      {(message || error) && <p role={error ? "alert" : "status"} className={`admin-notice ${error ? "is-error" : ""}`}>{error || message}</p>}
      {loading ? <p className="admin-loading">Carregando painel…</p> : (
        <>
          <section className="admin-stats" aria-label="Resumo">
            <div><span>01 / ENCONTROS NO AR</span><strong>{published.toString().padStart(2, "0")}</strong></div>
            <div><span>02 / PRÉ-INSCRIÇÕES NOVAS</span><strong>{received.toString().padStart(2, "0")}</strong></div>
            <div><span>03 / INTERESSE GERAL</span><strong>{interests.length.toString().padStart(2, "0")}</strong></div>
          </section>

          <section className="admin-section" id="encontros">
            <div className="admin-section-head"><div><p className="admin-eyebrow">AGENDA / CONTROLE</p><h2>ENCONTROS</h2></div><span>{meetings.length} cadastrados</span></div>
            <div className="admin-grid">
              <form className="admin-card admin-form" onSubmit={createMeeting}>
                <h3>Novo encontro</h3>
                <p>Comece como rascunho. A data só aparece no site depois da publicação.</p>
                <label>Título<input required maxLength={80} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Nome do encontro" /></label>
                <div className="admin-fields-two"><label>Data<input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} /></label><label>Horário<input type="time" value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} /></label></div>
                <label>Local<input maxLength={140} value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} placeholder="A definir" /></label>
                <label>Descrição<textarea maxLength={1200} rows={4} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="O que a pessoa precisa saber?" /></label>
                <button className="admin-primary" disabled={saving}>Salvar rascunho <span>↗</span></button>
              </form>
              <div className="admin-list">
                {meetings.length === 0 && <div className="admin-empty">Nenhum encontro cadastrado ainda.</div>}
                {meetings.map((item) => <MeetingCard key={item.id} item={item} disabled={saving} onSave={updateMeeting} />)}
              </div>
            </div>
          </section>

          <section className="admin-section" id="inscricoes">
            <div className="admin-section-head"><div><p className="admin-eyebrow">PESSOAS / ACOMPANHAMENTO</p><h2>PRÉ-INSCRIÇÕES</h2></div><span>{registrations.length} recebidas</span></div>
            {registrations.length === 0 ? <div className="admin-empty">As pré-inscrições aparecerão aqui quando houver encontro publicado e inscrições abertas.</div> : (
              <div className="admin-submission-list">
                {registrations.map((item) => <article className="admin-submission" key={item.id}>
                  <div><span className="admin-mini-label">{item.meetingTitle || meetings.find((meeting) => meeting.id === item.meetingId)?.title || "Encontro"}</span><h3>{item.name}</h3><p>{item.contact}</p><small>{new Date(item.createdAt).toLocaleString("pt-BR")}</small></div>
                  <label>Situação<select value={item.status} onChange={(e) => void updateRegistration(item.id, e.target.value as Registration["status"])}><option value="received">Recebida</option><option value="contacted">Contatada</option><option value="confirmed">Confirmada</option><option value="cancelled">Cancelada</option></select></label>
                </article>)}
              </div>
            )}
          </section>

          <section className="admin-section" id="perfis">
            <div className="admin-section-head"><div><p className="admin-eyebrow">QUEM MOVE / EDITAR</p><h2>PERFIS</h2></div><span>Gerência</span></div>
            <div className="admin-profile-grid">
              {profiles.map((item) => <ProfileCard key={item.id} item={item} disabled={saving} onSave={updateProfile} />)}
            </div>
          </section>

          <section className="admin-section" id="interesse">
            <div className="admin-section-head"><div><p className="admin-eyebrow">CONTATOS / LISTA</p><h2>INTERESSE GERAL</h2></div><span>{interests.length} pessoas</span></div>
            {interests.length === 0 ? <div className="admin-empty">Ainda não há contatos na lista de interesse.</div> : <div className="admin-submission-list">{interests.map((item) => <article className="admin-submission" key={item.id}><div><h3>{item.name}</h3><p>{item.contact}</p><small>{new Date(item.createdAt).toLocaleString("pt-BR")}</small></div><span className="admin-pill">Recebido</span></article>)}</div>}
          </section>
        </>
      )}
    </main>
  );
}

function MeetingCard({ item, disabled, onSave }: { item: Meeting; disabled: boolean; onSave: (item: Meeting) => Promise<void> }) {
  const [value, setValue] = useState(item);
  useEffect(() => setValue(item), [item]);
  return <form className="admin-card admin-meeting" onSubmit={(event) => { event.preventDefault(); void onSave(value); }}>
    <div className="admin-meeting-top"><span className={`admin-pill ${value.status === "published" ? "is-live" : ""}`}>{value.status === "published" ? "Publicado" : "Rascunho"}</span><span>{dateLabel(value.date)}</span></div>
    <label>Título<input required maxLength={80} value={value.title} onChange={(event) => setValue({ ...value, title: event.target.value })} /></label>
    <div className="admin-fields-two"><label>Data<input type="date" value={value.date || ""} onChange={(event) => setValue({ ...value, date: event.target.value })} /></label><label>Horário<input type="time" value={value.time || ""} onChange={(event) => setValue({ ...value, time: event.target.value })} /></label></div>
    <label>Local<input maxLength={140} value={value.location || ""} onChange={(event) => setValue({ ...value, location: event.target.value })} /></label>
    <label>Descrição<textarea rows={3} maxLength={1200} value={value.description || ""} onChange={(event) => setValue({ ...value, description: event.target.value })} /></label>
    <div className="admin-fields-two"><label>Situação<select value={value.status} onChange={(event) => setValue({ ...value, status: event.target.value as Meeting["status"] })}><option value="draft">Rascunho</option><option value="published">Publicado</option></select></label><label>Inscrições<select value={value.registrationOpen ? "open" : "closed"} onChange={(event) => setValue({ ...value, registrationOpen: event.target.value === "open" })}><option value="closed">Fechadas</option><option value="open">Abertas</option></select></label></div>
    <button className="admin-primary" disabled={disabled}>Salvar alterações <span>↗</span></button>
  </form>;
}

function ProfileCard({ item, disabled, onSave }: { item: Profile; disabled: boolean; onSave: (item: Profile) => Promise<void> }) {
  const [value, setValue] = useState(item);
  useEffect(() => setValue(item), [item]);
  return <form className="admin-card" onSubmit={(event) => { event.preventDefault(); void onSave(value); }}>
    <span className="admin-mini-label">CEO / BLOCO 31</span><h3>{item.name}</h3>
    <label>Instagram<input maxLength={60} value={value.handle || ""} onChange={(event) => setValue({ ...value, handle: event.target.value })} placeholder="@usuario" /></label>
    <label>Legenda curta<textarea rows={4} maxLength={300} value={value.bio || ""} onChange={(event) => setValue({ ...value, bio: event.target.value })} placeholder="Aparece abaixo do card quando preenchida" /></label>
    <button className="admin-outline" disabled={disabled}>Salvar perfil</button>
  </form>;
}
