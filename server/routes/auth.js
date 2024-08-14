const { Router } = require("express");
const db = require("../database/db");

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    let role_id = 1; // Set default role_id as 1 for demonstration
    const query =
      "INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)";

    db.query(query, [username, password, role_id], (error, results) => {
      if (error) {
        console.error(error.message);
        return res.status(500).send("Database error");
      }

      if (results.affectedRows > 0) {
        const user_id = results.insertId;

        req.session.user = { user_id, username, role_id };
        return res.status(201).json({
          user: req.session.user,
          redirectUrl: getRedirectUrl(role_id),
        });
      } else {
        return res.status(400).send("Registration failed");
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const getUser = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(getUser, [username, password], (error, results) => {
      if (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }

      const user = results[0];
      req.session.user = {
        user_id: user.user_id,
        username: user.username,
        role_id: user.role_id,
      };

      res.status(200).json({
        success: true,
        message: "Logged in successfully",
        user: req.session.user,
        redirectUrl: redirectUrl(req.session.user.role_id),
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const redirectUrl = (role_id) => {
  let url = "";
  switch (role_id) {
    case 1:
      url = "/dashboard";
      console.log(url);
      break;
    case 2:
      url = "/staff-page";
      console.log(url);
      break;
    default:
      url = "/";
      break;
  }
  return url;
};
router.get("/profile", async (req, res) => {
  try {
    if (!req.session.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const userId = req.session.user.user_id;
    const query =
      "SELECT user_id, username, role_id FROM users WHERE user_id = ?";

    db.query(query, [userId], (error, results) => {
      if (error) {
        console.error(error.message);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const userProfile = results[0];
      res.status(200).json({ success: true, user: userProfile });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).json({ message: "Logout failed" });
      }

      res.status(200).json({
        success: true,
        message: "Logout successful",
        redirectUrl: "/",
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
