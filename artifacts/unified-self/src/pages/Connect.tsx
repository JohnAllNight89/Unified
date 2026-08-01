import { useState } from "react";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";
import "./shared.css";
import "./connect.css";

const FORMSPREE = "https://formspree.io/f/xnjylkev";

type FormState = "idle" | "submitting" | "success" | "error";

export default function Connect() {
  useSEO({
    title: "Contact The Unified Spirit — Request a Soul Blueprint Reading",
    description: "Get in touch with The Unified Spirit. Ask questions, share what you're seeking, or reach out directly to learn more about your Soul Blueprint report.",
    path: "/connect",
  });

  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("submitting");
    setErrorMsg("");

    try {
      const body = new FormData();
      body.append("email", email.trim());
      if (message.trim()) body.append("message", message.trim());

      const res = await fetch(FORMSPREE, {
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setState("success");
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || "Something went wrong");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      setErrorMsg(msg);
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
                <label className="cn-label" htmlFor="cn-email">
                  Email Address <span className="cn-label-req">*</span>
                </label>
                <input
                  id="cn-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="cn-field">
                <label className="cn-label" htmlFor="cn-message">
                  What Are You Seeking?{" "}
                  <span className="cn-label-opt">(optional)</span>
                </label>
                <textarea
                  id="cn-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share what's on your mind — questions, intentions, anything you'd like us to know before we connect."
                  rows={5}
                />
              </div>

              {state === "error" && (
                <div className="cn-error">{errorMsg || "Something went wrong. Please try again."}</div>
              )}

              <button
                type="submit"
                className="cn-submit"
                disabled={state === "submitting" || !email.trim()}
              >
                {state === "submitting" ? "Sending…" : "✦   Connect"}
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
