import { createServer } from "http";
import { storage } from "./storage.js";

export async function registerRoutes(app) {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Books API endpoint
  app.get("/api/books", async (req, res) => {
    try {
      // For now, return empty array since books are stored in localStorage
      // TODO: Implement server-side book storage if needed
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: "Произошло ошибка" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
