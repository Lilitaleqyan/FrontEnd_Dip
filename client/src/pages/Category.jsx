import {useState, useEffect} from 'react';

import { Link } from "wouter";
import { getStoredBooks } from "@/lib/storage";
import {
  Microscope, Calculator, Atom, FlaskConical, Telescope, Cpu, Code,
  Wrench, Stethoscope, Brain, Landmark, Languages, LineChart,
  Scale, Users, GraduationCap, Globe, Leaf
} from "lucide-react";

export default function Category() {


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
    name: "Կրթագիտություն",
    count: allBooks.filter(b => b.category === "education").length,
    icon: GraduationCap,
    category: "education"
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


return (
    
       <section className="mb-8 m-8">

        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
       
        </h2>
        <div className="grid grid-cols-4 md:grid-cols-4 gap-6">
          
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
              
            );
            
            
          }
        )
          }      

      </div>
     
      </section>
)
}
