export type TenantOrg = {
  id: string;
  name: string;
  slug: string;
  role: string; // membership role
};

export type TenantWorkspace = {
  id: string;
  name: string;
  organizationId: string;
  role: string; // membership role
};

export type TenantContextValue = {
  user: {
    id: string;
    email?: string;
    name?: string;
    globalRole?: string;
  } | null;
  orgs: TenantOrg[];
  activeOrg: TenantOrg | null;
  workspaces: TenantWorkspace[];
  activeWorkspace: TenantWorkspace | null;
  setActiveOrg: (org: TenantOrg) => void;
  setActiveWorkspace: (ws: TenantWorkspace) => void;
};
