import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Card, CardBody, Input, Label } from "@rocksa/ui";
import { useAuth } from "@rocksa/auth";

export const Route = createFileRoute("/auth/register")({ component: Register });

function Register() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!agreed) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }
    setBusy(true);
    try {
      await auth.signUp(email, password, fullName, { role: "curator" });
      navigate({ to: "/workspace/overview" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-up failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-50/60 p-6">
      <Card className="w-full max-w-md">
        <CardBody className="space-y-6">
          <div className="text-center space-y-1">
            <p className="font-display text-brand-600 text-2xl">Rocksa</p>
            <h1 className="font-display text-2xl">Create Your Curator Account</h1>
          </div>
          <form className="space-y-5" onSubmit={submit}>
            <div>
              <Label>Full Name</Label>
              <Input
                variant="underline"
                placeholder="e.g. Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input
                variant="underline"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                variant="underline"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <label className="flex items-start gap-2 text-xs text-ink-700">
              <input
                type="checkbox"
                className="mt-1"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>
                I agree to the <a className="text-brand-600">Terms of Service</a> and{" "}
                <a className="text-brand-600">Privacy Policy</a>.
              </span>
            </label>
            {error && (
              <p className="text-rose-600 text-sm" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" size="lg" disabled={busy}>
              {busy ? "Creating…" : "Create Account →"}
            </Button>
          </form>
          <div className="text-center text-xs text-ink-500 border-t pt-4">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-brand-600">
              Log In
            </Link>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
