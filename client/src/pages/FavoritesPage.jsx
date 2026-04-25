import { useState, useEffect } from "react";
import { downloadBook } from "@/lib/storage";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Grid, List, Star, ChevronLeft, ChevronRight, Download, Heart } from "lucide-react";
import { getBooks } from "@/lib/api";
const API_URL = import.meta.env.VITE_API_BASE_URL; 


export default function FavoritesPage() {
    const [location] = useLocation();
    const [filters, setFilters] = useState({ title: "", author: "", category: "all" });
    const [sortBy, setSortBy] = useState("title");
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 12
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid");



  const { data: booksData = [], isLoading, error } = useQuery({
    queryKey:["books"],
    queryFn: getBooks,
  });


  const removeFromFavorites = (bookId) => {
  setFavorites(favorites.filter(b => b.id !== bookId));
};

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
        case "date": return new Date(b.createdAt) - new Date(a.createdAt);
        default: return 0;
      }
    });

     const totalPages = Math.ceil(filteredSortedBooks.length / booksPerPage);
     const startIndex = (currentPage - 1) * booksPerPage;
     const currentBooks = filteredSortedBooks.slice(startIndex, startIndex + booksPerPage);


  const categoryLabels = {
    all: "Բոլոր կատեգորիաները",
    fiction: "Գեղարվեստական",
    science: "Գիտական",
    autobiography: "Ինքնակենսագրություն",
    audiobook: "Աուդիոգրքեր",
    detective: "Դետեկտիվ"
  };

useEffect(() => {
   const token = localStorage.getItem("jwt_token");

  fetch("http://localhost:8181/reader/findFavoritesBook", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    }
  })
  .then(res => {
    if (res.status === 403) {
      throw new Error("Մուտքը արգելված է (403): Ստուգեք Token-ը կամ իրավունքները:");
    }
    return res.json();
  })
  .then(data => setFavorites(data))
  .catch(err => console.error(err));
}, []);



  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        Իմ հավանած գրքերը   <Heart className="w-10 h-10 mr-2 text-green-500 " />
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
          <p className="text-gray-500 italic">Դուք դեռ չունեք հավանած գրքեր:</p>
        </div>
      ) : (
        
             <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8" : "space-y-4 mb-8"}>
                      {favorites.map(book => (
                        <div
                          key={book.id}
                          className={viewMode === "grid" ? "bg-card rounded-xl overflow-hidden shadow-md hover-lift border border-border" : "bg-card rounded-xl border border-border p-4 flex gap-4 hover-lift"}
                        >
                          <img
                            src={book.coverUrl}
                            alt={`Գրքի կազմը ${book.title}`}
                            className={viewMode === "grid" ? "w-full h-48 object-cover" : "w-20 h-28 object-cover rounded"}
                          />
                          <div className={viewMode === "grid" ? "p-4" : "flex-1"}>
                            <span className={`inline-block text-xs px-2 py-1 rounded-full mb-2 ${
                              book.category === "fiction" ? "bg-primary/10 text-primary" :
                              book.category === "science" ? "bg-accent/10 text-accent" :
                              book.category === "autobiography" ? "bg-primary/10 text-primary" :
                              book.category === "detective" ? "bg-primary/10 text-primary" :
                              "bg-accent/10 text-accent"
                            }`}>
                              {categoryLabels[book.category]}
                            </span>
                            <h3 className="font-semibold text-foreground mb-1">{book.title}</h3>
                            <p className="text-muted-foreground text-sm mb-2">{book.author}</p>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{book.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                            </div>
                              <Link href={`/book/${book.id}`}>
                              
                                <Button variant="link" className="text-primary hover:text-primary/80 text-sm font-medium p-0">
                                  Մանրամասն
                                </Button>
                              
                              </Link>
                        <Button 
                             
                            variant="outline" 
                            className="flex items-center gap-2" 
                            size="sm"
                            onClick={() => downloadBook(book.id)}
                          >
                            <Download className="w-5 h-5" /> Ներբեռնել
                          </Button>
                            </div>
                      
                          </div>
                        </div>
                      ))}
                    </div>
      )}
    </div>
  );
}