import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Card, CardBody, Input } from "@rocksa/ui";
import { useAuth } from "@rocksa/auth";

export const Route = createFileRoute("/auth/login")({ component: Login });

function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await auth.signIn(email, password);
      navigate({ to: "/workspace/overview" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  const oauth = (fn: () => Promise<void>) => async () => {
    setError(null);
    try {
      await fn();
      navigate({ to: "/workspace/overview" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "OAuth failed");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-50/60 p-6">
      <Card className="w-full max-w-md">
        <CardBody className="space-y-6">
          <div className="text-center">
            <h1 className="font-display text-4xl">Welcome Back</h1>
            <p className="text-ink-500 text-sm mt-1">
              Sign in to your curated collection.
            </p>
          </div>
          <form className="space-y-3" onSubmit={submit}>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-ink-700">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/auth/reset" className="text-brand-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            {error && (
              <p className="text-rose-600 text-sm" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" size="lg" disabled={busy}>
              {busy ? "Signing in…" : "Sign In"}
            </Button>
          </form>
          <div className="relative text-center">
            <span className="bg-white px-2 text-xs text-ink-500 relative z-10">
              Or continue with
            </span>
            <span className="absolute left-0 top-1/2 h-px w-full bg-ink-700/10" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={oauth(auth.signInWithGoogle)}>
              Google
            </Button>
            <Button variant="secondary" onClick={oauth(auth.signInWithApple)}>
              Apple
            </Button>
          </div>
          <div className="text-center text-xs text-ink-500">
            New to Rocksa?{" "}
            <Link to="/auth/register" className="text-brand-600">
              Request Access
            </Link>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
