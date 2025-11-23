import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBookById } from "@/lib/storage";
import { 
  Star, Heart, BookOpen, Download, ChevronLeft, ChevronRight,
  Moon, Sun, Type
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BookDetail() {
  const [, params] = useRoute("/book/:id");
  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [fontSize, setFontSize] = useState("medium");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const totalPages = book?.pages || 1;
  const progress = ((currentPage / totalPages) * 100).toFixed(1);

  useEffect(() => {
    if (params?.id) {
      const foundBook = getBookById(params.id);
      setBook(foundBook);
    }
  }, [params?.id]);

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Книга не найдена</h1>
          <Link href="/books">
            <Button>Вернуться к каталогу</Button>
          </Link>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  const categoryLabels = {
    fiction: "Художественная",
    science: "Научная",
    educational: "Учебная",
    audiobook: "Аудиокниги"
  };

  const fontSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg"
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl fade-in">
      {/* Book Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-1">
          <img 
            src={book.coverUrl} 
            alt={`Обложка книги ${book.title}`}
            className="w-full rounded-xl shadow-lg"
          />
        </div>
        <div className="md:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge variant="secondary" className="mb-3" data-testid="book-category">
                {categoryLabels[book.category]}
              </Badge>
              <h1 className="text-4xl font-bold text-foreground mb-2" data-testid="book-title">
                {book.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-4" data-testid="book-author">
                {book.author}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              data-testid="button-like"
            >
              <Heart className={`w-6 h-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
          
          <div className="flex items-center mb-6">
            <div className="flex mr-3">{renderStars(book.rating)}</div>
            <span className="text-foreground font-medium">{book.rating.toFixed(1)}</span>
            <span className="text-muted-foreground ml-2">({book.reviewCount.toLocaleString()} отзывов)</span>
          </div>

          <p className="text-muted-foreground text-lg mb-6 leading-relaxed" data-testid="book-description">
            {book.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {book.pages && (
              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground text-sm">Страниц</p>
                <p className="text-foreground font-semibold">{book.pages.toLocaleString()}</p>
              </div>
            )}
            {book.duration && (
              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground text-sm">Длительность</p>
                <p className="text-foreground font-semibold">{book.duration}</p>
              </div>
            )}
            <div className="bg-muted rounded-lg p-4">
              <p className="text-muted-foreground text-sm">Язык</p>
              <p className="text-foreground font-semibold">Русский</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-muted-foreground text-sm">Рейтинг</p>
              <p className="text-foreground font-semibold">{book.rating.toFixed(1)}/5</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1" size="lg" data-testid="button-start-reading">
              <BookOpen className="w-5 h-5 mr-2" />
              {book.category === "audiobook" ? "Начать прослушивание" : "Начать чтение"}
            </Button>
            <Button variant="outline" className="flex-1" size="lg" data-testid="button-download">
              <Download className="w-5 h-5 mr-2" /> Скачать
            </Button>
          </div>
        </div>
      </div>

      {/* Reading Interface - Only for non-audiobooks */}
      {book.category !== "audiobook" && book.content && (
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Читать онлайн</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground text-sm">Размер шрифта:</span>
                  <Button variant={fontSize === "small" ? "default" : "outline"} size="sm" onClick={() => setFontSize("small")} data-testid="font-small">
                    <Type className="w-3 h-3" />
                  </Button>
                  <Button variant={fontSize === "medium" ? "default" : "outline"} size="sm" onClick={() => setFontSize("medium")} data-testid="font-medium">
                    <Type className="w-4 h-4" />
                  </Button>
                  <Button variant={fontSize === "large" ? "default" : "outline"} size="sm" onClick={() => setFontSize("large")} data-testid="font-large">
                    <Type className="w-5 h-5" />
                  </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsDarkMode(!isDarkMode)} title="Ночной режим" data-testid="toggle-dark-mode">
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div 
              className={`prose prose-lg max-w-none leading-relaxed ${fontSizeClasses[fontSize]} ${isDarkMode ? "bg-gray-900 text-gray-100 p-6 rounded-lg" : "text-foreground"}`}
              dangerouslySetInnerHTML={{ __html: book.content }}
              data-testid="book-content"
            />

            {/* Reading Progress */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="ghost"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                data-testid="prev-page"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Предыдущая страница
              </Button>
              
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground text-sm">
                  Страница {currentPage} из {totalPages}
                </span>
                <div className="w-32 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-muted-foreground text-sm">{progress}%</span>
              </div>
              
              <Button
                variant="ghost"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                data-testid="next-page"
              >
                Следующая страница <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audiobook Player Interface */}
      {book.category === "audiobook" && (
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Аудиоплеер</h2>
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">Аудиоплеер будет реализован в будущих версиях</p>
              {book.narrator && <p className="mt-2">Читает: {book.narrator}</p>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
