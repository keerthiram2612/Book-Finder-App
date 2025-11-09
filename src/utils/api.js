export const searchBooks = async (title) => {
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=20`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Network response was not ok');
  const data = await res.json();
  return data; // contains docs array
};
