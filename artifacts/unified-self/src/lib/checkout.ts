const ALLOWED_REDIRECT_HOSTS = ["checkout.stripe.com", "billing.stripe.com"];

function isAllowedRedirect(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      ALLOWED_REDIRECT_HOSTS.some(
        (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`),
      )
    );
  } catch {
    return false;
  }
}

export async function handleCheckout(productKey: string): Promise<void> {
  const origin = window.location.origin;
  const base = (import.meta.env.BASE_URL as string)?.replace(/\/$/, "") || "";
  try {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productKey,
        successUrl: `${origin}${base}/`,
        cancelUrl: `${origin}${base}/`,
      }),
    });
    const data = (await res.json()) as { url?: string; error?: string };
    if (data.url && isAllowedRedirect(data.url)) {
      window.location.href = data.url;
    } else if (data.url) {
      alert("Unexpected redirect URL. Please contact 4pointspirit@gmail.com");
    } else {
      alert(data.error || "Unable to start checkout. Please try again or contact 4pointspirit@gmail.com");
    }
  } catch (_err) {
    alert("Unable to reach the checkout. Please try again or contact 4pointspirit@gmail.com");
  }
}

export async function handleSubscribe(): Promise<void> {
  const origin = window.location.origin;
  const base = (import.meta.env.BASE_URL as string)?.replace(/\/$/, "") || "";
  try {
    const res = await fetch("/api/stripe/subscribe", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        successUrl: `${origin}${base}/portal`,
        cancelUrl: `${origin}${base}/`,
      }),
    });
    const data = (await res.json()) as { url?: string; error?: string };
    if (data.url && isAllowedRedirect(data.url)) {
      window.location.href = data.url;
    } else if (data.url) {
      alert("Unexpected redirect URL. Please contact 4pointspirit@gmail.com");
    } else {
      alert(data.error || "Please sign in to your portal to subscribe.");
    }
  } catch (_err) {
    alert("Please sign in to your portal to start a membership.");
  }
}
