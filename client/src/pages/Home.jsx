import { useState, useEffect } from "react";
import { Link } from "wouter";
import { getStoredBooks } from "@/lib/storage";
import { Book, BookOpen, Headphones, Microscope,ArrowRight, GraduationCap, Calculator, Atom, FlaskConical, Code,  Scale} from "lucide-react";
import ChatWindow from "./ChatWindow";


export default function Home() {
  const [allBooks, setAllBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
   const [books, setBooks] = useState([]);
   

  

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
    name: "Մաթեմատիկա",
    count: allBooks.filter(b => b.category === "mathematics").length,
    icon: Calculator,
    category: "mathematics"
  },
  {
    name: "Ֆիզիկա",
    count: allBooks.filter(b => b.category === "physics").length,
    icon: Atom,
    category: "physics"
  },
 

  {
    name: "Իրավագիտություն",
    count: allBooks.filter(b => b.category === "law").length,
    icon:  Scale,
    category: "programming"
  },

    {
    name: "Ծրագրավորում",
    count: allBooks.filter(b => b.category === "programming").length,
    icon: Code,
    category: "programming"
  }



];


  return (
    <div className="container mx-auto px-4 py-8 space-y-16 fade-in">
  

   <div className="relative min-h-[600px] w-full flex items-center justify-center mb-16 rounded-[2rem] overflow-hidden shadow-2xl">
  
  <div 
    className="absolute inset-0 bg-cover bg-center z-0 scale-105" 
    style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000')", 
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/80 to-slate-900/90 mix-blend-multiply"></div>
    
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent to-black/40"></div>
  </div>

  <div className="relative z-10 px-6 py-20 text-center max-w-5xl mx-auto">
    
 <div className="flex flex-col items-center gap-4 mb-8">
  <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-100 text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] shadow-xl">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
    </span>
    «Իմ բառարանում «անհնար» բառ չկա»
  </div>

  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
    <div className="w-6 h-6 rounded-full overflow-hidden border border-blue-400/50">
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Napoleon_Paul_Delaroche.jpg/330px-Napoleon_Paul_Delaroche.jpg" 
        alt="Napoleon"
        className="w-full h-full object-cover"
      />
    </div>
    <span className="text-[10px] text-blue-200 font-medium tracking-wider uppercase">
      Նապոլեոն Բոնապարտ
    </span>
  </div>
</div>
    <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight drop-shadow-2xl">
     <span className="text-blue-400"> Ակադեմիական  </span> գիտելիքի շտեմարան <br />
    
    </h2>

    <p className="text-lg md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
        Ակադեմիական ռեսուրսների և մասնագիտական գրականության թվային հարթակ    
         </p>

    <div className="flex flex-col sm:flex-row gap-6 justify-center">
      <Link href="/books">
        <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-12 py-5 rounded-2xl shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:-translate-y-1 active:scale-95 text-lg">
         Դիտել գրքերը
        </button>
      </Link>
      
      <Link href="/aboutus"> 
      <button className="bg-white/5 backdrop-blur-lg text-white border border-white/20 hover:bg-white/10 px-12 py-5 rounded-2xl font-bold transition-all text-lg">
        Մեր մասին
      </button>
      </Link>
    </div>

    <div className="mt-16 flex justify-center opacity-30">
      <div className="w-32 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full"></div>
    </div>
  </div>

  <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
  <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"></div>
</div>

   <section className="mb֊8">
 <h2 className="text-2xl font-bold text-foreground">Բաժիններ</h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {categories.map((category, index) => {
      const IconComponent = category.icon;
      const isLast = index === categories.length - 1;

      return (
        <div key={category.category} className="relative group">
          <Link href={`/books?category=${category.category}`}>
            <div className="bg-card rounded-2xl p-6 text-center border border-border cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full min-h-[160px] flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors group-hover:bg-primary/20">
                <IconComponent className="text-primary" size={28} />
              </div>
              <h3 className="font-bold text-foreground text-sm md:text-base">
                {category.name}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1">
                {category.count} գրքեր
              </p>
            </div>
          </Link>

          {isLast && (
            <Link href="/category">
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/40 cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-blue-700 active:scale-95 border-2 border-white">
                <ArrowRight className="text-white w-5 h-5 md:w-6 md:h-6" />
              </div>
            </Link>
          )}
        </div>
      );
    })}
  </div>
</section>

   
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">Նորավել</h2>
          <Link href="/books">
            <button className="text-primary hover:underline font-medium">
              Ավելին
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredBooks.map((book) => (
            <div 
              key={book.id} 
              className="bg-card rounded-xl overflow-hidden shadow-md hover-lift border border-border flex flex-col"
            >
              <img 
                src={book.coverUrl} 
                alt={`Գրքի շապիկ ${book.title}`}
                className="w-full h-48 object-cover"
              />

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                  {book.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-2">
                  {book.author}
                </p>
                
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {book.description}
                </p>

                <Link href={`/book/${book.id}`} className="mt-auto">
                  <button 
                    className={`w-full text-sm font-medium ${
                      book.category === "audiobook" 
                        ? "p-1 bg-accent text-accent-foreground hover:bg-accent/90" 
                        : "p-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {book.isAudioBook ? "Լսել" : "Կարդալ"}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="container mx-auto px-4 py-8 space-y-16 fade-in">
      <ChatWindow />
    </div>
    </div>
    
  );
}
