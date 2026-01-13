"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { TenantContextValue, TenantOrg, TenantWorkspace } from "@/lib/utils/types";

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

type TenantProviderProps = {
  initialUser: TenantContextValue["user"];
  initialOrgs: TenantOrg[];
  initialActiveOrg: TenantOrg | null;
  initialWorkspaces: TenantWorkspace[];
  initialActiveWorkspace: TenantWorkspace | null;
  children: ReactNode;
};

export function TenantProvider({
  initialUser,
  initialOrgs,
  initialActiveOrg,
  initialWorkspaces,
  initialActiveWorkspace,
  children,
}: TenantProviderProps) {
  const router = useRouter();
  const [activeOrg, setActiveOrgState] = useState<TenantOrg | null>(initialActiveOrg);
  const [activeWorkspace, setActiveWorkspaceState] = useState<TenantWorkspace | null>(initialActiveWorkspace);

  function setActiveOrg(org: TenantOrg) {
    setActiveOrgState(org);
    // persist by navigating to org-scoped URL
    try {
      router.push(`/${org.slug}/dashboard`);
    } catch (e) {
      // fallback
      window.location.href = `/${org.slug}/dashboard`;
    }
  }

  function setActiveWorkspace(ws: TenantWorkspace) {
    setActiveWorkspaceState(ws);
    try {
      router.push(`/${ws.organizationId}/workspaces/${ws.id}`);
    } catch (e) {
      window.location.href = `/${ws.organizationId}/workspaces/${ws.id}`;
    }
  }

  const value = useMemo<TenantContextValue>(() => ({
    user: initialUser,
    orgs: initialOrgs,
    activeOrg,
    workspaces: initialWorkspaces,
    activeWorkspace,
    setActiveOrg,
    setActiveWorkspace,
  }), [initialUser, initialOrgs, activeOrg, initialWorkspaces, activeWorkspace]);

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used within TenantProvider");
  return ctx;
}
