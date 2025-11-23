const BOOKS_KEY = "library_books";

export async function initializeBooks() {
  const books = await getStoredBooks();
  if (books.length === 0) {
    // Create some default books
    const defaultBooks = [
      {
        title: "Война и мир",
        author: "Лев Толстой",
        description: "Эпическая сага о русском обществе...",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        category: "fiction",
        content: `<h3>Глава 1</h3><p>...</p>`,
        pages: 1225
      },
      {
        title: "1984",
        author: "Джордж Оруэлл",
        description: "Антиутопия о тотальном контроле...",
        coverUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        category: "fiction",
        content: `<h3>Часть первая. Глава 1</h3><p>...</p>`,
        pages: 328
      },
      {
        title: "Краткая история времени",
        author: "Стивен Хокинг",
        description: "Введение в современную космологию...",
        coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        category: "science",
        content: `<h3>Глава 1</h3><p>...</p>`,
        pages: 256
      },
      {
        title: "Гарри Поттер и философский камень",
        author: "Дж.К. Роулинг",
        description: "Аудиокнига о приключениях юного волшебника...",
        coverUrl: "https://pixabay.com/get/gb6fa2cf2a450375ba2a377159532fc2a54f918000f9c1176e531d0b36ba0841dc70cf1aa4738717b3183c0c973e5534cfc1c42f2ac50736d0b69752601eb0a2e_1280.jpg",
        category: "audiobook",
        audioUrl: "https://example.com/harry-potter-audiobook.mp3",
        duration: "8ч 45м",
        narrator: "Виктор Рыжаков"
      }
    ];

    defaultBooks.forEach(book => createBook(book));
  }
}

export function getStoredBooks() {
  const stored = localStorage.getItem(BOOKS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function createBook(bookData) {
  const books = getStoredBooks();
  const newBook = {
    ...bookData,
    id: Date.now().toString(),
    rating: Math.floor(Math.random() * 2) + 4, // Random rating 4-5
    reviewCount: Math.floor(Math.random() * 1000) + 100,
    createdAt: new Date().toISOString()
  };
  books.push(newBook);
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  return newBook;
}

export function updateBook(id, bookData) {
  const books = getStoredBooks();
  const index = books.findIndex(b => b.id === id);
  if (index === -1) return null;

  books[index] = { ...books[index], ...bookData };
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  return books[index];
}

export function deleteBook(id) {
  const books = getStoredBooks();
  const filteredBooks = books.filter(b => b.id !== id);
  if (filteredBooks.length === books.length) return false;

  localStorage.setItem(BOOKS_KEY, JSON.stringify(filteredBooks));
  return true;
}

export function getBookById(id) {
  const books = getStoredBooks();
  return books.find(b => b.id === id) || null;
}

export function searchBooks(query, category) {
  const books = getStoredBooks();
  return books.filter(book => {
    const matchesQuery = !query ||
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !category || category === "all" || book.category === category;
    return matchesQuery && matchesCategory;
  });
}
