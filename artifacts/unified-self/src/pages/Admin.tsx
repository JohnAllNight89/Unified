import { useState, useEffect, useCallback } from "react";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import "./shared.css";

interface Stats {
  users: { total: number; withProfile: number; subscribersOnly: number };
  subscribers: { active: number };
  orders: { total: number; revenueCents: number; fulfilled: number; unfulfilled: number };
}

interface User {
  id: number;
  clerkUserId: string;
  fullName: string | null;
  birthDate: string | null;
  birthPlace: string | null;
  subscriptionStatus: string | null;
  stripeCustomerId: string | null;
  createdAt: string;
}

interface Order {
  id: number;
  clerkUserId: string | null;
  customerEmail: string | null;
  productKey: string;
  productName: string;
  amountCents: number;
  status: string;
  fulfilled: boolean;
  createdAt: string;
}

type Tab = "overview" | "users" | "orders";

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getAdminPassword(): string | null {
  return sessionStorage.getItem("admin_password");
}

function adminHeaders(): HeadersInit {
  return {
    "x-admin-password": getAdminPassword() || "",
  };
}

export default function Admin() {
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userPage, setUserPage] = useState(1);
  const [userTotal, setUserTotal] = useState(0);
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotal, setOrderTotal] = useState(0);

  const [authenticated, setAuthenticated] = useState(!!getAdminPassword());
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    setChecking(true);
    setPasswordError(null);
    try {
      const res = await fetch("/api/admin/stats", {
        credentials: "include",
        headers: { "x-admin-password": passwordInput },
      });
      if (res.status === 403) {
        setPasswordError("Incorrect password.");
        setChecking(false);
        return;
      }
      if (!res.ok) throw new Error(`${res.status}`);
      sessionStorage.setItem("admin_password", passwordInput);
      setAuthenticated(true);
      setStats(await res.json());
    } catch (err) {
      console.error("[Admin] auth error:", err);
      setPasswordError("Something went wrong. Please try again.");
    }
    setChecking(false);
  }

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats", { credentials: "include", headers: adminHeaders() });
      if (res.status === 403) {
        sessionStorage.removeItem("admin_password");
        setAuthenticated(false);
        setError(null);
        return;
      }
      if (!res.ok) throw new Error(`${res.status}`);
      setStats(await res.json());
    } catch (err) {
      console.error("[Admin] stats error:", err);
      setError("Failed to load admin dashboard.");
    }
  }, []);

  const loadUsers = useCallback(async (page: number) => {
    try {
      const res = await fetch(`/api/admin/users?page=${page}&limit=25`, { credentials: "include", headers: adminHeaders() });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setUsers(data.users);
      setUserTotal(data.total);
      setUserPage(page);
    } catch (err) {
      console.error("[Admin] users error:", err);
    }
  }, []);

  const loadOrders = useCallback(async (page: number) => {
    try {
      const res = await fetch(`/api/admin/orders?page=${page}&limit=25`, { credentials: "include", headers: adminHeaders() });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setOrders(data.orders);
      setOrderTotal(data.total);
      setOrderPage(page);
    } catch (err) {
      console.error("[Admin] orders error:", err);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    loadStats().then(() => setLoading(false));
  }, [authenticated, loadStats]);

  useEffect(() => {
    if (!authenticated) return;
    if (tab === "users") loadUsers(1);
    if (tab === "orders") loadOrders(1);
  }, [tab, authenticated, loadUsers, loadOrders]);

  async function handleFulfill(orderId: number) {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/fulfill`, {
        method: "PATCH",
        credentials: "include",
        headers: adminHeaders(),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, fulfilled: true } : o))
      );
      if (stats) {
        setStats({
          ...stats,
          orders: {
            ...stats.orders,
            fulfilled: stats.orders.fulfilled + 1,
            unfulfilled: stats.orders.unfulfilled - 1,
          },
        });
      }
    } catch (err) {
      console.error("[Admin] fulfill error:", err);
    }
  }

  if (!authenticated) {
    return (
      <div className="tus-page">
        <Starfield fixed />
        <Nav />
        <div style={{ maxWidth: 400, margin: "0 auto", paddingTop: "8rem", textAlign: "center" }}>
          <span className="tag">Admin</span>
          <h1 style={{ color: "var(--light)", fontSize: "1.5rem", margin: "0.5rem 0 1.5rem" }}>
            Enter Admin Password
          </h1>
          <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Password"
              autoFocus
              style={{
                padding: "0.8rem 1rem",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)",
                color: "var(--light)",
                fontSize: "1rem",
                outline: "none",
              }}
            />
            {passwordError && (
              <p style={{ color: "#e05252", fontSize: "0.9rem", margin: 0 }}>{passwordError}</p>
            )}
            <button
              type="submit"
              disabled={checking}
              className="hero-btn"
              style={{ width: "100%" }}
            >
              {checking ? "Checking…" : "Access Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="tus-page">
        <Starfield fixed />
        <Nav />
        <div style={{ textAlign: "center", paddingTop: "6rem", color: "var(--light)" }}>
          <p>Loading admin dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tus-page">
        <Starfield fixed />
        <Nav />
        <div style={{ textAlign: "center", paddingTop: "6rem", color: "var(--gold, #c9a84c)" }}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tus-page">
      <Starfield fixed />
      <Nav />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 1.5rem 3rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <span className="tag">Admin</span>
          <h1 style={{ color: "var(--light)", fontSize: "1.8rem", margin: "0.5rem 0" }}>
            Dashboard
          </h1>
        </div>

        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <StatCard label="Total Members" value={stats.users.total} />
            <StatCard label="With Profile" value={stats.users.withProfile} />
            <StatCard label="Active Subscribers" value={stats.subscribers.active} accent />
            <StatCard label="Total Orders" value={stats.orders.total} />
            <StatCard label="Revenue" value={formatCents(stats.orders.revenueCents)} accent />
            <StatCard label="Unfulfilled" value={stats.orders.unfulfilled} warn={stats.orders.unfulfilled > 0} />
          </div>
        )}

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.5rem" }}>
          {(["overview", "users", "orders"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: tab === t ? "var(--gold, #c9a84c)" : "transparent",
                color: tab === t ? "#06040f" : "var(--light)",
                border: "none",
                padding: "0.5rem 1.2rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: tab === t ? 700 : 400,
                fontSize: "0.9rem",
                textTransform: "capitalize",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "overview" && stats && (
          <div style={{ color: "var(--light)", lineHeight: 1.8 }}>
            <p><strong>{stats.users.total}</strong> total members have signed up.</p>
            <p><strong>{stats.users.withProfile}</strong> have created full profiles.</p>
            <p><strong>{stats.subscribers.active}</strong> are active subscribers ($3.99/mo).</p>
            <p><strong>{stats.orders.total}</strong> one-time report orders placed.</p>
            <p><strong>{formatCents(stats.orders.revenueCents)}</strong> total order revenue.</p>
            <p><strong>{stats.orders.fulfilled}</strong> fulfilled, <strong>{stats.orders.unfulfilled}</strong> awaiting fulfillment.</p>
          </div>
        )}

        {tab === "users" && (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", color: "var(--light)", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.15)", textAlign: "left" }}>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Birth Date</th>
                    <th style={thStyle}>Location</th>
                    <th style={thStyle}>Subscription</th>
                    <th style={thStyle}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <td style={tdStyle}>{u.fullName || <span style={{ opacity: 0.4 }}>No profile</span>}</td>
                      <td style={tdStyle}>{u.birthDate || "—"}</td>
                      <td style={tdStyle}>{u.birthPlace || "—"}</td>
                      <td style={tdStyle}>
                        <StatusBadge status={u.subscriptionStatus || "inactive"} />
                      </td>
                      <td style={tdStyle}>{formatDate(u.createdAt)}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={5} style={{ ...tdStyle, textAlign: "center", opacity: 0.5 }}>No users yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination page={userPage} total={userTotal} limit={25} onPage={loadUsers} />
          </>
        )}

        {tab === "orders" && (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", color: "var(--light)", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.15)", textAlign: "left" }}>
                    <th style={thStyle}>Product</th>
                    <th style={thStyle}>Customer</th>
                    <th style={thStyle}>Amount</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <td style={tdStyle}>{o.productName}</td>
                      <td style={tdStyle}>{o.customerEmail || "—"}</td>
                      <td style={tdStyle}>{formatCents(o.amountCents)}</td>
                      <td style={tdStyle}>
                        {o.fulfilled
                          ? <span style={{ color: "#4ade80" }}>Fulfilled</span>
                          : <span style={{ color: "#facc15" }}>Pending</span>
                        }
                      </td>
                      <td style={tdStyle}>{formatDate(o.createdAt)}</td>
                      <td style={tdStyle}>
                        {!o.fulfilled && (
                          <button
                            onClick={() => handleFulfill(o.id)}
                            style={{
                              background: "var(--gold, #c9a84c)",
                              color: "#06040f",
                              border: "none",
                              padding: "0.3rem 0.8rem",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                            }}
                          >
                            Mark Fulfilled
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={6} style={{ ...tdStyle, textAlign: "center", opacity: 0.5 }}>No orders yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination page={orderPage} total={orderTotal} limit={25} onPage={loadOrders} />
          </>
        )}
      </main>
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: "0.6rem 0.8rem", fontWeight: 600, opacity: 0.7, whiteSpace: "nowrap" };
const tdStyle: React.CSSProperties = { padding: "0.6rem 0.8rem", whiteSpace: "nowrap" };

function StatCard({ label, value, accent, warn }: { label: string; value: string | number; accent?: boolean; warn?: boolean }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "12px",
      padding: "1.2rem",
    }}>
      <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
      <div style={{
        fontSize: "1.6rem",
        fontWeight: 700,
        color: warn ? "#f87171" : accent ? "var(--gold, #c9a84c)" : "var(--light)",
      }}>
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "#4ade80",
    trialing: "#60a5fa",
    inactive: "rgba(255,255,255,0.3)",
    canceled: "#f87171",
    past_due: "#facc15",
  };
  return (
    <span style={{
      display: "inline-block",
      padding: "0.15rem 0.6rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: 600,
      color: "#06040f",
      background: colors[status] || "rgba(255,255,255,0.2)",
    }}>
      {status}
    </span>
  );
}

function Pagination({ page, total, limit, onPage }: { page: number; total: number; limit: number; onPage: (p: number) => void }) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "1.5rem" }}>
      <button
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        style={pageBtnStyle(page <= 1)}
      >
        Previous
      </button>
      <span style={{ color: "var(--light)", padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
        style={pageBtnStyle(page >= totalPages)}
      >
        Next
      </button>
    </div>
  );
}

function pageBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    background: disabled ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)",
    color: disabled ? "rgba(255,255,255,0.2)" : "var(--light)",
    border: "none",
    padding: "0.4rem 1rem",
    borderRadius: "6px",
    cursor: disabled ? "default" : "pointer",
    fontSize: "0.85rem",
  };
}
