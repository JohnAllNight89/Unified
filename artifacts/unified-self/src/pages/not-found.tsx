import { Link } from "wouter";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./shared.css";

export default function NotFound() {
  return (
    <div className="tus-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Starfield fixed />
      <Nav />
      <main id="main-content">
        <section style={{ textAlign: "center" }} aria-labelledby="not-found-heading">
          <div className="inner-sm">
            <span className="tag">404</span>
            <h1 className="sec-title" id="not-found-heading" style={{ fontSize: "clamp(1.8rem,5vw,3rem)", marginBottom: 20 }}>
              Page Not Found.
            </h1>
            <p className="sec-body" style={{ marginBottom: 36 }}>
              The page you were looking for doesn&rsquo;t exist, or may have moved.
              Let&rsquo;s get you back on the right path.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/" className="hero-btn">← Return Home</Link>
              <Link href="/connect" className="outline-btn">Get in Touch</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
