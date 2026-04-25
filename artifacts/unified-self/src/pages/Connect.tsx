import { useEffect, useState } from "react";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { handleCheckout } from "@/lib/checkout";
import "./shared.css";
import "./connect.css";

function useFadeIn() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

type FormState = "idle" | "submitting" | "success" | "error";

export default function Connect() {
  useFadeIn();

  const [state, setState] = useState<FormState>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    birthDate: "",
    message: "",
    subscribed: true,
  });
  const [errorMsg, setErrorMsg] = useState("");

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
          birthDate: form.birthDate || undefined,
          message: form.message.trim() || undefined,
          subscribed: form.subscribed,
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
      <Starfield fixed />
      <Nav />

      <section className="connect-hero">
        <div className="inner-sm" style={{ textAlign: "center" }}>
          <span className="tag fade-in">Connect</span>
          <h1 className="sec-title fade-in" style={{ fontSize: "clamp(1.8rem,5vw,3rem)", marginBottom: 20 }}>
            Let's Begin Here.
          </h1>
          <p className="sec-body fade-in" style={{ marginBottom: 0 }}>
            Whether you have questions before ordering, want to receive soul insights and updates,
            or simply want to say hello — this is the place. Every message is read and responded
            to personally.
          </p>
        </div>
      </section>

      <div className="rule"><span>✦</span></div>

      <section>
        <div className="inner-sm" style={{ paddingTop: 48 }}>
          {state === "success" ? (
            <div className="connect-success fade-in">
              <div className="connect-success-icon">✦</div>
              <h2>You're In.</h2>
              <p>
                Thank you, {form.name.split(" ")[0]}. We have received your message and will
                respond personally within 24 hours. If you subscribed to soul insights, expect
                something meaningful in your inbox soon.
              </p>
              <button
                className="hero-btn"
                onClick={() => handleCheckout("soul_blueprint")}
                style={{ margin: "32px auto 0" }}
              >
                ✦ &nbsp;Reveal My Blueprint
              </button>
            </div>
          ) : (
            <form className="connect-form fade-in" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label" htmlFor="cf-name">Full Name <span>*</span></label>
                  <input
                    id="cf-name"
                    className="form-input"
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Your name"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="cf-email">Email Address <span>*</span></label>
                  <input
                    id="cf-email"
                    className="form-input"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="cf-birth">
                  Date of Birth <span className="form-optional">(optional — for personalized insights)</span>
                </label>
                <input
                  id="cf-birth"
                  className="form-input"
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => update("birthDate", e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="cf-message">
                  What are you seeking? <span className="form-optional">(optional)</span>
                </label>
                <textarea
                  id="cf-message"
                  className="form-textarea"
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Share what's on your mind — questions, intentions, anything you'd like us to know before we connect."
                  rows={5}
                />
              </div>

              <div className="form-check">
                <input
                  id="cf-subscribe"
                  type="checkbox"
                  className="form-checkbox"
                  checked={form.subscribed}
                  onChange={(e) => update("subscribed", e.target.checked)}
                />
                <label htmlFor="cf-subscribe" className="form-check-label">
                  Yes — send me soul insights, alignment wisdom, and occasional updates from The Unified Spirit.
                </label>
              </div>

              {state === "error" && (
                <div className="form-error">{errorMsg || "Something went wrong. Please try again."}</div>
              )}

              <button
                type="submit"
                className="hero-btn form-submit"
                disabled={state === "submitting" || !form.name.trim() || !form.email.trim()}
              >
                {state === "submitting" ? "Sending…" : "✦ \u00A0Send My Message"}
              </button>

              <p className="form-note">
                We respond to every message personally within 24 hours.
                Your information is never shared or sold.
              </p>
            </form>
          )}
        </div>
      </section>

      <div className="rule"><span>✦</span></div>

      <section style={{ textAlign: "center" }}>
        <div className="inner-sm" style={{ paddingTop: 48, paddingBottom: 64 }}>
          <span className="tag fade-in">Direct Contact</span>
          <div className="contact-links fade-in">
            <a href="mailto:4pointspirit@gmail.com" className="contact-link">
              <span className="contact-icon">✉</span>
              <span>4pointspirit@gmail.com</span>
            </a>
          </div>
          <p className="contact-note fade-in">
            All inquiries are answered personally, typically within the same day.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
