"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2, AlertTriangle } from "lucide-react";

type Mode = "login" | "signup";

interface AuthFormProps {
  mode: Mode;
}

const COPY: Record<Mode, { heading: string; sub: string; cta: string; alt: string; altHref: string; altLabel: string }> = {
  login: {
    heading: "Welcome back",
    sub: "Sign in with a magic link — no password needed.",
    cta: "Send magic link",
    alt: "Don't have an account?",
    altHref: "/signup",
    altLabel: "Create one",
  },
  signup: {
    heading: "Create your account",
    sub: "Enter your email and we'll send a secure sign-in link.",
    cta: "Sign up with email",
    alt: "Already have an account?",
    altHref: "/login",
    altLabel: "Sign in",
  },
};

/**
 * Passwordless (magic-link) auth form shared by /login and /signup.
 *
 * Uses Supabase `signInWithOtp`, which both creates a new user and signs an
 * existing one in, so the same flow backs both routes. On success Supabase
 * emails a link that returns to /auth/callback to complete the session.
 */
export function AuthForm({ mode }: AuthFormProps) {
  const copy = COPY[mode];
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const supabase = createClient();
    if (!supabase) {
      setStatus("error");
      setMessage("Authentication is temporarily unavailable. Please try again later.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="glass-card rounded-3xl p-8 text-center">
        <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-accent" />
        <h1 className="text-xl font-bold text-on-surface font-headline mb-2">
          Check your email
        </h1>
        <p className="text-sm text-on-surface-variant">
          We sent a magic sign-in link to{" "}
          <span className="text-on-surface font-medium">{email}</span>. Click it to
          continue — the link expires in 60 minutes.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-8">
      <h1 className="text-2xl font-bold text-on-surface font-headline mb-2">
        {copy.heading}
      </h1>
      <p className="text-sm text-on-surface-variant mb-6">{copy.sub}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <Input
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9"
          />
        </div>

        {status === "error" && (
          <p className="flex items-start gap-2 text-sm text-danger">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            {message}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : copy.cta}
        </Button>
      </form>

      <p className="mt-6 text-sm text-center text-on-surface-variant">
        {copy.alt}{" "}
        <Link href={copy.altHref} className="text-primary hover:text-primary-light font-medium">
          {copy.altLabel}
        </Link>
      </p>
    </div>
  );
}
