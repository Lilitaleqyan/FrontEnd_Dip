import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentUser, logout, isAdmin } from "@/lib/auth";
import { BookOpen, Search, CircleUser, Menu, LogOut, BookA } from "lucide-react";

import { Heart, History } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const currentUser = getCurrentUser();
  const [isModalOpen, setIsModalOpen] = useState(false);


useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 500);

    return () => clearTimeout(timer); 
  }, []); 


  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

useEffect(() => {
  const checkAdmin = async () => {
    const adminStatus = await isAdmin();
    setIsAdminUser(adminStatus);
  };
  checkAdmin();
}, []);



  const NavItems = () => (
    <>
      <Link
        href="/"
        className="text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
      >
        Գլխավոր
      </Link>
      <Link
        href="/books"
        className="text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
      >
        Գրքեր
      </Link>
      <Link
        href="/audiobooks"
        className="text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
      >
        Աուդիոգրքեր
      </Link>

      <Link
        href="/category"
        className="text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
      >
        Բաժիններ
      </Link>
      <Link
        href="/aboutus"
        className="text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
      >
        Մեր մասին
      </Link>
      {isAdminUser && (
        <Link
          href="/admin"
          className="text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
        >
          Ադմին
        </Link>
      )}
    </>
  );

  return (
  

<nav className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] transition-all">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-24">
      
      <div className="flex items-center">
        <Link href="/" className="flex items-center group">
          <div className="relative mr-3">
            <div className="absolute inset-0 bg-primary/10 blur-md rounded-full animate-pulse"></div>
            <BookOpen className="text-primary w-10 h-10 relative z-10 animate-book-flip" />
          </div>

          <div className="flex flex-col leading-none select-none">
            <span className="text-2xl font-serif italic font-black tracking-tight text-slate-900">
              Գրքա<span className="text-primary not-italic">Պտույտ</span>
            </span>
            <div className="h-[2px] w-0 bg-gradient-to-r from-primary to-transparent animate-line-stretch mt-1"></div>
            <span className="text-[9px] uppercase tracking-[0.4em] text-slate-400 mt-1 font-sans font-bold">
              Գիտական Շտեմարան
            </span>
          </div>
        </Link>

     
        <div className="hidden md:ml-10 md:flex md:space-x-6 items-center  ">
          <NavItems  className=" items-center absolute bottom-0 w-0 bg-gradient-to-r from-primary via-blue-400 to-transparent transition-all duration-500 group-hover:w-full group-hover:animate-line-stretch"/>
        
      
        </div>
      </div>

      <div className="flex items-center space-x-4">
        
        <div className="hidden md:block">
          <form onSubmit={handleSearch} className="relative group">
            <Input
              type="search"
              placeholder="Որոնել..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pr-10 rounded-full bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all shadow-sm outline-none"
            />
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent text-slate-400 group-focus-within:text-primary"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

      
        {currentUser ? (
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full hover:bg-slate-100 p-2">
        <CircleUser className="h-8 w-8  text-slate-800 group-hover:text-primary transition-colors" strokeWidth={1.5}/>     
                 </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl border-slate-100 shadow-xl overflow-hidden p-1">
              <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 mb-1 rounded-t-lg">
                <p className="font-bold text-slate-900 leading-none">{currentUser.username}</p>
                <p className="text-[10px] text-primary uppercase font-black italic mt-1.5 tracking-wider">{currentUser.role}</p>
              </div>
              <DropdownMenuItem onClick={() => setLocation("/favorites")} className="py-2.5 cursor-pointer rounded-lg">
                <Heart className="w-4 h-4 mr-2 text-rose-500" />
                Հավանած գրքեր
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("/reserved")} className="py-2.5 cursor-pointer rounded-lg">
                <History className="h-4 h-4 mr-2 text-primary" />
                Ամրագրված գրքեր
              </DropdownMenuItem>
              <div className="h-px bg-slate-100 my-1 mx-1"></div>
              <DropdownMenuItem onClick={handleLogout} className="py-2.5 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50 font-bold rounded-lg">
                <LogOut className="w-4 h-4 mr-2" />
                Դուրս գալ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button variant="ghost" size="sm" className="rounded-full hover:bg-slate-100">
              <User className="h-5.5 w-5.5 text-slate-600" />
            </Button>
          </Link>
        )}

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden rounded-full hover:bg-slate-100">
              <Menu className="h-6 w-6 text-slate-600" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="rounded-l-3xl border-none shadow-2xl p-6">
            <div className="flex flex-col space-y-6 mt-10">
              <NavItems isMobile />
              <div className="h-px bg-slate-100 w-full my-4"></div>
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Որոնել..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-full pr-10 bg-slate-50"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </div>

  {/* Անիմացիաները (Ավելացրու քո CSS-ի մեջ) */}
  <style jsx>{`
    @keyframes book-flip {
      0%, 100% { transform: rotateY(0deg) scale(1); }
      50% { transform: rotateY(-180deg) scale(1.1); }
    }
    @keyframes line-stretch {
      0% { width: 0%; opacity: 0; }
      50% { width: 100%; opacity: 1; }
      100% { width: 0%; opacity: 0; }
    }
    .animate-book-flip {
      animation: book-flip 5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
    }
    .animate-line-stretch {
      animation: line-stretch 4s ease-in-out infinite;
    }
  `}</style>
</nav>
  );
}

// Օժանդակ կոմպոնենտ նավիգացիոն կետերի համար
function NavItems({ isMobile = false }) {
  const items = [
    { label: 'Գլխավոր', href: '/' },
    { label: 'Գրքեր', href: '/books' },
    { label: 'Աուդիոգրքեր', href: '/audiobooks' },
    { label: 'Բաժիններ', href: '/categories' },
    { label: 'Մեր մասին', href: '/about' }
  ];

  return items.map((item) => (
    <Link 
      key={item.label} 
      href={item.href}
      className={`
        relative font-medium transition-all duration-300 group
        ${isMobile 
          ? 'text-xl text-slate-800 block py-2' 
          : 'text-sm text-slate-600 hover:text-blue-600'
        }
      `}
    >
      {item.label}
      {!isMobile && (
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
      )}
    </Link>
  ));
}
    
  

