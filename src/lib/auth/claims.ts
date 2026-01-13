export type UserClaims = {
  userId: string;
  globalRole: string;
  activeOrgId?: string;
  activeWorkspaceId?: string;
};

export function buildUserClaims(input: {
  userId: string;
  globalRole: string;
  activeOrgId?: string;
  activeWorkspaceId?: string;
}): UserClaims {
  return {
    userId: input.userId,
    globalRole: input.globalRole,
    activeOrgId: input.activeOrgId,
    activeWorkspaceId: input.activeWorkspaceId,
  };
}
