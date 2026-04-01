import { useState } from "react";
import { resetPassword } from "@/lib/storage";

export default function ResetPasswordPage() {
  const search = window.location.search;              
  const params = new URLSearchParams(search);
  const token = params.get("token");                  


     console.log("TOKEN FROM URL:", token);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    console.log("TOKEN FROM URL:", token);            

    if (!token) {
      setError("Սխալ կամ դատարկ հղում է (token չկա)");
      return;
    }

    try {
      await resetPassword(token, password);
    } catch (e) {
      setError(e.message);
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4">
    <form
      onSubmit={submit}
      className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl space-y-5"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Վերականգնել գաղտնաբառը
      </h2>

      {error && (
        <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
          {error}
        </p>
      )}

      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Մուտքագրիր նոր գաղտնաբառ"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:scale-[0.98] transition duration-200 shadow-md"
      >
        Փոխել գաղտնաբառը
      </button>
    </form>
  </div>
);
}