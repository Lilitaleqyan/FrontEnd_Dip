
const API_URL = import.meta.env.VITE_API_BASE_URL; // backend-ի URL
export async function initializeBooks() {
  const books = await getStoredBooks();
  if (!books || books.length === 0) {
    console.log("No books, initializing...");
  }
  return books;
}


export async function getStoredBooks() {
  const token = localStorage.getItem("jwt_token");
  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/admin/getAllBooks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : data.books || [];
  } catch (err) {
    console.error("Failed to fetch books:", err);
    return [];
  }
}
async function fetchBook(id) {
  try {
    const response = await fetch(API_URL + `/books/${id}`);
    const data = await response.json();
    console.log(data.body); 
  } catch (err) {
    console.error(err);
  }
}


export async function createBook(fd) {

  const token = localStorage.getItem("jwt_token");
  if (!token) throw new Error("No JWT token");

  const res = await fetch(`${API_URL}/admin/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: fd,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to create book:", text);
    throw new Error("Failed to create book");
  }

  return await res.json();
}
export async function editBook(id, fd) {
  const token = localStorage.getItem("jwt_token");
  if (!token) throw new Error("No JWT token");

  const res = await fetch(`${API_URL}/admin/update/${id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` },
    body: fd,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to update book:", text);
    throw new Error("Failed to update book");
  }

  const updatedBooks = await getStoredBooks();
  return updatedBooks;
}


export async function deleteBook(id) {
  const token = localStorage.getItem("jwt_token");
  if (!token) throw new Error("No JWT token");

  const res = await fetch(`${API_URL}/admin/removed/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });

  if (!res.ok) throw new Error("Failed to delete book");
  return true;
}


export async function getBookById(id) {
  const books = await getStoredBooks();
  return books.find(b => b.id === id) || null;
}

export async function searchBooks(query, category) {
  const books = await getStoredBooks();
  return books.filter(book => {
    const matchesQuery = !query ||
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !category || category === "all" || book.category === category;
    return matchesQuery && matchesCategory;
  });
}

export async function downloadBook(id) {
  const token = localStorage.getItem("jwt_token");
  const response  = await fetch(`${API_URL}/full/books/download/${id}`, {
    method:"GET", 
    headers: {
      Authorization:`Bearer ${token}`,
    },
  });
  if(!response.ok)
  {
     alert("Error downloading file");
    return;
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `book_${id}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  
}

