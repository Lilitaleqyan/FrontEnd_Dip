import { useState } from "react";
import { useLocation } from "wouter";
import { registerUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { EyeOff, Eye } from "lucide-react";


export default function RegisterForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(formData);

      toast({
        title: "Գրանցումը հաջողվեց",
        description: "Այժմ կարող եք մուտք գործել"
      });


      setLocation("/login");

    } catch (err) {
      toast({
        title: "Գրանցման սխալ",
        description: err.message || "Ինչ-որ բան սխալ է տեղի ունեցել",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      {[
        { name: "firstName", placeholder: "Անուն" },
        { name: "lastName", placeholder: "Ազգանուն" },
        {
          name: "email",
          placeholder: "Էլ. հասցե",
          type: "email",
          pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
        },
        {
          name: "phone",
          placeholder: "Հեռախոս (օր. 094123456)",
          type: "tel",
          pattern: "^(\\+374|0)?[1-9]{2}[0-9]{6}$"
        },
        { name: "username", placeholder: "Օգտանուն" },
      ].map(({ name, placeholder, type = "text", pattern }) => (
        <div key={name}>
          <input
            type={type}
            name={name}
            pattern={pattern}
            value={formData[name]}
            onChange={handleChange}
            placeholder={placeholder}
            required={name !== "phone"}
            className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg
             focus:outline-none focus:ring-2 focus:ring-blue-500 
             not-placeholder-shown:invalid:border-red-500 
             not-placeholder-shown:invalid:text-red-600 
             peer"
          />
          <p className="hidden peer-invalid:block text-[10px] text-red-500 mt-1 ml-1">
            Խնդրում ենք լրացնել ճիշտ ձևաչափով
          </p>
        </div>
      ))}

      <div className="relative">
        <input
          title="Գաղտնաբառը պետք է պարունակի առնվազն 8 նիշ (մեծատառ, թիվ և սիմվոլ(@$!%*?&․))"
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&․]{8,}$"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder=""
          required
          className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg
             focus:outline-none focus:ring-2 focus:ring-blue-500 
             not-placeholder-shown:invalid:border-red-500 
             not-placeholder-shown:invalid:text-red-600 
             peer"
        />
        <p className="mt-2 text-xs text-gray-500">
          <span className="font-semibold text-blue-600">Պահանջ․</span> Գաղտնաբառը պետք է պարունակի առնվազն
          <span className="font-bold text-gray-800"> 8 նիշ</span> (մեծատառ, սիմվոլ և թվեր):
        </p>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg
               hover:bg-blue-700 transition font-medium active:scale-[0.98]"
      >
        Գրանցվել
      </button>
    </form>

    // <form onSubmit={handleSubmit} className="space-y-4 mt-6">

    //   {[
    //     { name: "firstName", placeholder: "Անուն" },
    //     { name: "lastName", placeholder: "Ազգանուն" },
    //     { name: "email", placeholder: "Email", type: "email", pattern: "^[^\s@]+@[^\s@]+\.[^\s@]+$" },
    //     { name: "phone", placeholder: "Հեռախոս", type: "phone", pattern:"^(\\+374|0)?[1-9]{2}[0-9]{6}$"},
    //     { name: "username", placeholder: "Օգտանուն" },
    //     // {
    //     //   // name: "password", placeholder: "Գաղտնաբառ", type: "password", pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
    //     // }
    //   ].map(({ name, placeholder, type = "text" }) => (

    //     <input
    //       key={name}
    //       type={type}
    //       name={name}
    //       value={formData[name]}
    //       onChange={handleChange}
    //       placeholder={placeholder}
    //       required={name !== "phone"}
    //       className="w-full px-4 py-2 bg-gray-100 border rounded-lg
    //                      focus:outline-none focus:ring-2 focus:ring-blue-500"
    //     />
    //   ))}
    //   <div className="relative">
    //     <input
    //       pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
    //       type={"password"}
    //       name="password"
    //       value={formData.password}
    //       onChange={handleChange}
    //       placeholder="Գաղտնաբառ"
    //       required
    //       className="w-full px-4 py-2 bg-gray-100 border rounded-lg"
    //     />
    //     <p class="mt-2 text-xs text-gray-500">
    //       <span class="font-semibold text-blue-600">Պահանջ․</span> Գաղտնաբառը պետք է պարունակի առնվազն <span class="font-bold">8 նիշ</span> (մեծատառ, սիմվոլ և թվեր):
    //     </p>
    //   </div>

    //   <button
    //     type="submit"
    //     className="w-full bg-blue-600 text-white py-2 rounded-lg
    //                    hover:bg-blue-700 transition font-medium"
    //   >
    //     Գրանցվել
    //   </button>
    // </form>
  )
}
