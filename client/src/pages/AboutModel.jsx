import {useState} from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';
import { useRef } from "react";


export default function AboutModal() {
  const fileInputRef = useRef(null)
const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  filePath: null
});
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
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 md:p-12 bg-[#f8fafc]">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1240px] flex flex-col md:flex-row rounded-[2.5rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        
        <div className="flex-[1.4] p-10 md:p-20 text-slate-800">
    

          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
            Թվային գրադարան <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              նոր սերնդի համար
            </span>
          </h2>

          <div className="space-y-6 text-slate-600 text-lg max-h-[300px] leading-relaxed max-w-2xl w-200 overflow-y-auto pr-4 custom-scrollbar space-y-6">
            <p className="text-slate-900">  
              <span className="font-bold text-slate-900">«Գրքապտույտ»</span>֊ը միայն կայք չէ, այլ գիտական էկոհամակարգ, որը միավորում է ուսանողներին և հետազոտողներին: Մենք ստեղծել ենք հարթակ, որտեղ գիտելիքը հասանելի է ընդամենը մեկ հպումով:
            </p>
            
            <p className="border-l-4 border-blue-500 pl-6 py-2 bg-slate-50 rounded-r-xl italic">
              «Մեր նպատակն է ստեղծել ժամանակակից և հարմարավետ թվային միջավայր, որտեղ յուրաքանչյուրը կգտնի իրեն անհրաժեշտ աղբյուրը:»
            </p>
            <span className="text-slate-900 py-2 ">
                Գրադարանի հիմնական առաքելությունն է նպաստել կրթության և գիտության

                 զարգացմանը՝տրամադրելով ժամանակակից թվային ծառայություններ և ապահովելով գիտական տեղեկատվության մատչելիություն լայն շրջանակների



                  համար։ Կայքում գործում են նաև լրացուցիչ ծառայություններ, որոնք հնարավորություն են տալիս օգտվողներին արագ գտնել անհրաժեշտ գրականությունը, կատարել



                  առցանց հարցումներ և իմանալ նոր հրապարակումների մասին։
                  </span>
          </div>
      
  
        </div>

        <div className="flex-1 bg-slate-50/50 flex items-center justify-center p-12 relative">
          <div className="relative scale-110">
            {/* "Գրքի" թեթև իմիտացիա */}
            <div className="w-56 h-72 bg-white rounded-2xl shadow-[20px_20px_60px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col p-8 rotate-[-6deg] relative z-20">
              <div className="w-12 h-2 bg-blue-500 rounded-full mb-6"></div>
              <div className="space-y-4">
                <div className="w-full h-2.5 bg-slate-100 rounded-full"></div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full"></div>
                <div className="w-3/4 h-2.5 bg-slate-100 rounded-full"></div>
              </div>
              <div className="mt-auto flex gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50"></div>
                <div className="w-8 h-8 rounded-lg bg-teal-50"></div>
              </div>
            </div>

            {/* Երկրորդական դեկորատիվ շերտ */}
            <div className="absolute top-4 left-4 w-56 h-72 bg-blue-600 rounded-2xl shadow-xl rotate-[6deg] z-10 flex items-end p-6">
                <div className="text-white/20 text-6xl font-black italic">ԳՊ</div>
            </div>
          </div>

          {/* Դեկորատիվ կետիկներ */}
          <div className="absolute top-10 right-10 grid grid-cols-3 gap-2 opacity-20">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-slate-400 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );






}