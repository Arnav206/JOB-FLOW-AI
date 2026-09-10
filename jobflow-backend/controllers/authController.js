// controllers/authController.js
const bcrypt = require("bcryptjs");
const supabase = require("../config/supabaseClient");
const generateToken = require("../utils/generateToken");

// @route  POST /api/auth/signup
// @desc   Create a new user account
// @access Public
async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are all required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // 1. Check if a user with this email already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    // 2. Hash the password (NEVER store plain text passwords)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Insert the new user
    const { data: newUser, error } = await supabase
      .from("users")
      .insert([{ name, email: email.toLowerCase(), password_hash: passwordHash }])
      .select("id, name, email, created_at")
      .single();

    if (error) throw error;

    // 4. Issue a JWT so the user is immediately logged in after signup
    const token = generateToken(newUser.id);

    res.status(201).json({
      message: "Account created successfully",
      user: newUser,
      token,
    });
  } catch (err) {
    next(err);
  }
}

// @route  POST /api/auth/login
// @desc   Authenticate a user and return a JWT
// @access Public
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, password_hash, created_at")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (error) throw error;
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.id);

    // Never send the password hash back to the client
    delete user.password_hash;

    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (err) {
    next(err);
  }
}

// @route  GET /api/auth/me
// @desc   Get the currently logged-in user's profile
// @access Private (needs valid JWT)
async function getMe(req, res, next) {
  try {
    // req.user was attached by the authMiddleware
    res.status(200).json({ user: req.user });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login, getMe };
