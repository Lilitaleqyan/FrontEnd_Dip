import { useState } from "react";
import { useLocation } from "wouter";
import { registerUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";


export default function RegisterForm() {
  const [, setLocation] = useLocation(); 
  const { toast } = useToast();

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
            { name: "email", placeholder: "Email", type: "email" },
            { name: "phone", placeholder: "Հեռախոս" },
            { name: "username", placeholder: "Օգտանուն" },
            { name: "password", placeholder: "Գաղտնաբառ", type: "password" }
          ].map(({ name, placeholder, type = "text" }) => (
            <input
              key={name}
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              required={name !== "phone"}
              className="w-full px-4 py-2 bg-gray-100 border rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg
                       hover:bg-blue-700 transition font-medium"
          >
            Գրանցվել
          </button>
        </form>
    )
}
