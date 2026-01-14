"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  variant?: "error" | "info" | "success";
};

export default function Alert({ children, variant = "info" }: Props) {
  const cls =
    variant === "error"
      ? "bg-red-100 text-red-800 p-3 rounded"
      : variant === "success"
      ? "bg-green-100 text-green-800 p-3 rounded"
      : "bg-gray-100 text-gray-800 p-3 rounded";

  return <div className={cls}>{children}</div>;
}
