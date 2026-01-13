"use client";

import React, { useState } from "react";
import { useTenant } from "@/components/providers/TenantProvider";

export default function OrgSwitcher() {
  const { orgs, activeOrg, setActiveOrg } = useTenant();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(true)} className="px-2 py-1 font-medium">
        {activeOrg?.name ?? "Select organization"} ▾
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-24" onClick={() => setOpen(false)}>
          <div className="bg-white rounded shadow-lg w-full max-w-md p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold">Switch organization</h2>
            <ul className="space-y-2">
              {orgs.map((org) => (
                <li key={org.id}>
                  <button
                    className="w-full text-left px-2 py-2 hover:bg-gray-100 rounded"
                    onClick={() => {
                      setActiveOrg(org);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{org.name}</span>
                      <span className="text-sm text-gray-500">{org.role}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
