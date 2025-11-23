import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getStoredBooks, createBook, updateBook, deleteBook } from "@/lib/storage";
import { isAdmin } from "@/lib/auth";
import { 
  Plus, Search, Edit, Eye, Trash2, BookOpen, Users, Download, Headphones, Star 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {login as loginUser} from "@/lib/auth";


export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    coverUrl: "",
    category: "fiction",
    content: "",
    audioUrl: "",
    duration: "",
    narrator: "",
    pages: 0
  });

  useEffect(() => {
    if (!isAdmin()) {
      setLocation("/login");
      return;
    }
    loadBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, searchQuery, selectedCategory]);

  const loadBooks = () => {
    const allBooks = getStoredBooks();
    setBooks(allBooks);
  };

  const filterBooks = () => {
    let filtered = books;
    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }
    setFilteredBooks(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        updateBook(editingBook.id, formData);
        toast({
          title: "Книга обновлена",
          description: "Информация о книге успешно обновлена",
        });
      } else {
        createBook(formData);
        toast({
          title: "Книга добавлена",
          description: "Новая книга успешно добавлена в библиотеку",
        });
      }
      loadBooks();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить книгу",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      coverUrl: book.coverUrl,
      category: book.category,
      content: book.content || "",
      audioUrl: book.audioUrl || "",
      duration: book.duration || "",
      narrator: book.narrator || "",
      pages: book.pages || 0
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (book) => {
    if (window.confirm(`Вы уверены, что хотите удалить книгу "${book.title}"?`)) {
      if (deleteBook(book.id)) {
        toast({
          title: "Книга удалена",
          description: "Книга успешно удалена из библиотеки",
        });
        loadBooks();
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось удалить книгу",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setEditingBook(null);
    setFormData({
      title: "",
      author: "",
      description: "",
      coverUrl: "",
      category: "fiction",
      content: "",
      audioUrl: "",
      duration: "",
      narrator: "",
      pages: 0
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  const categoryLabels = {
    all: "Все категории",
    fiction: "Художественная",
    science: "Научная",
    educational: "Учебная",
    audiobook: "Аудиокниги"
  };

  const stats = {
    totalBooks: books.length,
    audiobooks: books.filter(b => b.category === "audiobook").length,
    activeUsers: 1856,
    downloads: 24567,
  };

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      {/* ...rest of JSX remains exactly the same... */}
    </div>
  );
}
