import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

const app = express();
const port = 4001;
const saltRounds = 10; // Number of salt rounds for bcrypt

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Generate One-Time Password (OTP)
function generateOTP() {
  // Generate a six-digit numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

// Connect to DB
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "bank",
});

// Helper function to make code look nicer
async function query(sql, params) {
  const [results, fields] = await pool.execute(sql, params);
  return results;
}

// Create user endpoint
app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into the database
    const result = await query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);
    const userId = result.insertId;

    // Insert account for the new user
    await query("INSERT INTO accounts (userId, amount) VALUES (?, ?)", [userId, 0]);

    res.json({
      success: true,
      message: "User and account created successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred while creating the user." });
  }
});

// Login endpoint
app.post("/sessions", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user in the database
    const users = await query("SELECT * FROM users WHERE username = ?", [username]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid login credentials." });
    }

    // Verify the password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid login credentials." });
    }

    // Create and save a session token and OTP for the user
    const token = generateOTP();
    const otp = generateOTP();
    await query("INSERT INTO sessions (userId, token, otp) VALUES (?, ?, ?)", [user.id, token, otp]);

    res.json({ success: true, token }); // Return token to the client
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred while logging in." });
  }
});

// Show balance endpoint
app.post("/me/accounts", async (req, res) => {
  const { token } = req.body;

  try {
    // Find the session in the database
    const sessions = await query("SELECT * FROM sessions WHERE token = ?", [token]);
    const session = sessions[0];

    if (!session) {
      return res.status(401).json({ success: false, message: "Invalid session token." });
    }

    const userId = session.userId;
    // Find the account in the database
    const accounts = await query("SELECT * FROM accounts WHERE userId = ?", [userId]);
    const account = accounts[0];

    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found for the user." });
    }

    res.json({ success: true, amount: account.amount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred while retrieving the balance." });
  }
});

// Deposit money endpoint
app.post("/me/accounts/transactions", async (req, res) => {
  const { token, amount, otp } = req.body;

  try {
    // Find the session in the database
    const sessions = await query("SELECT * FROM sessions WHERE token = ?", [token]);
    const session = sessions[0];

    if (!session) {
      return res.status(401).json({ success: false, message: "Invalid session token." });
    }

    const userId = session.userId;

    // Verify OTP
    const sessionWithOTP = await query("SELECT * FROM sessions WHERE token = ? AND otp = ?", [token, otp]);
    if (sessionWithOTP.length === 0) {
      return res.status(401).json({ success: false, message: "Incorrect OTP." });
    }

    // Find the account in the database
    const accounts = await query("SELECT * FROM accounts WHERE userId = ?", [userId]);
    const account = accounts[0];

    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found for the user." });
    }

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      return res.status(400).json({ success: false, message: "Deposit amount must be a positive number." });
    }

    // Update account balance
    await query("UPDATE accounts SET amount = amount + ? WHERE userId = ?", [depositAmount, userId]);

    res.json({ success: true, newBalance: account.amount + depositAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred while processing the transaction." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Bank backend running at http://localhost:${port}`);
});
