import {useState} from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';


export default function AboutModal() {
const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
    const [file, setFile] = useState(null);
  
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
     }else {
    alert("Խնդրում ենք ընտրել PDF կամ DJVu ֆայլ:");
     return;
  }

  try {
    const response = await fetch(`http://localhost:8181/reader/sendBook`, {
      method: "POST",
      body: fd,
      
    });
     
     if (response.ok) {
      toast.update(id, { 
        render: " Գիրքը հաջողությամբ ուղարկվեց", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
    } else {
      toast.update(id, { 
        render: "Սխալ սերվերի կողմից", 
        type: "error", 
        isLoading: false, 
        autoClose: 3000 
      });
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
 

  return (
   
      <div 
        className="flex flex-col md:flex-row gap-8 m-12 max-w-1200px ">
        <div className="flex-[2] bg-white rounded-2xl shadow-xl p-8  animate-in fade-in border-t-4 border-blue-700">
        <h2 className="text-2xl font-bold text-blue-700 italic mb-4 flex items-center gap-2">
          📖 Գրքապտույտի Մասին
        </h2>

     <div className="text-gray-900 pr-2 ">
    <p className="mb-6 text-base leading-relaxed font-medium">
     Բարի գալուստ Գրքապտույտ</p>
     <p>«Գրքապտույտ» գիտական էլեկտրոնային գրադարանը ստեղծվել է ուսանողների,
        դասախոսների, հետազոտողների և գիտությամբ հետաքրքրված բոլոր ընթերցողների համար։ Կայքի նպատակն է տրամադրել գիտական և ուսումնական
        գրականություն, ապահովելով ակադեմիական ռեսուրսների բաց և համակարգված մատչելիություն:
        Գրադարանում ներկայացված են տարբեր ոլորտների նյութեր՝ մասնագիտական գրքեր, ուսումնամեթոդական
        ձեռնարկներ, գիտական հոդվածներ, մագիստրոսական թեզեր, կուրսային աշխատանքներ և հանրագիտարաններ։ Օգտվողները կարող են առցանց դիտել, որոնել և ներբեռնել անհրաժեշտ գրականությունը՝  ուսման,
        գիտահետազոտական աշխատանքի իրականացման կամ ինքնակրթվելու նպատակով։ Գրադարանի հիմնական առաքելությունն է նպաստել կրթության և գիտության
        զարգացմանը՝տրամադրելով ժամանակակից թվային ծառայություններ  և ապահովելով գիտական տեղեկատվության մատչելիություն լայն շրջանակների
        համար։ Կայքում գործում են նաև լրացուցիչ ծառայություններ, որոնք հնարավորություն են տալիս օգտվողներին արագ գտնել անհրաժեշտ գրականությունը, կատարել
        առցանց հարցումներ և իմանալ նոր հրապարակումների մասին։ Մեր նպատակն է ստեղծել ժամանակակից և հարմարավետ թվային միջավայր,
        որտեղ յուրաքանչյուր օգտվող կարող է հեշտությամբ օգտվել գիտական և կրթական
        տեղեկատվական աղբյուրներից։</p>
        <p>
       <strong> -  Գրքապտույտը հարթակ է,
      որտեղ գիտելիքը ոչ միայն պահպանվում է, 
      այլև շրջանառվում է՝ ստեղծելով նոր գաղափարներ և 
      նպաստելով կրթական որակի բարձրացմանը։</strong>
 
</p>
  <div className="bg-blue-50/50 m-4 p-4 rounded-xl border border-blue-100">
    <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
      Ինչու՞ ընտրել մեզ 🤔
    </h3>

    <ul className="space-y-2">
      {[
    { title: "Արագ և հարմար որոնում", icon: "🔍" },
      { title: "Աուդիոգրքերի հասանելիություն", icon: "🎧" },
      { title: "Գրքերի էլեկտրոնային տարբերակներ", icon: "📄" },
      { title: "AI օգնական՝ գրքերի ընտրության համար", icon: "🤖" },
      { title: "Ժանրերի լայն ընտրանի", icon: "📚" }
      ].map((item, index) => (
        <li key={index} className="flex items-center gap-2 text-sm">
          <span className="text-blue-500 text-xs">●</span>
          <span className="font-medium text-gray-800">{item.title}</span>
          <span className="ml-auto opacity-70">{item.icon}</span>
        </li>
      ))}
    </ul>
        <p className="mt-6 text-sm font-medium text-blue-600 italic">
    Գրքապտույտ / Ակադեմիական գիտական շտեմարան
  </p>
  </div>


</div>
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
         <form className="space-y-4 mt-4">
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
                <Button className="bg-blue-700" onClick = {sendMessage} type="submit">{"Ուղարկել"}</Button>
              </div>
            </form>
      </div>
      </div>
      </div>
   
  );
}