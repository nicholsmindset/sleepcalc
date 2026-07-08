import type { Metadata } from "next";
import { AuthForm } from "../AuthForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Sleep Stack account to access your dashboard, connected devices, and AI sleep coach.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
