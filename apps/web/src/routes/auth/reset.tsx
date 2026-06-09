import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Input, Label } from "@rocksa/ui";
import { useAuth } from "@rocksa/auth";

export const Route = createFileRoute("/auth/reset")({ component: Reset });

function Reset() {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await auth.sendReset(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset");
    }
  };

  return (
    <main className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:block bg-brand-100" />
      <div className="flex flex-col justify-center p-10 max-w-md">
        <p className="font-display text-brand-600 text-2xl">◇ Rocksa</p>
        <h1 className="font-display text-3xl mt-8">Reset Password</h1>
        <p className="text-ink-500 text-sm mt-2">
          Enter the email address associated with your account, and we'll send a securely encrypted
          link to reset your password.
        </p>
        <form className="mt-8 space-y-4" onSubmit={submit}>
          <div>
            <Label>Email Address</Label>
            <Input
              variant="underline"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-rose-600 text-sm">{error}</p>}
          {sent ? (
            <p className="text-sm text-emerald-700">✓ Reset link sent. Check your inbox.</p>
          ) : (
            <Button type="submit" className="w-full" size="lg">
              Send Reset Link →
            </Button>
          )}
          <Button asChild variant="secondary" className="w-full">
            <Link to="/auth/login">← Return to Login</Link>
          </Button>
        </form>
      </div>
    </main>
  );
}
