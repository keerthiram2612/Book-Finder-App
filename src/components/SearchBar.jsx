import React from "react";

export default function SearchBar({ value, onChange, onSubmit, loading }) {
  const containerStyle = {
    display: "flex",
    gap: 8,
    alignItems: "center",
    marginBottom: 16,
  };
  const inputStyle = {
    flex: 1,
    padding: "10px 12px",
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
    outline: "none",
  };
  const buttonStyle = {
    padding: "10px 14px",
    fontSize: 16,
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    background: "#0366d6",
    color: "white",
  };

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      style={containerStyle}
      aria-label="Book search form"
    >
      <input
        placeholder="Search books by title (e.g. Pride and Prejudice)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
      <button type="submit" style={buttonStyle} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
