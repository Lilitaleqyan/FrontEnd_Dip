import { useState, useEffect } from "react";

import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getStoredBooks, createBook, deleteBook, editBook, getAllReaders, deleteReader, getReservedBooks, getReturnedBook, returnBook  } from "@/lib/storage";
import { isAdmin } from "@/lib/auth";
import { Plus, Search, Edit, Eye, Trash2, BookOpen, Users, Download, Headphones, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { set } from "date-fns";
import { Check } from "lucide-react";


const API_URL = import.meta.env.VITE_API_BASE_URL; // backend-ի URL


export default function Admin() {
  const [modalType, setModalType] = useState("RESERVED"); 
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [reservedBooks, setReservedBooks] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedReader, setSelectedReader] = useState(null);
  const [books, setBooks] = useState([]);
  const [readers, setReaders] = useState([]);
  const [loadingReaders, setLoadingReaders] = useState(false); 
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all"
  
  
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState( {
    title: "", 
    author: "",
    description: "",
    coverUrl: "",
    filePath: null,
    fileType:"",
    category: "fiction",
    content: "",
    audioUrl: "",
    duration: "",
    narrator: "",
    pages: 0
});

  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await isAdmin();
      if (!adminStatus) {
        setLocation("/");
        return;
      }
    };
    checkAdmin();
    ( async () => {
      try {
        await loadBooks();
        console.log(books)
      }
      catch(err)
      {
        console.error("error loading books")
      }
      // const allBooks = await getStoredBooks();
      // setBooks(allBooks || []);
    }) ()
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, searchQuery, selectedCategory]);

   
  const loadBooks = async (allBooks) => {
    allBooks = await getStoredBooks();
    setBooks(allBooks || []);
    return allBooks;
  };

