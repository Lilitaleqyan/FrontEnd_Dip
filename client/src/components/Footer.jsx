import { useState } from "react";
import { BookOpen, Facebook, Twitter, Instagram, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    setEmail("");
  };

  return (
    <footer className="bg-card border-t border-border py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Socials */}
          <div className="space-y-4">
            <div className="flex items-center">
              <BookOpen className="text-primary text-2xl mr-2" />
              <span className="text-2xl font-bold text-foreground">Գրադարան</span>
            </div>
            <p className="text-muted-foreground">
              Современная цифровая библиотека для всех любителей чтения.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Sections */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Разделы</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Главная</a></li>
              <li><a href="/books" className="text-muted-foreground hover:text-primary transition-colors">Каталог книг</a></li>
              <li><a href="/audiobooks" className="text-muted-foreground hover:text-primary transition-colors">Аудиокниги</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Поддержка</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Помощь</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Контакты</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Правила</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Конфиденциальность</a></li>
            </ul>
          </div>

          {/* Subscription */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Подписка</h3>
            <p className="text-muted-foreground mb-4">Получайте уведомления о новых книгах</p>
            <form onSubmit={handleSubscribe} className="flex">
              <Input
                type="email"
                placeholder="Ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-r-none"
              />
              <Button type="submit" className="rounded-l-none">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">&copy; 2024 БиблиоТека. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
