import type { Metadata } from "next";
import { AuthForm } from "../AuthForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a free Sleep Stack account to connect a wearable, track your sleep history, and get AI sleep coaching.",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
