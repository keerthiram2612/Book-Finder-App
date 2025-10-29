import React from "react";

export default function Dashboard({ user, onSignOut }) {
  // Layout styles
  const layout = {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    minHeight: "100vh",
  };

  // fallback to column layout on small screens
  const responsiveMediaQuery = `@media (max-width: 820px)`;

  // We'll implement a small JS-based responsiveness using inline styles:
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 820);
  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 820);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const sidebar = {
    background: "linear-gradient(180deg,#ffffff,#f7fbff)",
    padding: 20,
    borderRight: "1px solid #eef3fb",
    boxShadow: "inset -2px 0 0 rgba(2,6,23,0.02)",
    display: isMobile ? "none" : "block",
  };

  const header = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 22px",
    borderBottom: "1px solid #eef3fb",
    background: "white",
  };

  const rightArea = {
    display: "flex",
    alignItems: "center",
    gap: 12,
  };

  const userBadge = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#f1f5f9",
    padding: "8px 12px",
    borderRadius: 999,
  };

  const avatar = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#6a11cb,#2575fc)",
    color: "white",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 15,
  };

  const signoutBtn = {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid transparent",
    background: "white",
    cursor: "pointer",
    fontWeight: 600,
  };

  const content = {
    padding: 22,
    background: "#f5f7fb",
    minHeight: "calc(100vh - 70px)",
  };

  // small cards grid
  const grid = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
    gap: 16,
    marginTop: 14,
  };

  const card = {
    background: "white",
    padding: 16,
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(12,24,48,0.06)",
  };

  // helper: initials from name
  const initials = (n) =>
    n
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={header}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 8, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <span style={{ fontSize: 20 }}>📚</span>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Book Finder Dashboard</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Welcome back — quick overview</div>
          </div>
        </div>

        {/* Right side user area */}
        <div style={rightArea}>
          <div style={userBadge} title={user.name}>
            <div style={avatar}>{initials(user.name)}</div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700 }}>{user.name}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Signed in</div>
            </div>
          </div>

          <button
            onClick={onSignOut}
            style={signoutBtn}
            aria-label="Sign out"
            title="Sign out"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ display: isMobile ? "block" : "grid", gridTemplateColumns: "260px 1fr" }}>
        {/* Sidebar (hidden on mobile) */}
        <aside style={sidebar}>
          <nav>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
              {["Home", "Search Books", "Favorites", "Settings"].map((it) => (
                <li key={it} style={{ padding: "10px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 600, color: "#0f1724" }}>
                  {it}
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main style={content}>
          <section>
            <h2 style={{ margin: 0, fontSize: 18 }}>Hello, {user.name.split(" ")[0]} 👋</h2>
            <p style={{ marginTop: 6, color: "#475569" }}>
              This is a fake dashboard. The name you entered at sign-in is registered and displayed on the right.
            </p>

            <div style={grid}>
              <div style={card}>
                <div style={{ fontSize: 14, color: "#94a3b8" }}>Total searches</div>
                <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>—</div>
              </div>

              <div style={card}>
                <div style={{ fontSize: 14, color: "#94a3b8" }}>Saved books</div>
                <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>—</div>
              </div>

              <div style={card}>
                <div style={{ fontSize: 14, color: "#94a3b8" }}>Profile</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                  <div style={{ ...avatar, width: 48, height: 48, fontSize: 18 }}>{initials(user.name)}</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Member (fake)</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginTop: 18 }}>
            <div style={{ background: "white", padding: 16, borderRadius: 12 }}>
              <h3 style={{ marginTop: 0 }}>Quick actions</h3>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button style={{ padding: "10px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: "#eef2ff", fontWeight: 700 }}>
                  🔎 Search Books
                </button>
                <button style={{ padding: "10px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: "#fff7ed", fontWeight: 700 }}>
                  ⭐ View Favorites
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
