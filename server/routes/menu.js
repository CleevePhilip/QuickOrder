const { Router } = require("express");
const db = require("../database/db");
const router = Router();

router.post("/admin-page/add-menu", async (req, res) => {
  try {
    if (!req.session.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }
    const { category_id, menu_name, price } = req.body;
    if (!req.session.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }
    const query =
      "INSERT INTO menu(category_id, menu_name, price) VALUES(?, ?, ?)";
    db.query(query, [category_id, menu_name, price], (error, results) => {
      if (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Database error" });
      }
      if (results.affectedRows > 0) {
        return res
          .status(200)
          .json({ success: true, message: "Menu added successfully!" });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/admin-page/menu", async (req, res) => {
  try {
    if (!req.session.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }
    const query = "SELECT * FROM menu";
    db.query(query, (error, results) => {
      if (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Database error" });
      }
      console.log("Fetched data from database:", results); // Log the results
      res.status(200).json({ success: true, data: results });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/admin-page/edit-menu", async (req, res) => {
  try {
    if (!req.session.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }
    const { menu_id, category_id, menu_name, price } = req.body;
    if ((category_id === null && menu_name === null, price === null)) {
      return res
        .status(400)
        .json({ success: false, message: "Make sure the datas are not empty" });
    }
    const query =
      "UPDATE menu SET category_id = ?, menu_name = ?, price = ? WHERE menu_id = ?";
    db.query(query, [category_id, menu_name, price, menu_id], (error) => {
      if (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Database error" });
      }
      console.log("success");
      res.status(200).json({
        success: true,
        message: "The category is successfully updated.",
      });
    });
  } catch (error) {
    console.log(error);
  }
});
router.delete("/admin-page/delete-menu", async (req, res) => {
  if (!req.session.user) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }
  try {
    const { menu_id } = req.body;
    const query = "DELETE FROM menu WHERE menu_id = ?";
    db.query(query, [menu_id], (error) => {
      if (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json({
        success: true,
        message: "Menu has been deleted successfully.",
      });
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
