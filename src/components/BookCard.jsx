import React from "react";

export default function BookCard({ book }) {
  const card = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    border: "1px solid #eee",
    width: 200,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    background: "white",
  };
  const imgStyle = {
    width: "100%",
    height: 260,
    objectFit: "cover",
    borderRadius: 6,
    background: "#f6f6f6",
  };
  const titleStyle = { fontSize: 16, fontWeight: 600, margin: 0 };
  const metaStyle = { fontSize: 13, color: "#555", margin: 0 };

  const cover = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : "https://via.placeholder.com/200x260?text=No+Cover";

  return (
    <article style={card} aria-label={`Book: ${book.title}`}>
      <img src={cover} alt={`Cover of ${book.title}`} style={imgStyle} />
      <div>
        <h3 style={titleStyle}>{book.title}</h3>
        <p style={metaStyle}>
          {book.author_name ? book.author_name.join(", ") : "Unknown author"}
        </p>
        <p style={metaStyle}>{book.first_publish_year || ""}</p>
      </div>
    </article>
  );
}
