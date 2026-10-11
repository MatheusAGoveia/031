export const PROFILE_BASE = [
  { id: "xande", name: "Xande", role: "CEO" },
  { id: "davi", name: "Davi", role: "CEO" },
  { id: "querubim", name: "Querubim", role: "CEO" },
] as const;

export function isProfileId(value: unknown): value is (typeof PROFILE_BASE)[number]["id"] {
  return PROFILE_BASE.some((profile) => profile.id === value);
}
