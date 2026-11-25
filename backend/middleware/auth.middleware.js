const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

/**
 * Protect routes - Verifies JWT bearer token and attaches user to request
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please provide a valid token."
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "nexusflow_jwt_secret_dev_key_2026"
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "The user belonging to this token no longer exists."
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again."
    });
  }
};

module.exports = { protect };
