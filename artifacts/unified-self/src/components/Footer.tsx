import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="tus-footer">
      <nav className="footer-nav">
        <Link href="/about">About</Link>
        <Link href="/sample">Sample Report</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/connect">Connect</Link>
        <Link href="/privacy">Privacy Policy</Link>
      </nav>
      <p>
        © {new Date().getFullYear()} The Unified Spirit &nbsp;·&nbsp;{" "}
        <a href="mailto:4pointspirit@gmail.com">4pointspirit@gmail.com</a>
      </p>
      <p style={{ marginTop: 4 }}>
        Reports crafted personally and delivered within 24 hours of purchase.
      </p>
    </footer>
  );
}
