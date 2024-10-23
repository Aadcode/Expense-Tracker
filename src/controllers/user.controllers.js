import { PrismaClient } from "@prisma/client";
import { createUserValidation } from "../inputValidation/user.validation.js";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export const createUser = async (req, res, next) => {
  const { name, email, mobileNumber, password } = req.body;

  // Validate the incoming request body
  const parsePayload = createUserValidation.safeParse({
    name,
    email,
    mobileNumber,
    password,
  });

  if (!parsePayload.success) {
    // Return 400 for validation errors with detailed messages
    return res.status(400).json({
      message: "Validation failed",
      errors: parsePayload.error.errors,
    });
  }

  try {
    // Check whether the user already exists by email
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" }); // 409 Conflict
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        mobileNumber: parseInt(mobileNumber),
        password: hashedpassword,
      },
      include: {
        password: false,
      },
    });

    return res.status(201).json(newUser); // 201 Created
  } catch (error) {
    console.log(error);
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(404).send("User not Found");
    }
    const passwordvalid = await bcrypt.compare(password, user.password);
    if (user.password !== password) {
      res.status(400).send("Password is Incorrect");
    }
    req.session.isLoggedIn = true;
    req.session.userId = user.id;
    res
      .status(200)
      .json({ message: "Sign in successful", signinSuccess: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signin failed", signinSuccess: false });
  }
};

export const getUserDetails = async (req, res, next) => {
  const userId = req.session.userId;

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" }); // 400 Bad Request
  }

  try {
    // Find user by id
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" }); // 404 Not Found
    }

    return res.status(200).json(user); // 200 OK
  } catch (error) {
    // Pass error to global error handler
    next(error);
  }
};
