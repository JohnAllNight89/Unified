import { useEffect } from "react";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./shared.css";

export default function Privacy() {
  useEffect(() => { document.title = "Privacy Policy — The Unified Spirit"; }, []);

  return (
    <div className="tus-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Starfield fixed />
      <Nav />
      <main id="main-content">
      <section>
        <div className="inner-sm">
          <span className="tag">Legal</span>
          <h1 className="sec-title">Privacy Policy</h1>
          <div style={{ color: "var(--text)", fontSize: ".95rem", lineHeight: 2, display: "flex", flexDirection: "column", gap: 20 }}>
            <p>Last updated: {new Date().getFullYear()}</p>
            <p>The Unified Spirit ("we," "us," or "our") is committed to protecting your personal information. This policy explains what information we collect, how we use it, and your rights regarding that information.</p>
            <h3 style={{ fontFamily: "'Cinzel', serif", color: "var(--goldL)", fontSize: "1rem", marginBottom: -8 }}>Information We Collect</h3>
            <p>We collect information you provide directly to us, including your name, email address, date of birth, time of birth, and place of birth when you purchase a report or contact us. We use this information solely to create your personalized Soul Blueprint report.</p>
            <h3 style={{ fontFamily: "'Cinzel', serif", color: "var(--goldL)", fontSize: "1rem", marginBottom: -8 }}>How We Use Your Information</h3>
            <p>Your birth data is used exclusively to create your personal report. We will never sell, share, or distribute your information to third parties. If you subscribed to our email list, we may send you occasional insights and updates — you may unsubscribe at any time.</p>
            <h3 style={{ fontFamily: "'Cinzel', serif", color: "var(--goldL)", fontSize: "1rem", marginBottom: -8 }}>Data Security</h3>
            <p>We take reasonable steps to protect your personal information from unauthorized access, use, or disclosure. Your data is stored securely and accessed only by the practitioner creating your report.</p>
            <h3 style={{ fontFamily: "'Cinzel', serif", color: "var(--goldL)", fontSize: "1rem", marginBottom: -8 }}>Contact</h3>
            <p>For any privacy-related questions, contact us at <a href="mailto:4pointspirit@gmail.com" style={{ color: "var(--goldL)" }}>4pointspirit@gmail.com</a></p>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
}
