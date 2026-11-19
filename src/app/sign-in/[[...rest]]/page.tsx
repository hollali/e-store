"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth/client";

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    return e;
  }

  function blur(field: "email" | "password") {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((prev) => ({ ...prev, ...validate() }));
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setTouched({ email: true, password: true });
    if (Object.keys(e).length) return;
    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      setErrors({ form: error.message || "Invalid email or password" });
      setLoading(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  const inputClass = (hasError: boolean) =>
    `w-full rounded-lg border px-3 py-2.5 text-base transition-colors focus:outline-none focus:ring-2 ${
      hasError
        ?         "border-destructive focus:border-destructive focus:ring-destructive/20"
        : "border-border focus:border-primary focus:ring-primary/20"
    }`;

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6">
          <p className="eyebrow mb-2">AfricVogue</p>
          <h1 className="font-serif text-3xl font-semibold text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your AfricVogue account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched.email) setErrors((prev) => ({ ...prev, email: validate().email }));
              }}
              onBlur={() => blur("email")}
              className={inputClass(!!(touched.email && errors.email))}
              aria-invalid={!!(touched.email && errors.email)}
              aria-describedby={touched.email && errors.email ? "email-error" : undefined}
            />
            {touched.email && errors.email && (
              <p id="email-error" className="mt-1 text-xs text-destructive">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) setErrors((prev) => ({ ...prev, password: validate().password }));
                }}
                onBlur={() => blur("password")}
                className={`${inputClass(!!(touched.password && errors.password))} pr-10`}
                aria-invalid={!!(touched.password && errors.password)}
                aria-describedby={touched.password && errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {touched.password && errors.password && (
              <p id="password-error" className="mt-1 text-xs text-destructive">{errors.password}</p>
            )}
          </div>
          {errors.form && (
            <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errors.form}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-medium text-primary hover:text-primary/80">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
