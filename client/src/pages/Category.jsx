import {useState, useEffect} from 'react';
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';
import { Link } from "wouter";
import { getStoredBooks } from "@/lib/storage";
import {
  Microscope, Calculator, Atom, FlaskConical, Telescope, Cpu, Code,
  Wrench, Stethoscope, Brain, Landmark, Languages, LineChart,Swords,
  Scale, Users, GraduationCap, Globe, Leaf
} from "lucide-react";

export default function Category() {
    const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    filePath: null
  });
      const [file, setFile] = useState(null);


const [allBooks, setAllBooks] = useState([]);
const [featuredBooks, setFeaturedBooks] = useState([]);
  const [books, setBooks] = useState([]);


  useEffect(() => {
    const fetchBooks = async () => {
      const books = await getStoredBooks();
      setAllBooks(books || []);
      setFeaturedBooks((books || []).slice(0, 4));


      const params = new URLSearchParams(window.location.search);
      const category = params.get("category");

      if (category) {
        const filtered = allBooks.filter(book => book.category === category);
        setBooks(filtered);
      } else {
        setBooks(allBooks);
      }
    
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
    name: "Քիմիա",
    count: allBooks.filter(b => b.category === "chemistry").length,
    icon: FlaskConical,
    category: "chemistry"
  },
  {
    name: "Կենսաբանություն",
    count: allBooks.filter(b => b.category === "biology").length,
    icon: Microscope,
    category: "biology"
  },
  {
    name: "Աստղագիտություն",
    count: allBooks.filter(b => b.category === "astronomy").length,
    icon: Telescope,
    category: "astronomy"
  },
  {
    name: "Ինֆորմատիկա",
    count: allBooks.filter(b => b.category === "informatics").length,
    icon: Cpu,
    category: "informatics"
  },
  {
    name: "Ծրագրավորում",
    count: allBooks.filter(b => b.category === "programming").length,
    icon: Code,
    category: "programming"
  },
  {
    name: "Ճարտարագիտություն",
    count: allBooks.filter(b => b.category === "engineering").length,
    icon: Wrench,
    category: "engineering"
  },
  {
    name: "Բժշկություն",
    count: allBooks.filter(b => b.category === "medicine").length,
    icon: Stethoscope,
    category: "medicine"
  },
  {
    name: "Փիլիսոփայություն",
    count: allBooks.filter(b => b.category === "philosophy").length,
    icon: Brain,
    category: "philosophy"
  },
  {
    name: "Հոգեբանություն",
    count: allBooks.filter(b => b.category === "psychology").length,
    icon: Brain,
    category: "psychology"
  },
  {
    name: "Պատմություն",
    count: allBooks.filter(b => b.category === "history").length,
    icon: Landmark,
    category: "history"
  },
  {
    name: "Լեզվաբանություն",
    count: allBooks.filter(b => b.category === "linguistics").length,
    icon: Languages,
    category: "linguistics"
  },
  {
    name: "Տնտեսագիտություն",
    count: allBooks.filter(b => b.category === "economics").length,
    icon: LineChart,
    category: "economics"
  },
  {
    name: "Իրավագիտություն",
    count: allBooks.filter(b => b.category === "law").length,
    icon: Scale,
    category: "law"
  },
  {
    name: "Քաղաքագիտություն",
    count: allBooks.filter(b => b.category === "political_science").length,
    icon: Landmark,
    category: "political_science"
  },
  {
    name: "Սոցիոլոգիա",
    count: allBooks.filter(b => b.category === "sociology").length,
    icon: Users,
    category: "sociology"
  },
  {
    name: "Ռազմական հոգեբանություն",
    count: allBooks.filter(b => b.category === "psychology_of_war").length,
    icon: Swords,
    category: "psychology_of_war"
  },
  {
    name: "Աշխարհագրություն",
    count: allBooks.filter(b => b.category === "geography").length,
    icon: Globe,
    category: "geography"
  },
  {
    name: "Էկոլոգիա",
    count: allBooks.filter(b => b.category === "ecology").length,
    icon: Leaf,
    category: "ecology"
  }
];

const sendMessage = async (e) => {
  e.preventDefault();

  const fd = new FormData();

  fd.append(
    "request",
    new Blob(
      [
        JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        }),
      ],
      { type: "application/json" }
    )
  );

  if (formData.filePath instanceof File) {
    fd.append("file", formData.filePath);
  } else {
    alert("Խնդրում ենք ընտրել PDF կամ DJVu ֆայլ:");
    return;
  }

  try {
    const response = await fetch("http://localhost:8181/reader/sendBook", {
      method: "POST",
      body: fd,
    });

    if (response.ok) {
              toast({
         title: "Շնորհակալություն ",
          description: "Ձեր առաջարկած գիրքը հաջողությամբ ուղարկվեց։ Կայքին համապատասխան լինելու դեպքում այն կավելանա գրքերի ցուցակում",
        });
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            filePath: null,
            fileType:""
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    } else {
      const text = await response.text();
      toast.error(text);
    }
    

  } catch (error) {
    console.error(error);
  }
};

return (
    
       <section className="mb-8 m-8 flex flex-col md:flex-row gap-8 m-12 max-w-1200px">

        <div className="grid grid-cols-3 md:grid-cols-
         gap-6 flex-[2] bg-white rounded-2xl shadow-xl p-8  animate-in fade-in border-t-4 border-blue-700 max-h-[703px] overflow-y-auto  custom-scrollbar space-y-4">
          
          {categories.map(( category) => {
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
              
            ); } )}      

      </div>
      
        <div className="flex-[1] flex flex-col gap-10 ">
            <div className="bg-white rounded-2xl shadow-xl p-10 animate-in fade-in border-t-4 border-blue-700">
            <h3 className="font-bold text-blue-700 italic mb-2 ">ՕԳՏԱԿԱՐ ԾՐԱԳՐԵՐ</h3>
            <a href="http://windjview.sourceforge.net/ru/" target="__blank" className="text-blue-600 text-sm cursor-pointer">Բեռնել DJVU </a><br />
            <a href="https://get.adobe.com/ru/reader/" target="__blank" className="text-blue-600 text-sm cursor-pointer">Բեռնել PDF</a>
          </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-in fade-in border-t-4 border-blue-700">
            <h3 className="font-bold text-blue-700 mb-2 italic p-top-4">Գրքաֆոնդի համալրում</h3>
            <p className="text-sm">Նվիրաբերեք գրքեր մեր գրադարանին</p>
               <form className="space-y-4 mt-4 " onSubmit={sendMessage}>
                    <div>
                      <Label>Անուն</Label>
                      <Input
                        value={formData.firstName}  
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
      
                    <div>
                      <Label>Ազգանուն</Label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
      
                    <div>
                      <Label>էլ֊հասցե</Label>
                       <Input
                       type = "email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required />
                    </div>
      
                      <div>
              <Label>Գրքի ֆայլ (PDF, EPUB, DJVU և այլն)</Label>
              <Input
              className="cursor-pointer"
                type="file"
                accept=".pdf,.epub, .djvu"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData({
                      ...formData,
                      filePath: file, 
                      fileType: file.name.substring(file.name.lastIndexOf(".") + 1)
                    });
                  }
                }}
              />
            </div>
                    <div className="flex justify-end gap-4 ">
                        <Button type="submit">Ուղարկել</Button>
                    </div>
                  </form>
            </div>
            </div>
           
     
      </section>

      
)
}
