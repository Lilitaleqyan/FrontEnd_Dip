import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Grid, List, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { getBooks } from "@/lib/api";

export default function Books() {
  const [location] = useLocation();
  const [filters, setFilters] = useState({ title: "", author: "", category: "all" });
  const [sortBy, setSortBy] = useState("title");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  // React Query fetch
  const { data: booksData = [], isLoading, error } = useQuery({
    queryKey:["books"],
    queryFn: getBooks,
  });

  // Parse URL search params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split("?")[1] || "");
    setFilters(prev => ({
      ...prev,
      title: urlParams.get("search") || "",
      category: urlParams.get("category") || "all"
    }));
  }, [location]);

  // Filter & sort books client-side
  const filteredSortedBooks = booksData
    .filter(book => {
      const matchTitle = book.title.toLowerCase().includes(filters.title.toLowerCase());
      const matchAuthor = book.author.toLowerCase().includes(filters.author.toLowerCase());
      const matchCategory = filters.category === "all" || book.category === filters.category;
      return matchTitle && matchAuthor && matchCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title": return a.title.localeCompare(b.title);
        case "author": return a.author.localeCompare(b.author);
        case "rating": return b.rating - a.rating;
        case "date": return new Date(b.createdAt) - new Date(a.createdAt);
        default: return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredSortedBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = filteredSortedBooks.slice(startIndex, startIndex + booksPerPage);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));

  const categoryLabels = {
    all: "Все категории",
    fiction: "Художественная",
    science: "Научная",
    educational: "Учебная",
    audiobook: "Аудиокниги"
  };

  if (isLoading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <p className="text-muted-foreground text-lg">Загрузка...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Произошло ошибка</h2>
            <p className="text-muted-foreground mb-4">{error.message || "Не удалось загрузить книги"}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
            >
              Перезагрузить страницу
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    
  );

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Каталог книг</h1>
          <p className="text-muted-foreground">
            Найдите идеальную книгу из нашей коллекции ({filteredSortedBooks.length} результатов)
          </p>
        </div>

        {/* Sort & View mode */}
        <div className="flex gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Сортировать по..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Названию</SelectItem>
              <SelectItem value="author">Автору</SelectItem>
              <SelectItem value="date">Дате добавления</SelectItem>
              <SelectItem value="rating">Рейтингу</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border border-border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="block text-sm font-medium mb-2">Поиск по названию</Label>
              <Input
                type="text"
                placeholder="Введите название..."
                value={filters.title}
                onChange={(e) => setFilters({ ...filters, title: e.target.value })}
              />
            </div>
            <div>
              <Label className="block text-sm font-medium mb-2">Автор</Label>
              <Input
                type="text"
                placeholder="Имя автора..."
                value={filters.author}
                onChange={(e) => setFilters({ ...filters, author: e.target.value })}
              />
            </div>
            <div>
              <Label className="block text-sm font-medium mb-2">Категория</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={() => setCurrentPage(1)} className="w-full">
                <Search className="w-4 h-4 mr-2" /> Найти
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Books */}
      {currentBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Книги не найдены. Попробуйте изменить параметры поиска.</p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8" : "space-y-4 mb-8"}>
          {currentBooks.map(book => (
            <div
              key={book.id}
              className={viewMode === "grid" ? "bg-card rounded-xl overflow-hidden shadow-md hover-lift border border-border" : "bg-card rounded-xl border border-border p-4 flex gap-4 hover-lift"}
            >
              <img
                src={book.coverUrl}
                alt={`Обложка книги ${book.title}`}
                className={viewMode === "grid" ? "w-full h-48 object-cover" : "w-20 h-28 object-cover rounded"}
              />
              <div className={viewMode === "grid" ? "p-4" : "flex-1"}>
                <span className={`inline-block text-xs px-2 py-1 rounded-full mb-2 ${
                  book.category === "fiction" ? "bg-primary/10 text-primary" :
                  book.category === "science" ? "bg-accent/10 text-accent" :
                  book.category === "educational" ? "bg-primary/10 text-primary" :
                  "bg-accent/10 text-accent"
                }`}>
                  {categoryLabels[book.category]}
                </span>
                <h3 className="font-semibold text-foreground mb-1">{book.title}</h3>
                <p className="text-muted-foreground text-sm mb-2">{book.author}</p>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{book.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex mr-2">{renderStars(book.rating)}</div>
                    <span className="text-xs text-muted-foreground">{book.rating.toFixed(1)}</span>
                  </div>
                  <Link href={`/book/${book.id}`}>
                    <Button variant="link" className="text-primary hover:text-primary/80 text-sm font-medium p-0">
                      Подробнее
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}

            {totalPages > 5 && (
              <>
                <span className="px-2 text-muted-foreground">...</span>
                <Button
                  variant={currentPage === totalPages ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
