import React from "react";

export default function SearchBar({ value, onChange, onSubmit, loading }) {
  // 🎨 Styles
  const wrapperStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    color: "white",
    padding: "30px 20px",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    marginBottom: 24,
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
    flexWrap: "wrap",
  };

  const logoStyle = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#2575fc",
    fontWeight: "bold",
    fontSize: 20,
  };

  const titleStyle = {
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: "0.5px",
  };

  const formStyle = {
    display: "flex",
    gap: 10,
    width: "100%",
    maxWidth: 500,
    flexWrap: "wrap",
    justifyContent: "center",
  };

  const inputStyle = {
    flex: 1,
    minWidth: 220,
    padding: "12px 14px",
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    outline: "none",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
  };

  const buttonStyle = {
    padding: "12px 20px",
    fontSize: 16,
    fontWeight: 600,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: "#fff",
    color: "#2575fc",
    transition: "all 0.3s ease",
  };

  const buttonHover = {
    background: "#f4f4f4",
    transform: "scale(1.03)",
  };

  // 🧠 Local hover state
  const [hover, setHover] = React.useState(false);

  return (
    <div style={wrapperStyle}>
      {/* Header with logo */}
      <div style={headerStyle}>
        <div style={logoStyle}>📚</div>
        <h1 style={titleStyle}>Book Finder</h1>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        style={formStyle}
      >
        <input
          type="text"
          placeholder="Search books by title (e.g. Pride and Prejudice)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
        <button
          type="submit"
          style={hover ? { ...buttonStyle, ...buttonHover } : buttonStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          disabled={loading}
        >
          {loading ? "Searching..." : "🔍 Search"}
        </button>
      </form>
    </div>
  );
}
