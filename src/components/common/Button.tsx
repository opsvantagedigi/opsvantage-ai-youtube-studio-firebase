"use client";

import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

export default function Button({ children, className = "", ...props }: Props) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}
