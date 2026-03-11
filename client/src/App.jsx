import { Switch, Route, Redirect } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCurrentUser } from "./lib/auth";
import { initializeBooks } from "./lib/storage";
import { useQuery } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import Audiobooks from "./pages/Audiobooks";
import Admin from "./pages/Admin";
import User from "./pages/User";
import NotFound from "@/pages/not-found";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import FavoritesPage from "./pages/FavoritesPage"
import ReservedBooks from "./pages/ReservedBooks";

function ProtectedRoute({ children, adminOnly = false }) {
  const user = getCurrentUser();
  if (!user) return <Redirect to="/login" />;
  if (adminOnly && user?.role?.toLowerCase() !== "admin") return <Redirect to="/" />;
  return <>{children}</>;
}


function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      {/* <Route path="/favorites" component={FavoritesPage} /> */}
      <Route path="/">
        <ProtectedRoute>
          <Navbar />
          <Home />
          <Footer />
        </ProtectedRoute>
      </Route>
      <Route path="/register" component={User} />
      <Route path="/books">
        <ProtectedRoute>
          <Navbar />
          <Books />
          <Footer />
        </ProtectedRoute>
      </Route>
      <Route path="/book/:id">
        <ProtectedRoute>
          <Navbar />
          <BookDetail />
          <Footer />
        </ProtectedRoute>
      </Route>
      <Route path="/audiobooks">
        <ProtectedRoute>
          <Navbar />
          <Audiobooks />
          <Footer />
        </ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute adminOnly={true}>
          <Navbar />
          <Admin />
          <Footer />
        </ProtectedRoute>
      </Route>
      <Route path="/favorites">
        <ProtectedRoute>
          <Navbar />
          <FavoritesPage />
          <Footer />
        </ProtectedRoute>
      </Route>

      <Route path="/reserved">
        <ProtectedRoute>
          <Navbar />
          <ReservedBooks />
          <Footer />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    initializeBooks();
  }, []);



  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;