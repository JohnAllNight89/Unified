import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useUser, SignOutButton, Show } from "@clerk/react";
import bannerImg from "/logo-new.png";

const NAV_LINKS = [
  { href: "/about",    label: "About" },
  { href: "/discover", label: "Discover" },
  { href: "/sample",   label: "Sample Report" },
  { href: "/faq",      label: "FAQ" },
  { href: "/connect",  label: "Connect" },
];

const NAV_HEIGHT = 72;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [location] = useLocation();
  const { isLoaded } = useUser();
  const bannerRef = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => {
      if (bannerRef.current) {
        const bannerH = bannerRef.current.offsetHeight;
        setSticky(bannerH > 0 && window.scrollY >= bannerH);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="tus-header">
      <div ref={bannerRef} className="tus-banner">
        <Link href="/" onClick={close}>
          <img src={bannerImg} alt="The Unified Spirit" className="tus-banner-img" />
        </Link>
      </div>

      <nav className={`tus-nav${sticky ? " tus-nav--sticky" : ""}`}>
        <Link href="/" className="nav-brand" onClick={close}>
          The Unified Spirit
        </Link>

        <div className="nav-links">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link${location === href || (href === "/discover" && location.startsWith("/discover")) ? " active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="nav-auth-btns">
          <Show when="signed-out">
            <Link href="/sign-in" className="nav-link nav-login-link" style={{ whiteSpace: "nowrap" }}>
              Member Log In
            </Link>
            <Link href="/sign-up" className="nav-cta">
              Join Free
            </Link>
          </Show>
          <Show when="signed-in">
            <Link
              href="/portal"
              className={`nav-link${location.startsWith("/portal") ? " active" : ""}`}
            >
              My Portal
            </Link>
            <Link
              href="/admin"
              className={`nav-link${location.startsWith("/admin") ? " active" : ""}`}
            >
              Admin
            </Link>
            <SignOutButton redirectUrl="/">
              <button className="nav-signout-btn">Sign Out</button>
            </SignOutButton>
          </Show>
        </div>

        <button
          className={`nav-hamburger${open ? " open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="nav-mobile"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {sticky && <div style={{ height: NAV_HEIGHT }} aria-hidden="true" />}

      <div id="nav-mobile" className={`nav-mobile${open ? " open" : ""}${sticky ? " nav-mobile--sticky" : ""}`}>
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`nav-mobile-link${location === href || (href === "/discover" && location.startsWith("/discover")) ? " active" : ""}`}
            onClick={close}
          >
            {label}
          </Link>
        ))}
        <Show when="signed-in">
          <Link
            href="/portal"
            className={`nav-mobile-link${location.startsWith("/portal") ? " active" : ""}`}
            onClick={close}
          >
            My Portal
          </Link>
          <Link
            href="/admin"
            className={`nav-mobile-link${location.startsWith("/admin") ? " active" : ""}`}
            onClick={close}
          >
            Admin
          </Link>
          <SignOutButton redirectUrl="/">
            <button className="nav-mobile-link" style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }} onClick={close}>
              Sign Out
            </button>
          </SignOutButton>
        </Show>
        <Show when="signed-out">
          <Link href="/sign-in" className="nav-mobile-link" onClick={close}>
            Member Log In
          </Link>
          <Link href="/sign-up" className="nav-mobile-cta" onClick={close}>
            Join Free
          </Link>
        </Show>
      </div>
    </header>
  );
}
