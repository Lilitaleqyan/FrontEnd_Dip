import { is } from "drizzle-orm";
import { isAdmin } from "./auth";

const API_URL = import.meta.env.VITE_API_BASE_URL; // backend-ի URL
export async function initializeBooks() {
  const books = await getStoredBooks();
  if (!books || books.length === 0) {
    console.log("No books, initializing...");
  }
  return books;
}

export async function registerForm(user) {
  try {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      username: user.username,
      password: user.password
     }),
  });
      if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return await res.json(); 
  } catch (err) {
    console.error("Registration error:", err.message);
    throw err; 
  }
}

export async function getStoredBooks() {
  const token = localStorage.getItem("jwt_token");
  if (!token) return [];

  try {
    const url = isAdmin() ? `${API_URL}/full/getAllBooks` : `${API_URL}/reader/books`;
    const res = await fetch(url, {
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

export async function getAllReaders() {
  const token = localStorage.getItem("jwt_token");
  if (!token) throw new Error("No JWT token");

  const res = await fetch(`${API_URL}/admin/getAllUsers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
    if (!res.ok) {
    throw new Error("Failed to fetch readers");
  }

  return await res.json(); 
}


export async function deleteReader(id) {
  const token = localStorage.getItem("jwt_token");
  if (!token) throw new Error("No token");

  if (!id) {
    throw new Error("User ID is required");
  }

  
  const url = `${API_URL}/admin/removeUser/${id}`;

  console.log("Deleting user with ID:", id);
  console.log("Delete URL:", url);

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  console.log("Delete response status:", res.status);

  if (!res.ok) {
    let errorText = "";
    try {
      errorText = await res.text();
    } catch (e) {
      errorText = res.statusText;
    }
    console.error("Delete error:", errorText);
    throw new Error(`Failed to delete reader: ${res.status} ${errorText}`);
  }
}
export async function reservBook(bookId, readerId) {
    console.log("readerId:", readerId);

    const token = localStorage.getItem("jwt_token");
    if (!token) throw new Error("No JWT token");

    const res = await fetch(`${API_URL}/reader/reserv?bookId=${bookId}&id=${readerId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        const text = await res.text(); 
        console.error("Reserve error:", text);
        throw new Error(text || "Failed to reserve book");
    }
    const text = await res.text();
    if (!text) return null; 
    return JSON.parse(text); 

}

export async function returnBook(reservationId)  
{
    const token = localStorage.getItem("jwt_token");
    if (!token) throw new Error("No JWT token");

    const res = await fetch(`${API_URL}/admin/return/${reservationId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        const text = await res.text(); 
        console.error("Return error:", text);
        throw new Error("Failed to return book");
    }

    return true;
}

export async function getReservedBooks(readerId) {
  const token = localStorage.getItem("jwt_token");
  if (!token) throw new Error("No JWT token");

  const res = await fetch(
    `${API_URL}/admin/reservDetail/${readerId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Fetch reserved books error:", text);
    throw new Error("Failed to fetch reserved books");
  }

  return res.json();
}


export async function getReturnedBook(readerId) {
    const token = localStorage.getItem("jwt_token");
    if (!token) throw new Error("No JWT token");
    
    const res = await fetch(`${API_URL}/admin/returnDetail/${readerId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        const text = await res.text(); 
        console.error("Return book error:", text);
        throw new Error("Failed to return book");
    }
    
    return res.json();

}
export async function addComments(bookId, comment) {
    const token = localStorage.getItem("jwt_token");
    if (!token) throw new Error("No JWT token");

    const res = await fetch(`${API_URL}/full/addComment?bookId=${bookId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            comment
        })
    });

    if (!res.ok) {
        const text = await res.text();
        console.error("Add comment error:", text);
        throw new Error(text || "Failed to add comment");
    }

    return true;
}

export async function viewAllComments(bookId) {
    const token = localStorage.getItem("jwt_token");
    if (!token) throw new Error("No JWT token");

    const res = await fetch(`${API_URL}/full/viewComments?bookId=${bookId}`, {
        method: "GET",
        headers: {
    "Authorization": `Bearer ${token}`
  }
});

return res.json();
}