const loadReaders = async () => {
  try {
    setLoadingReaders(true);
    const data = await getAllReaders();
    console.log("Readers data from backend:", data);
    setReaders(data || []);
  } catch (err) {
    console.error("Error loading readers", err);
  } finally {
    setLoadingReaders(false);
  }
};


  useEffect(() => {
    loadReaders();
  }, []);


    
  const filterBooks = () => {
    if (!Array.isArray(books)) return setFilteredBooks([]);
    let filtered = books;
    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }
    setFilteredBooks(filtered);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const fd = new FormData();
   fd.append(
    "book",
    new Blob([JSON.stringify({
      title: formData.title,
      author: formData.author,
      description: formData.description,
      category: formData.category,
      pages: formData.pages,
      coverUrl:formData.coverUrl,
      fileType: formData.fileType,
      // audioUrl: formData.audioUrl,
      narrator: formData.narrator,
      duration:formData.duration
    })], { type:"application/json" })
  );

  // console.log(JSON.stringify({
  //     title: formData.title,
  //     author: formData.author,
  //     description: formData.description,
  //     category: formData.category,
  //     pages: formData.pages,
  //     fileType: formData.fileType
  //   }), { type:"application/json" })
  

  if (formData.filePath instanceof File) {
    fd.append("file", formData.filePath, formData.filePath.name);
    
  }

  if (formData.audioFile instanceof File) {
  fd.append("audioFile", formData.audioFile, formData.audioFile.name);
    // headers: { 'Content-Type': 'audio/mpeg' } 
  
 
}
//  concole.log(formData.)
  for (let pair of fd.entries()) {
    console.log(pair[0], pair[1]);
  }
  try {
    if (editingBook) {
      // console.log(editingBook.id)
      await editBook(editingBook.id, fd);
      toast({
        title: "Գիրքը թարմացAվել է",
        description: "Գրքի տվյալները հաջողությամբ թարմացվել են",
      });
    } else {
      await createBook(fd);
      toast({
        title: "Գիրքը ավելացվել է",
        description: "Նոր գիրքը հաջողությամբ ավելացվել է գրադարան",
      });
  }

   await loadBooks();
    resetForm();
    setIsDialogOpen(false);

  } catch (error) {
    toast({
      title: "Սխալ",
      description: "Չհաջողվեց պահպանել գիրքը",
      variant: "destructive",
    });
  }
};

  const handleEdit = (book) => {

    setEditingBook(book);

  setFormData({
    title: book.title,
    author: book.author,
    description: book.description,
    coverUrl: book.coverUrl,
    category: book.category,
    content: book.content || "",
    //  audioUrl: null,
    duration: book.duration || "",
    narrator: book.narrator || "",
    pages: book.pages || 0,
    fileType: book.fileType || "",
    filePath: null
  });

  setIsDialogOpen(true);
    
  }

  const handleDelete = async (book) => {
    if (window.confirm(`Վստահ եք, որ ուզում եք ջնջել «${book.title}» գիրքը?`)) {
      try {
        await deleteBook(book.id);
        toast({
          title: "Գիրքը ջնջվել է",
          description: "Գիրքը հաջողությամբ հեռացվել է գրադարանից",
        });
        await loadBooks();
      } catch {
        toast({
          title: "Սխալ",
          description: "Չհաջողվեց ջնջել գիրքը",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteReader = async (reader) => {
    // Փորձում ենք գտնել ID-ն
    const readerId = reader.id || reader.userId || reader._id || reader.user_id || reader.ID;
    
    if (!readerId) {
      toast({
        title: "Սխալ",
        description: "Օգտատեր ID-ն չի գտնվել: Backend-ը պետք է վերադարձնի ID-ն getAllUsers response-ում",
        variant: "destructive",
      });
      console.error("Reader object:", reader);
      console.error("Available fields:", Object.keys(reader));
      return;
    }

    if (
      window.confirm(
        `Վստահ ե՞ք, որ ուզում եք ջնջել ${reader.firstName} ${reader.lastName}-ին`
      )
    ) {
      try {
        await deleteReader(readerId);
        toast({
          title: "Օգտատերը ջնջվել է",
          description: "Օգտատերը հաջողությամբ հեռացվել է",
        });
        loadReaders();
      } catch {
        toast({
          title: "Սխալ",
          description: "Չհաջողվեց ջնջել օգտատերին",
          variant: "destructive",
        });
      }
    }
  };

const openUserBooks = async (readerId, type ) => {
  try {
    let data;
    if (type === "RESERVED") {
      data = await getReservedBooks(readerId);
    } else if (type === "RETURNED") {
      data = await getReturnedBook(readerId);
    }

    setSelectedReader(readers.find(r => r.id === readerId));
    setReservations(Array.isArray(data) ? data : []);
    setModalType(type);
    setOpen(true);
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
};


// const openReturnedBooks = async (readerId, type) => {
//   try {
//     const data = await getReservedBooks(readerId);
//     setSelectedReader(readers.find(r => r.id === readerId));
//     setReturnedBooks(data.filter(r => r.status === type ));
//     setOpen(true); 
//     setModalType(type);
//   } catch (e) {
//     console.error(e);
//     alert(e.message);
//   }
// };

const handleReturnBook = async (reservationId) => {
  try {
    await returnBook(reservationId);

    setReservations(prev =>
      prev.filter(r => r.reservationId !== reservationId)
    );

    setReaders(prev =>
  prev.map(r =>
    r.id === selectedReader.id
      ? {
          ...r,
          reservedCount: r.reservedCount - 1,
          returnedCount: r.returnedCount + 1,
        }
      : r
  )
);
    await loadReaders(); 
    toast({
      title: "Գիրքը վերադարձված է",
      description: "Գիրքը հաջողությամբ վերադարձվել է",
    });
  } catch (e) {
    toast({
      title: "Սխալ",
      description: "Չհաջողվեց վերադարձնել գիրքը",
      variant: "destructive",
    });
  }
};

useEffect(() => {
  console.log("Reservations:", reservations);
}, [reservations]);






  const resetForm = () => {
   setEditingBook(null)
    setFormData({
      title: "",
      author: "",
      description: "",
      fileType: "",
      filePath: null,
      coverUrl: "",
      category: "fiction",
      content: "",
      audioUrl: "",
      duration: "",
      narrator: "",
      pages: 0
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  const categoryLabels = {
    all: "Բոլոր կատեգորիաները",
    fiction: "Գեղարվեստական",
    science: "Գիտական",
    educational: "Ուսումնական",
    audiobook: "Աուդիոգրքեր"
  };

  const stats = {
    totalBooks: books.length,
    audiobooks: books.filter(b => b.category === "audiobook").length,
    activeUsers: 1856,
    downloads: 24567,
  };


  return (
    <div className="container mx-auto px-4 py-8 fade-in">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Ադմինի վահանակ</h1>
          <p className="text-muted-foreground">Կառավարեք գրքերի բազան</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-5 h-5 mr-2" />
              Ավելացնել գիրք
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBook ? "Խմբագրել գիրքը" : "Ավելացնել գիրք"}</DialogTitle>
            </DialogHeader>

         
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label>Վերնագիր</Label>
                <Input
                  value={formData.title}  
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Հեղինակ</Label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Նկարագրություն</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label> URL</Label>
                <Input
                
                  value={formData.coverUrl}
                  onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                />
              </div>

              <div>
                <Label>Կատեգորիա</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ընտրեք կատեգորիան" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.category === "audiobook" && (
                <>
      <div>
        <Label>Audio URL</Label>
          <Input
          type = "file"
           accept="audio/"
            onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setFormData({
                ...formData,
                audioFile: file, 
              });
            }
          
          }
        }
          ></Input>
      </div>
                  <div>
                    <Label>Տևողություն</Label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Նարատոր</Label>
                    <Input
                      value={formData.narrator}
                      onChange={(e) => setFormData({ ...formData, narrator: e.target.value })}
                    />
                  </div>
                </>
              )}

              {formData.category !== "audiobook" && (
                <div>
                  <Label>Էջերի քանակը</Label>
                  <Input
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
              )}
                <div>
        <Label>Գրքի ֆայլ (PDF, EPUB և այլն)</Label>
        <Input
          type="file"
          accept=".pdf,.epub"
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


              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Չեղարկել</Button>
                <Button type="submit">{editingBook ? "Թարմացնել" : "Ավելացնել"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      
    

      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Գրքերի կառավարում</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Input
                  placeholder="Որոնել..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pr-10"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredBooks.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">Գրքեր չկան</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <Card key={book.id} className="p-4">
                  <img
                    src={book.coverUrl}
                    className="w-full h-48 object-cover rounded-md mb-3"
                  />
                  <h3 className="font-semibold">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                  <div className="flex justify-between mt-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex items-center justify-center"
                      onClick={() => handleEdit(book)}
                    >
                      <Edit className="w-5 h-5 text-foreground" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex items-center justify-center"
                      onClick={() => handleDelete(book)}
                    >
                      <Trash2 className="w-5 h-5 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="mt-10">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Users className="w-5 h-5" />
      Օգտատերերի կառավարում
    </CardTitle>
  </CardHeader>

  <CardContent>
    {loadingReaders ? (
      <p>Բեռնվում է...</p>
    ) : readers.length === 0 ? (
      <p className="text-muted-foreground">Օգտատերեր չկան</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {readers.map((reader, index) => {
        
          const readerId = reader.id || reader.userId || reader._id || reader.user_id || reader.ID;
          const uniqueKey = readerId || `${reader.email}-${index}` || `reader-${index}`;
          return (
            <Card key={uniqueKey} className="p-4">

              <h3 className="font-semibold">
                {reader.firstName} {reader.lastName}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {reader.email}
              </p>

              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ամրագրված գրքեր:</span>
                  <Badge variant="secondary" className="font-semibold bg-red-500 text-white hover:bg-red-400" onClick={() => {
                  setSelectedReader(reader);
                  openUserBooks(readerId, "RESERVED");
  }} style={{ cursor: 'pointer' }}>
                    {reader.reservedCount || reader.reservedBooksCount || reader.reservedBooks || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Վերադարձված գրքեր:</span>
                  <Badge variant="secondary" className="font-semibold bg-green-500 text-white hover:bg-green-600" onClick={() => {
                    setSelectedReader(reader);
                    openUserBooks(readerId, "RETURNED");
                    
                  }}
                    style={{ cursor: 'pointer' }}>
                    {reader.returnedCount || reader.returnedBooksCount || reader.returnedBooks || 0}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDeleteReader(reader)}
                >
                  <Trash2 className="w-5 h-5 text-destructive" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    )}
  </CardContent>
</Card>
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="ax-w-xl max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>
        {selectedReader?.firstName} {selectedReader?.lastName}—{" "}
        {modalType === "RESERVED" ? "Ամրագրված գրքեր" : "Վերադարձված գրքեր"}
      </DialogTitle>
    </DialogHeader>

      <DialogDescription>
        Այստեղ ցուցադրված են տվյալ ընթերցողի գրքերը
      </DialogDescription>

    {reservations.length === 0 ? (
      <p className="text-muted-foreground">
      {modalType === "RESERVED" ? "Ամրագրումներ չկան" : "Վերադարձված գրքեր չկան"}
      </p>
    ) : (
      <div className="space-y-3">
       {reservations.map((r) => (
  <Card key={r.id} className="p-3 flex gap-4">
    <img
     
  src={r.coverUrl}
  alt={r.title}
  className="w-զ0 h-28 object-cover rounded-md border"
/>

    <div className="flex flex-col gap-1 flex-1">
      <p className="font-semibold">{r.title}</p>
      <p className="text-sm text-muted-foreground">Հեղինակ՝ {r.author}</p>
      {console.log(r)}
      <p className="text-sm">Ամրագրման օր՝ {r.reservationDate}</p>
        {modalType === "RESERVED" ? (
      <Badge className="w-fit bg-red-500 text-white">{r.status}</Badge>) :  <Badge className="w-fit bg-green-500 text-white">{r.status}</Badge>}
   
    </div>
      {modalType === "RESERVED" ? (
    <div className="flex flex-col justify-end">
      <Button
        className="w-30 flex items-center justify-center bg-green-500 hover:bg-green-600"
        onClick={() => handleReturnBook(r.id)}
      >
        Վերադարձված է
      </Button>
    </div>
      ) : null}
  </Card>
))}  
      </div>
    )}    
 </DialogContent>
</Dialog>
   </div>
  );
}
