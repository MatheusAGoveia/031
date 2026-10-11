(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const loader = document.getElementById("site-loader");
  const skipOpening = document.getElementById("loader-skip");
  let loaderTimer;

  function dismissLoader() {
    if (!loader || loader.hidden) return;
    window.clearTimeout(loaderTimer);
    loader.classList.add("is-dismissed");
    loader.setAttribute("aria-hidden", "true");
    window.setTimeout(() => { loader.hidden = true; }, reducedMotion.matches ? 0 : 380);
  }

  if (loader) {
    if (reducedMotion.matches) {
      loader.hidden = true;
    } else {
      loaderTimer = window.setTimeout(dismissLoader, 2100);
      skipOpening?.addEventListener("click", dismissLoader);
    }
  }

  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("primary-nav");
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    menuToggle?.setAttribute("aria-expanded", String(open));
    menuToggle?.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }
  menuToggle?.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1000 && document.body.classList.contains("menu-open")) setMenu(false);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
      setMenu(false);
      menuToggle?.focus();
    }
  });

  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    document.documentElement.classList.add("has-reveal");
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: "0px 0px 40px 0px" });
    document.querySelectorAll(".reveal").forEach(node => revealObserver.observe(node));
  }

  const hero = document.querySelector(".hero");
  const heroObject = document.querySelector(".hero-object");
  if (hero && heroObject && window.matchMedia("(pointer: fine)").matches && !reducedMotion.matches) {
    hero.addEventListener("pointermove", event => {
      const ratio = (event.clientX / window.innerWidth - .5) * 2;
      heroObject.style.setProperty("--object-rotate", `${(ratio * 2.5).toFixed(2)}deg`);
    }, { passive: true });
    hero.addEventListener("pointerleave", () => heroObject.style.setProperty("--object-rotate", "0deg"));
  }

  const managers = [
    { id: "xande", name: "XANDE", handle: "@xande.blck", profile: "https://www.instagram.com/xande.blck/", description: "CEO do Bloco 31." },
    { id: "davi", name: "DAVI", handle: "@nox.wzx", profile: "https://www.instagram.com/nox.wzx/", description: "CEO do Bloco 31." },
    { id: "querubim", name: "QUERUBIM", handle: "@anjoempessoa", profile: "https://www.instagram.com/anjoempessoa/", description: "CEO do Bloco 31." }
  ];
  const carousel = document.getElementById("manager-carousel");
  const stage = document.getElementById("card-stage");
  const managerCards = Array.from(document.querySelectorAll(".manager-card"));
  const counter = document.getElementById("carousel-counter");
  const playerNumber = document.getElementById("manager-number");
  const managerName = document.getElementById("manager-name");
  const managerDescription = document.getElementById("manager-description");
  const managerLink = document.getElementById("manager-link");
  let activeManager = 0;
  let swipeStart = null;
  let suppressCardClickUntil = 0;

  function selectManager(index, focusCard = false) {
    activeManager = (index + managers.length) % managers.length;
    managerCards.forEach((card, cardIndex) => {
      card.classList.toggle("is-active", cardIndex === activeManager);
      card.classList.toggle("is-prev", cardIndex === (activeManager + managers.length - 1) % managers.length);
      card.classList.toggle("is-next", cardIndex === (activeManager + 1) % managers.length);
      card.tabIndex = cardIndex === activeManager ? 0 : -1;
      if (cardIndex === activeManager) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
    });
    const person = managers[activeManager];
    const ordinal = String(activeManager + 1).padStart(2, "0");
    counter.textContent = `${ordinal} / 03`;
    playerNumber.textContent = ordinal;
    managerName.textContent = person.name;
    const dot = document.createElement("span");
    dot.className = "blue-dot";
    dot.textContent = ".";
    managerName.append(dot);
    managerDescription.textContent = person.description;
    managerLink.href = person.profile;
    managerLink.firstChild.textContent = `${person.handle} `;
    if (focusCard) managerCards[activeManager].focus();
  }

  async function loadManagerProfiles() {
    try {
      const response = await fetch("/api/profiles", { headers: { Accept: "application/json" }, cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      if (!Array.isArray(data.profiles)) return;
      for (const profile of data.profiles) {
        const person = managers.find((entry) => entry.id === profile.id);
        if (!person) continue;
        if (typeof profile.bio === "string" && profile.bio.trim()) person.description = profile.bio.trim();
        if (typeof profile.handle === "string" && /^@?[\w.]{1,30}$/.test(profile.handle.trim())) {
          const handle = profile.handle.trim().replace(/^@/, "");
          person.handle = `@${handle}`;
          person.profile = `https://www.instagram.com/${handle}/`;
        }
      }
      selectManager(activeManager);
    } catch { /* Keep the verified details from the original story. */ }
  }
  void loadManagerProfiles();

  managerCards.forEach(card => card.addEventListener("click", () => {
    if (Date.now() < suppressCardClickUntil) return;
    selectManager(Number(card.dataset.manager));
  }));
  document.getElementById("manager-prev")?.addEventListener("click", () => selectManager(activeManager - 1));
  document.getElementById("manager-next")?.addEventListener("click", () => selectManager(activeManager + 1));
  carousel?.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      selectManager(activeManager + (event.key === "ArrowRight" ? 1 : -1), true);
    }
  });
  stage?.addEventListener("pointerdown", event => { swipeStart = { x: event.clientX, y: event.clientY }; }, { passive: true });
  stage?.addEventListener("pointerup", event => {
    if (!swipeStart) return;
    const dx = event.clientX - swipeStart.x;
    const dy = event.clientY - swipeStart.y;
    swipeStart = null;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      suppressCardClickUntil = Date.now() + 400;
      selectManager(activeManager + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });
  stage?.addEventListener("pointercancel", () => { swipeStart = null; });

  const meetingsList = document.getElementById("meetings-list");
  const form = document.getElementById("interest-form");
  const formTitle = document.getElementById("form-title");
  const formDescription = document.getElementById("form-description");
  const formSubmit = document.getElementById("form-submit");
  const formStatus = document.getElementById("form-status");
  const modeReset = document.getElementById("mode-reset");
  const nameField = document.getElementById("person-name");
  const contactField = document.getElementById("person-contact");
  const consentField = document.getElementById("person-consent");
  let selectedMeeting = null;
  let submitting = false;

  function setFormStatus(message, state = "") {
    formStatus.textContent = message;
    formStatus.classList.toggle("is-error", state === "error");
    formStatus.classList.toggle("is-success", state === "success");
    formStatus.setAttribute("role", state === "error" ? "alert" : "status");
  }

  function setFormMode(meeting) {
    selectedMeeting = meeting;
    if (meeting) {
      formTitle.textContent = `Pré-inscrição: ${meeting.title}`;
      formDescription.textContent = "Envie seus dados para esta pré-inscrição. O envio não garante uma vaga; a gerência fará a confirmação.";
      formSubmit.firstElementChild.textContent = "Enviar pré-inscrição";
      modeReset.hidden = false;
      document.getElementById("participar")?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
      window.setTimeout(() => nameField.focus({ preventScroll: true }), reducedMotion.matches ? 0 : 700);
    } else {
      formTitle.textContent = "Entre na lista de interesse";
      formDescription.textContent = "Seu contato será usado para avisar sobre novidades dos encontros do Bloco 31.";
      formSubmit.firstElementChild.textContent = "Enviar interesse";
      modeReset.hidden = true;
    }
    setFormStatus("");
  }
  modeReset?.addEventListener("click", () => setFormMode(null));

  function createText(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = content;
    return element;
  }

  function formatDate(value) {
    if (!value) return "DATA A CONFIRMAR";
    try {
      let parsed;
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [year, month, day] = value.split("-").map(Number);
        parsed = new Date(year, month - 1, day);
      } else parsed = new Date(value);
      if (Number.isNaN(parsed.valueOf())) return String(value);
      return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: /^\d{4}-\d{2}-\d{2}$/.test(value) ? undefined : "America/Sao_Paulo" }).format(parsed);
    } catch { return String(value); }
  }

  function renderMeeting(meeting) {
    const item = document.createElement("article");
    item.className = "meeting-item";
    item.append(createText("span", "meeting-date", formatDate(meeting.date)));
    item.append(createText("h3", "", meeting.title || "Encontro Bloco 31"));
    const meta = [meeting.time, meeting.location].filter(Boolean).join(" · ");
    if (meta) item.append(createText("p", "meeting-meta", meta));
    if (meeting.description) item.append(createText("p", "", meeting.description));
    if (meeting.registrationOpen === true) {
      const button = createText("button", "meeting-register", "Fazer pré-inscrição ↗");
      button.type = "button";
      button.addEventListener("click", () => setFormMode(meeting));
      item.append(button);
    } else item.append(createText("p", "meeting-meta", "Pré-inscrição indisponível no momento"));
    return item;
  }

  async function loadMeetings() {
    if (!meetingsList) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch("/api/meetings", { signal: controller.signal, headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`Agenda HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.meetings)) throw new Error("Formato de agenda inesperado");
      meetingsList.replaceChildren();
      if (data.meetings.length === 0) {
        meetingsList.append(createText("p", "meeting-state", "Ainda não há encontro anunciado."));
      } else data.meetings.forEach(meeting => meetingsList.append(renderMeeting(meeting)));
    } catch {
      meetingsList.replaceChildren(createText("p", "meeting-state", "Agenda indisponível agora. Veja as novidades no Instagram."));
    } finally {
      window.clearTimeout(timeout);
    }
  }
  loadMeetings();

  form?.addEventListener("submit", async event => {
    event.preventDefault();
    if (submitting) return;
    const name = nameField.value.trim();
    const contact = contactField.value.trim();
    if (name.length < 2) {
      setFormStatus("Informe seu nome para continuar.", "error");
      nameField.focus();
      return;
    }
    if (contact.length < 5) {
      setFormStatus("Informe um e-mail ou telefone para contato.", "error");
      contactField.focus();
      return;
    }
    if (!consentField.checked) {
      setFormStatus("Autorize o contato para enviar seus dados.", "error");
      consentField.focus();
      return;
    }

    const meeting = selectedMeeting;
    const endpoint = meeting ? "/api/registrations" : "/api/interest";
    const body = meeting ? { meetingId: meeting.id, name, contact, consent: true } : { name, contact, consent: true };
    submitting = true;
    formSubmit.disabled = true;
    formSubmit.firstElementChild.textContent = "Enviando...";
    setFormStatus("");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(body),
        signal: controller.signal
      });
      if (!response.ok) {
        if (response.status === 409) throw new Error("As pré-inscrições para este encontro não estão abertas.");
        if (response.status === 429) throw new Error("Muitas tentativas agora. Aguarde um pouco e tente novamente.");
        if (response.status >= 400 && response.status < 500) throw new Error("Confira os dados informados e tente novamente.");
        throw new Error("Não conseguimos registrar agora. Tente novamente mais tarde.");
      }
      form.reset();
      setFormStatus(meeting
        ? "Pré-inscrição recebida. A gerência fará a confirmação; o envio ainda não garante vaga."
        : "Interesse recebido. A equipe poderá entrar em contato quando houver novidades.", "success");
    } catch (error) {
      const message = error.name === "AbortError"
        ? "A conexão demorou demais. Não conseguimos confirmar o envio; tente novamente."
        : error.message === "Failed to fetch"
          ? "Não foi possível conectar ao site agora. Tente novamente mais tarde."
          : error.message;
      setFormStatus(message || "Não conseguimos registrar agora. Tente novamente mais tarde.", "error");
    } finally {
      window.clearTimeout(timeout);
      submitting = false;
      formSubmit.disabled = false;
      formSubmit.firstElementChild.textContent = meeting ? "Enviar pré-inscrição" : "Enviar interesse";
    }
  });
})();
