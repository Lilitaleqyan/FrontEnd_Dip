import { useState, useEffect } from "react";
import { Link } from "wouter";
import { getStoredBooks } from "@/lib/storage";
import { Book, BookOpen, Headphones, Microscope, GraduationCap } from "lucide-react";

export default function Home() {
  const [allBooks, setAllBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const books = await getStoredBooks();
      setAllBooks(books || []);
      setFeaturedBooks((books || []).slice(0, 4));
    };
    fetchBooks();
  }, []);

  const categories = [
    {
      name: "Գեղարվեստական",
      count: allBooks.filter(b => b.category === "fiction").length,
      icon: Book,
      category: "fiction"
    },
    {
      name: "Գիտական", 
      count: allBooks.filter(b => b.category === "science").length,
      icon: Microscope,
      category: "science"
    },
    {
      name: "Ուսուցողական",
      count: allBooks.filter(b => b.category === "educational").length,
      icon: GraduationCap,
      category: "educational"
    },
    {
      name: "Աուդիոգրքեր",
      count: allBooks.filter(b => b.category === "audiobook").length,
      icon: Headphones,
      category: "audiobook"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-16 fade-in">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-5xl font-bold text-foreground mb-4">
          Բարի գալուստ ԳրքաՊտույտ
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Բացահայտեք գիտելիքների աշխարհը մեր ժամանակակից թվային գրադարանում
        </p>
      </section>

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-primary to-accent rounded-2xl overflow-hidden mb-16 shadow-xl">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')"
          }}
        />
        <div className="relative px-8 py-16 md:py-24 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Կարդացեք առանց սահմանների
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            {allBooks.length}-ից ավելի գրքեր, աուդիոգրքեր և գիտական հրապարակումներ մեկ վայրում
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/books">
              <button className="bg-white text-primary hover:bg-white/90 shadow-lg px-8 py-4 text-lg">
                Սկսել ընթերցանությունը
              </button>
            </Link>
            <button className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
              Ավելի շատ տեղեկություններ
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Հանրաճանաչ կատեգորիաներ
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.category} href={`/books?category=${category.category}`}>
                <div 
                  className="bg-card rounded-xl p-6 text-center hover-lift border border-border cursor-pointer"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="text-primary text-2xl" size={32} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.count} գրքեր
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Books */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Առաջարկվող գրքեր</h2>
          <Link href="/books">
            <button className="text-primary hover:underline font-medium">
              Նայեք բոլորին
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredBooks.map((book) => (
            <div 
              key={book.id} 
              className="bg-card rounded-xl overflow-hidden shadow-md hover-lift border border-border"
            >
              <img 
                src={book.coverUrl} 
                alt={`Գրքի շապիկ ${book.title}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-2">
                  {book.author}
                </p>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {book.description}
                </p>
                <Link href={`/book/${book.id}`}>
                  <button 
                    className={`w-full text-sm font-medium ${
                      book.category === "audiobook" 
                        ? "bg-accent text-accent-foreground hover:bg-accent/90" 
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {book.category === "audiobook" ? "Լսել" : "Կարդալ"}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
