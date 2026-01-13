"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Button from "@/components/common/Button";
import Alert from "@/components/common/Alert";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn(provider: "google") {
    setLoading(true);
    setError(null);
    try {
      await signIn(provider, {
        callbackUrl: from,
      });
    } catch (err) {
      setError("Something went wrong while signing you in.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-gray-500">
          Access your workspaces, dashboards, and explainer flows.
        </p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <div className="space-y-3">
        <Button
          disabled={loading}
          onClick={() => handleSignIn("google")}
          className="w-full"
        >
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
