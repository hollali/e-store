"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth/client";

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  country?: string;
  form?: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Ghana");
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  function validate(): Errors {
    const e: Errors = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Use at least 8 characters";
    if (!phone.trim()) e.phone = "Phone number is required";
    if (!addressLine1.trim()) e.addressLine1 = "Address is required";
    if (!city.trim()) e.city = "City is required";
    if (!country.trim()) e.country = "Country is required";
    return e;
  }

  function blur(field: string) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((prev) => ({ ...prev, ...validate() }));
  }

  function change(setter: (v: string) => void, field: string, value: string) {
    setter(value);
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validate()[field as keyof Errors] }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    setTouched({
      name: true,
      email: true,
      password: true,
      phone: true,
      addressLine1: true,
      city: true,
      country: true,
    });
    if (Object.keys(v).length) return;
    setLoading(true);
    const { error } = await authClient.signUp.email({ email, password, name });
    if (error) {
      setErrors({ form: error.message || "Could not create account" });
      setLoading(false);
      return;
    }
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          addressLine1,
          addressLine2,
          city,
          region,
          postalCode,
          country,
        }),
      });
    } catch {
      // profile save is best-effort
    }
    router.push("/");
    router.refresh();
  }

  const inputClass = (hasError: boolean) =>
    `w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
        : "border-gray-300 focus:border-primary focus:ring-primary/20"
    }`;

  const Field = ({
    label,
    id,
    required,
    error,
    children,
  }: {
    label: string;
    id: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor={id}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50 px-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Create account</h1>
          <p className="mt-1 text-sm text-gray-500 text-center">Join AfricVogue today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 text-center">
              Account details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full name" id="name" required error={touched.name ? errors.name : undefined}>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => change(setName, "name", e.target.value)}
                  onBlur={() => blur("name")}
                  className={inputClass(!!(touched.name && errors.name))}
                  aria-invalid={!!(touched.name && errors.name)}
                />
              </Field>
              <Field label="Email" id="email" required error={touched.email ? errors.email : undefined}>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => change(setEmail, "email", e.target.value)}
                  onBlur={() => blur("email")}
                  className={inputClass(!!(touched.email && errors.email))}
                  aria-invalid={!!(touched.email && errors.email)}
                />
              </Field>
            </div>
            <Field label="Password" id="password" required error={touched.password ? errors.password : undefined}>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => change(setPassword, "password", e.target.value)}
                  onBlur={() => blur("password")}
                  className={`${inputClass(!!(touched.password && errors.password))} pr-10`}
                  aria-invalid={!!(touched.password && errors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 text-center">
              Contact &amp; shipping
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Phone number" id="phone" required error={touched.phone ? errors.phone : undefined}>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => change(setPhone, "phone", e.target.value)}
                  onBlur={() => blur("phone")}
                  className={inputClass(!!(touched.phone && errors.phone))}
                  aria-invalid={!!(touched.phone && errors.phone)}
                />
              </Field>
              <Field label="Address line 1" id="addressLine1" required error={touched.addressLine1 ? errors.addressLine1 : undefined}>
                <input
                  id="addressLine1"
                  type="text"
                  autoComplete="address-line1"
                  value={addressLine1}
                  onChange={(e) => change(setAddressLine1, "addressLine1", e.target.value)}
                  onBlur={() => blur("addressLine1")}
                  className={inputClass(!!(touched.addressLine1 && errors.addressLine1))}
                  aria-invalid={!!(touched.addressLine1 && errors.addressLine1)}
                />
              </Field>
            </div>
            <Field label="Address line 2 (optional)" id="addressLine2">
              <input
                id="addressLine2"
                type="text"
                autoComplete="address-line2"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className={inputClass(false)}
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="City" id="city" required error={touched.city ? errors.city : undefined}>
                <input
                  id="city"
                  type="text"
                  autoComplete="address-level2"
                  value={city}
                  onChange={(e) => change(setCity, "city", e.target.value)}
                  onBlur={() => blur("city")}
                  className={inputClass(!!(touched.city && errors.city))}
                  aria-invalid={!!(touched.city && errors.city)}
                />
              </Field>
              <Field label="Region / State" id="region">
                <input
                  id="region"
                  type="text"
                  autoComplete="address-level1"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className={inputClass(false)}
                />
              </Field>
              <Field label="Postal code" id="postalCode">
                <input
                  id="postalCode"
                  type="text"
                  autoComplete="postal-code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className={inputClass(false)}
                />
              </Field>
              <Field label="Country" id="country" required error={touched.country ? errors.country : undefined}>
                <input
                  id="country"
                  type="text"
                  autoComplete="country-name"
                  value={country}
                  onChange={(e) => change(setCountry, "country", e.target.value)}
                  onBlur={() => blur("country")}
                  className={inputClass(!!(touched.country && errors.country))}
                  aria-invalid={!!(touched.country && errors.country)}
                />
              </Field>
            </div>
          </section>

          {errors.form && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {errors.form}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-primary hover:text-primary/80">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
