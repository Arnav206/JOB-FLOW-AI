// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabaseClient");

/**
 * protect: verifies the JWT sent in the Authorization header.
 * Use this on any route that should only work for a logged-in user, e.g.:
 *   router.get("/me", protect, authController.getMe);
 */
async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify + decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user fresh from the DB (without the password hash)
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, created_at")
      .eq("id", decoded.id)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user; // attach user to the request for later handlers
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
}

module.exports = { protect };
