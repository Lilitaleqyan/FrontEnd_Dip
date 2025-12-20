import { useState } from "react";
import { BookOpen, Facebook, Twitter, Instagram, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Արդյունավետ բաժանորդագրության լոգիկան այստեղ
    setEmail("");
  };

  return (
    <footer className="bg-card border-t border-border py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
          <div className="space-y-4">
            <div className="flex items-center">
              <BookOpen className="text-primary text-2xl mr-2" />
              <span className="text-2xl font-bold text-foreground">ԳրքաՊտույտ</span>
            </div>
            <p className="text-muted-foreground">
              Ժամանակակից թվային գրադարան բոլոր ընթերցասերների համար։
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

          {/* Բաժիններ */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Բաժիններ</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Գլխավոր</a></li>
              <li><a href="/books" className="text-muted-foreground hover:text-primary transition-colors">Գրքերի կատալոգ</a></li>
              <li><a href="/audiobooks" className="text-muted-foreground hover:text-primary transition-colors">Աուդիոգրքեր</a></li>
            </ul>
          </div>

          {/* Աջակցություն */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Աջակցություն</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Օգնություն</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Կապ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Օգտագործման կանոններ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Գաղտնիություն</a></li>
            </ul>
          </div>

          {/* Բաժանորդագրություն */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Բաժանորդագրություն</h3>
            <p className="text-muted-foreground mb-4">Ստացեք ծանուցումներ նոր գրքերի մասին</p>
            <form onSubmit={handleSubscribe} className="flex">
              <Input
                type="email"
                placeholder="Ձեր էլ․ հասցեն"
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

        {/* Footer ստորին հատված */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">&copy; 2024 ԳրքաՊտույտ Բոլոր իրավունքները պաշտպանված են։</p>
        </div>
      </div>
    </footer>
  );
}
