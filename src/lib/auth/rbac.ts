type Role = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

const roleRank: Record<Role, number> = {
  OWNER: 4,
  ADMIN: 3,
  MEMBER: 2,
  VIEWER: 1,
};

export function hasRole(
  current: Role | null | undefined,
  required: Role
): boolean {
  if (!current) return false;
  return roleRank[current] >= roleRank[required];
}

export function requireRole(
  current: Role | null | undefined,
  required: Role
) {
  if (!hasRole(current, required)) {
    throw new Error("FORBIDDEN");
  }
}
