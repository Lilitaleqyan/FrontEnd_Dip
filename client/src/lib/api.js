const API_URL = import.meta.env.VITE_API_BASE_URL; // backend URL

export const getBooks = async () => {
    const token = localStorage.getItem("jwt_token")
  const res = await fetch(`${API_URL}/full/getAllBooks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
       "Authorization": `Bearer ${token}`, //TODO
    },
    credentials: "include", 
    
  });

  if (!res.ok) {
    console.log(res)
    let errorMessage = `HTTP error! status: ${res.status}`;
    console.log(errorMessage);
    try {
      const errorData = await res.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (err) {
     
      errorMessage = res.statusText || `HTTP error! status: ${res.status}`;
      console.log(errorMessage)
    }
       console.log(errorMessage)
    throw new Error(errorMessage);
     
  }

  return res.json();
};
