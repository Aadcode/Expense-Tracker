import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import cors from "cors";
import sessionMiddleware from "./middleware/session.middleware.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(sessionMiddleware);

// Routes
app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server with a fallback port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
