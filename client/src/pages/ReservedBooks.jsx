import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, BookCheck, History } from "lucide-react";
import { data } from "autoprefixer";

export default function ReservedBooks() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([])
  const user = getCurrentUser();


  useEffect(() => {
   const token = localStorage.getItem("jwt_token");
    console.log(token)
  fetch(`http://localhost:8181/reader/${user.id}/getReservationsHistory`, {
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
  .then(data => setUserData(data))
  .catch(err => console.error(err));

  console.log(data)
}, []);



//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <History className="h-6 w-6 text-primary" />
              Ամրագրումների պատմություն
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Տեսեք ձեր կողմից ամրագրված բոլոր գրքերի ցանկը և կարգավիճակը
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">№</TableHead>
                <TableHead>Վերնագիր</TableHead>
                <TableHead>Ամրագրման ամսաթիվ</TableHead>
                <TableHead>Վերադարձի ամսաթիվ</TableHead>
                <TableHead className="text-center">Կարգավիճակ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userData && userData.length > 0 ? (
                userData.map((res, index) => (
                  <TableRow key={res.id}>
                    <TableCell className="font-medium text-muted-foreground">
                    {index + 1}
                    </TableCell>
                     <TableCell className="flex items-center gap-2 font-medium">
                     {res.bookCopy?.book?.title || "Անհայտ գիրք"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        {res.reservationDate}
                      </div>
                    </TableCell>

                 
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookCheck className="h-4 w-4 text-muted-foreground" />
                        {res.returnDate || "---"}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={res.active ? "default" : "secondary"}
                        className={res.active ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {res.active ? "Ակտիվ" : "Վերադարձված"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Դուք դեռ չունեք ամրագրված գրքեր:
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}