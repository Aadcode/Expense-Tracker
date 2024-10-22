// mailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Parser } from "json2csv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

// Function to generate CSV from balance sheet data
const createBalanceSheetCSV = (balanceSheetData) => {
  const json2csvParser = new Parser({
    fields: [
      { label: "User ID", value: "userId" },
      { label: "User Name", value: "userName" },
      { label: "Expense Description", value: "expenseDescription" },
      { label: "Total Amount", value: "totalAmount" },
      { label: "Amount Owed", value: "amountOwed" },
    ],
  });
  return json2csvParser.parse(balanceSheetData);
};

// Mail service to send email with balance sheet
export const sendEmailWithBalanceSheet = async (
  recipientEmail,
  username,
  balanceSheetData
) => {
  try {
    const emailBody = `Hi ${username},<br/>Please find your balance sheet attached.`;

    // Generate CSV content from balance sheet data
    const balanceSheetCSV = createBalanceSheetCSV(balanceSheetData);

    // Send email with attachment
    await transporter.sendMail({
      to: recipientEmail,
      from: "aadarshjain1920@gmail.com", // Your verified sender email
      subject: "Your Balance Sheet",
      html: emailBody,
      attachments: [
        {
          filename: "balance-sheet.csv",
          content: balanceSheetCSV,
          contentType: "text/csv",
        },
      ],
    });

    console.log("Email with balance sheet sent successfully");
  } catch (error) {
    console.error("Error sending email with balance sheet:", error);
    throw error;
  }
};
