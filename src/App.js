import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import BookList from "./components/BookList";
import { searchBooks } from "./utils/api";
import { getAIRecommendations } from "./utils/aiRecommendBooks";

export default function App() {
  // ---- USER LOGIN STATE ----
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bookfinder_user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem("bookfinder_user", JSON.stringify(user));
    else localStorage.removeItem("bookfinder_user");
  }, [user]);

  // ---- BOOK SEARCH STATES ----
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiRecs, setAiRecs] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const onSearch = async () => {
    if (!query.trim()) {
      setBooks([]);
      setError("Please enter a book title.");
      return;
    }
    setLoading(true);
    setError("");
    setAiRecs("");

    try {
      const data = await searchBooks(query);
      if (data.docs && data.docs.length > 0) {
        setBooks(data.docs);
      } else {
        setBooks([]);
        setError("No results found.");
      }
    } catch (err) {
      setError("Failed to fetch. Check your network.");
    } finally {
      setLoading(false);
    }

    // Fetch AI recommendations after search
    setAiLoading(true);
    const recs = await getAIRecommendations(query);
    setAiRecs(recs);
    setAiLoading(false);
  };

  // ---- STYLES ----
  const mainContainer = {
    fontFamily: "Inter, Arial, sans-serif",
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#0f172a",
  };

  const signInContainer = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    color: "white",
    padding: 20,
  };

  const signInCard = {
    background: "white",
    color: "#0f172a",
    borderRadius: 12,
    padding: "30px 28px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    width: "100%",
    maxWidth: 400,
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ddd",
    marginBottom: 12,
    outline: "none",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px 14px",
    fontSize: 16,
    fontWeight: 600,
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(90deg, #2575fc, #6a11cb)",
    color: "white",
    cursor: "pointer",
  };

  const dashboardHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    background: "white",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  };

  const logoStyle = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 700,
    fontSize: 20,
  };

  const userInfo = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#f1f5f9",
    padding: "8px 14px",
    borderRadius: 999,
  };

  const avatarStyle = {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#6a11cb,#2575fc)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 16,
  };

  const signOutButton = {
    padding: "8px 12px",
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  };

  const appStyle = {
    maxWidth: 980,
    margin: "20px auto",
    padding: "0 16px",
  };

  // ---- SIGN-IN VIEW ----
  const [tempName, setTempName] = useState("");
  const handleSignIn = (e) => {
    e.preventDefault();
    if (!tempName.trim()) return alert("Please enter your name");
    setUser({ name: tempName.trim() });
  };

  // ---- HELPER ----
  const initials = (n) =>
    n
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  // ---- MAIN RENDER ----
  if (!user) {
    return (
      <div style={signInContainer}>
        <form style={signInCard} onSubmit={handleSignIn}>
          <div
            style={{
              fontSize: 40,
              background: "linear-gradient(135deg,#6a11cb,#2575fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            📚 Book Finder
          </div>
          <p style={{ marginBottom: 20, color: "#475569" }}>
            Welcome! Enter your name to access the dashboard.
          </p>
          <input
            placeholder="Enter your name"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Sign In
          </button>
        </form>
      </div>
    );
  }

  // ---- DASHBOARD VIEW ----
  return (
    <div style={mainContainer}>
      {/* Header */}
      <header style={dashboardHeader}>
        <div style={logoStyle}>
          <span>📚</span> Book Finder
        </div>

        <div style={userInfo}>
          <div style={avatarStyle}>{initials(user.name)}</div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 700 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Signed in</div>
          </div>
          <button style={signOutButton} onClick={() => setUser(null)}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Book Search Section */}
      <div style={appStyle}>
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={onSearch}
          loading={loading}
        />

        {error && <p style={{ color: "crimson" }}>{error}</p>}
        {loading && <p>Loading results...</p>}
        {!loading && books.length > 0 && <BookList books={books} />}

        {/* AI Recommendations */}
        {aiLoading && (
          <p style={{ marginTop: 20, color: "#64748b" }}>
            🤖 Generating AI book recommendations...
          </p>
        )}
        {aiRecs && (
          <div
            style={{
              background: "white",
              marginTop: 24,
              padding: 16,
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>🤖 AI Recommendations</h3>
            <p style={{ whiteSpace: "pre-line", color: "#334155" }}>{aiRecs}</p>
          </div>
        )}
      </div>
    </div>
  );
}
