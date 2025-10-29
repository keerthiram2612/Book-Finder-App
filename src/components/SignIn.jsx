import React, { useState } from "react";

export default function SignIn({ onSignIn }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const container = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    minHeight: "100vh",
  };

  const card = {
    width: "100%",
    maxWidth: 420,
    background: "white",
    padding: 28,
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(20,30,60,0.08)",
    textAlign: "center",
  };

  const logo = {
    width: 64,
    height: 64,
    borderRadius: 12,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg,#6a11cb 0%, #2575fc 100%)",
    color: "white",
    fontSize: 28,
    marginBottom: 12,
  };

  const title = { margin: 0, fontSize: 20, fontWeight: 700, color: "#0f1724" };
  const subtitle = { marginTop: 6, marginBottom: 18, color: "#64748b", fontSize: 13 };

  const input = {
    width: "100%",
    padding: "12px 14px",
    fontSize: 15,
    borderRadius: 8,
    border: "1px solid #e6eef8",
    marginBottom: 12,
    outline: "none",
  };

  const button = {
    width: "100%",
    padding: "12px 14px",
    fontSize: 15,
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(90deg,#2575fc,#6a11cb)",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  };

  const small = { fontSize: 13, color: "#ef4444", margin: 0 };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name.");
      return;
    }
    setError("");
    // fake register: pass name up
    onSignIn(trimmed);
  };

  return (
    <div style={container}>
      <form style={card} onSubmit={handleSubmit} aria-label="Sign in form">
        <div style={logo}>📚</div>
        <h1 style={title}>Welcome to Book Finder</h1>
        <p style={subtitle}>Sign in to view your dashboard (this is a fake sign-in).</p>

        <input
          aria-label="Your name"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
        />

        {error && <p style={small}>{error}</p>}

        <button type="submit" style={button}>
          Sign In
        </button>
      </form>
    </div>
  );
}
