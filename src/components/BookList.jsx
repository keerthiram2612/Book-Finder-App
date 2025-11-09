import React from "react";
import BookCard from "./BookCard";

export default function BookList({ books }) {
  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 16,
  };
  return (
    <section style={grid} aria-live="polite">
      {books.map((b) => (
        <BookCard key={b.key || b.cover_i || b.title} book={b} />
      ))}
    </section>
  );
}
