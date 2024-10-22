import express from "express";
import {
  addExpense,
  getUserExpenses,
  getAllExpenses,
  downloadBalanceSheet,
} from "../controllers/expense.controller.js";
import isAuth from "../middleware/isAuth.middleware.js";

const router = express.Router();

// Route for adding a new expense
router.post("/addExpense", isAuth, addExpense);

// Route for retrieving all expenses for a specific user
router.get("/user/:id", isAuth, getUserExpenses);

// Route for retrieving all expenses
router.get("/", isAuth, getAllExpenses);

// Route for downloading the balance sheet as a CSV file
router.get("/balance-sheet", isAuth, downloadBalanceSheet);

export default router;
