import { useEffect, useState } from "react";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./shared.css";
import "./connect.css";

type FormState = "idle" | "submitting" | "success" | "error";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function Connect() {
  useEffect(() => { document.title = "Connect — The Unified Spirit"; }, []);

  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    birthMonth: "",
    message: "",
    subscribe: true,
  });

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          birthDate: form.birthMonth || undefined,
          message: form.message.trim() || undefined,
          subscribed: form.subscribe,
          source: "connect-form",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }

      setState("success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Please try again.";
      setErrorMsg(message);
      setState("error");
    }
  };

  return (
    <div className="tus-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Starfield fixed />
      <Nav />

      <main id="main-content">

        {/* ── HERO ── */}
        <section className="cn-hero" aria-labelledby="connect-heading">
          <div className="cn-hero-glow" />
          <div className="cn-eyebrow">Connect</div>
          <h1 id="connect-heading">Let's Begin Here.</h1>
        </section>

        {/* ── FORM / SUCCESS ── */}
        <div className="cn-form-wrap">

          {state === "success" ? (
            <div className="cn-success">
              <div className="cn-success-diamond">✦</div>
              <h2>Thank you for<br /><em>reaching out.</em></h2>
              <p>Your message has been received. We will get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>

              <div className="cn-field">
                <label className="cn-label" htmlFor="cn-name">
                  Full Name <span className="cn-label-req">*</span>
                </label>
                <input
                  id="cn-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your name"
                  required
                  autoComplete="name"
                />
              </div>

              <div className="cn-field">
                <label className="cn-label" htmlFor="cn-email">
                  Email Address <span className="cn-label-req">*</span>
                </label>
                <input
                  id="cn-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="cn-field">
                <label className="cn-label" htmlFor="cn-dob">
                  Date of Birth{" "}
                  <span className="cn-label-opt">(optional — for personalized insights)</span>
                </label>
                <select
                  id="cn-dob"
                  value={form.birthMonth}
                  onChange={(e) => update("birthMonth", e.target.value)}
                >
                  <option value="" disabled></option>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="cn-field">
                <label className="cn-label" htmlFor="cn-message">
                  What Are You Seeking?{" "}
                  <span className="cn-label-opt">(optional)</span>
                </label>
                <textarea
                  id="cn-message"
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Share what's on your mind — questions, intentions, anything you'd like us to know before we connect."
                />
              </div>

              <div className="cn-check">
                <input
                  id="cn-subscribe"
                  type="checkbox"
                  checked={form.subscribe}
                  onChange={(e) => update("subscribe", e.target.checked)}
                />
                <label htmlFor="cn-subscribe" className="cn-check-label">
                  Yes — send me soul insights, alignment wisdom, and occasional updates from The Unified Spirit.
                </label>
              </div>

              {state === "error" && (
                <div className="cn-error">{errorMsg || "Something went wrong. Please try again."}</div>
              )}

              <button
                type="submit"
                className="cn-submit"
                disabled={state === "submitting" || !form.name.trim() || !form.email.trim()}
              >
                {state === "submitting" ? "Sending…" : "✦   Send My Message"}
              </button>

              <p className="cn-form-note">Your information is never shared or sold.</p>
            </form>
          )}
        </div>

        {/* ── DIRECT CONTACT ── */}
        <div className="cn-direct">
          <div className="cn-direct-eyebrow">Direct Contact</div>
          <a href="mailto:4pointspirit@gmail.com" className="cn-direct-email">
            4pointspirit@gmail.com
          </a>
          <p>All inquiries are answered personally.</p>
        </div>

      </main>
      <Footer />
    </div>
  );
}
