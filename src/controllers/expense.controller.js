import { PrismaClient, Prisma } from "@prisma/client";

import { sendEmailWithBalanceSheet } from "../utils/email.service.js";

const prisma = new PrismaClient();

// Utility function to calculate split details based on method
const calculateSplit = (method, totalSum, participants) => {
  switch (method) {
    case "Equal":
      const share = totalSum / participants.length;
      return participants.map((user) => ({
        userId: user.userId,
        amountOwed: new Prisma.Decimal(share),
      }));

    case "Exact":
      return participants.map((user) => ({
        userId: user.userId,
        amountOwed: new Prisma.Decimal(user.amountOwed),
      }));

    case "Percentage":
      const totalPercentage = participants.reduce(
        (sum, p) => sum + p.percentage,
        0
      );
      if (totalPercentage !== 100) {
        throw new Error("Percentages must add up to 100%");
      }
      return participants.map((user) => ({
        userId: user.userId,
        amountOwed: new Prisma.Decimal((user.percentage / 100) * totalSum),
      }));

    default:
      throw new Error("Invalid split method");
  }
};

// Controller to add an expense
export const addExpense = async (req, res, next) => {
  const { description, totalSum, participants, method, userId } = req.body;

  try {
    // Validate userId and totalSum
    if (!Number.isInteger(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (totalSum <= 0) {
      return res
        .status(400)
        .json({ message: "Total sum must be greater than zero" });
    }

    // Ensure participants are provided
    if (!Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ message: "Participants are required" });
    }

    // Calculate split details based on the provided method
    const splitDetails = calculateSplit(method, totalSum, participants);

    // Create the expense in the database
    const expense = await prisma.expense.create({
      data: {
        description,
        totalSum: new Prisma.Decimal(totalSum),
        method,
        userId, // User who created the expense
        participants: {
          create: splitDetails.map(({ userId, amountOwed }) => ({
            userId,
            amountOwed,
          })),
        },
      },
    });

    return res.status(201).json(expense);
  } catch (error) {
    console.error("Error adding expense:", error);
    if (error.message.includes("Percentages must add up to 100%")) {
      return res.status(400).json({ message: error.message });
    }
    next(error); // Pass to global error handler
  }
};

// Controller to fetch a user's expenses
export const getUserExpenses = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Validate user ID
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Fetch all expenses the user has participated in
    const userExpenses = await prisma.participant.findMany({
      where: { userId },
      include: { expense: true },
    });

    if (!userExpenses.length) {
      return res
        .status(404)
        .json({ message: "No expenses found for this user" });
    }

    return res.status(200).json(userExpenses);
  } catch (error) {
    console.error("Error fetching user expenses:", error);
    next(error); // Pass to global error handler
  }
};

// Controller to fetch all expenses
export const getAllExpenses = async (req, res, next) => {
  try {
    // Fetch all expenses and participants
    const allExpenses = await prisma.expense.findMany({
      include: { participants: true },
    });

    return res.status(200).json(allExpenses);
  } catch (error) {
    console.error("Error fetching all expenses:", error);
    next(error); // Pass to global error handler
  }
};

// Controller to download balance sheet as CSV
export const downloadBalanceSheet = async (req, res, next) => {
  const loggedInUserId = req.session.userId;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: loggedInUserId,
      },
    });
    // Fetch all participants' expenses including user and expense details
    const participants = await prisma.participant.findMany({
      include: {
        user: true,
        expense: true,
      },
    });

    if (!participants.length) {
      return res.status(404).json({ message: "No balance sheet data found" });
    }

    // Prepare balance sheet data for CSV conversion
    const balanceSheetData = participants.map((participant) => ({
      userId: participant.userId,
      userName: participant.user?.name || "Unknown User",
      expenseDescription: participant.expense?.description || "No Description",
      totalAmount: participant.expense.totalSum || 0,
      amountOwed: participant.amountOwed || 0,
    }));

    await sendEmailWithBalanceSheet(user.email, user.name, balanceSheetData);

    // Set response headers to download the file
    res.status(200).json({ message: "Balance sheet sent via email" });
  } catch (error) {
    console.error("Error generating or sending balance sheet:", error);
    next(error);
  }
};
