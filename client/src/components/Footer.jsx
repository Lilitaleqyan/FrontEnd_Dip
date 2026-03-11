import { useState } from "react";
import { BookOpen, Facebook, Twitter, Instagram, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmail("");
  };

const sendMessage = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:8181/reader/sendMassageForAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      console.error("Failed to send message:", response.statusText);
    } else {
      console.log("Message sent successfully");
      setMessage(""); // clear input only on success
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
  return (
    <footer className="bg-card border-t border-border py-12 mt-16 bg-gradient-to-r from-purple-200 to-blue-300">
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
              <a href="https://www.facebook.com/" target="_blank">
              <Button variant="ghost" size="sm">
                <Facebook className="h-5 w-5" />
              </Button></a> 
              <a href="https://x.com/" target="_blank">
              <Button variant="ghost" size="sm">
                <Twitter className="h-5 w-5" />
              </Button></a>
              <a href="https://www.instagram.com/" target="_blank">
              <Button variant="ghost" size="sm">
                <Instagram className="h-5 w-5" />
              </Button></a>
            </div>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">Բաժիններ</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Գլխավոր</a></li>
              <li><a href="/books" className="text-muted-foreground hover:text-primary transition-colors">Գրքերի կատալոգ</a></li>
              <li><a href="/audiobooks" className="text-muted-foreground hover:text-primary transition-colors">Աուդիոգրքեր</a></li>
            </ul>
          </div>
{/* 
          <div>
            <h3 className="text-foreground font-semibold mb-4">Աջակցություն</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Օգնություն</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Կապ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Օգտագործման կանոններ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Գաղտնիություն</a></li>
            </ul>
          </div> */}

          <div>
            <h3 className="text-foreground font-semibold mb-4">Բաժանորդագրություն</h3>
            <p className="text-muted-foreground mb-4">Ստացեք ծանուցումներ նոր գրքերի մասին</p>
            <form onSubmit={sendMessage} className="flex">
              <Input
                type="text"
                placeholder="Ձեր հաղորդագրությունը..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="rounded-r-none"
              />
              <Button onClick={sendMessage} type="submit" className="rounded-l-none" >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">&copy; 2026 ԳրքաՊտույտ Բոլոր իրավունքները պաշտպանված են։</p>
        </div>
      </div>
    </footer>
  );
}
