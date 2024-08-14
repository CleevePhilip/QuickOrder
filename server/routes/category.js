const { Router } = require("express");
const router = Router();
const db = require("../database/db");

router.post("/admin-page/add-category", async (req, res) => {
  try {
    if (!req.session.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }
    const { category_name } = req.body;

    const query = "INSERT INTO category(category_name) VALUES(?)";
    db.query(query, [category_name], (error, results) => {
      if (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Database error" });
      }
      if (results.affectedRows > 0) {
        return res.status(200).json({
          success: true,
          messsage: "The category has been added successfully!",
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});
router.get("/admin-page/category", async (req, res) => {
  try {
    if (!req.session.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const query = "SELECT * FROM category";
    db.query(query, (error, results) => {
      if (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(200).json({ success: true, data: results });
    });
  } catch (error) {
    console.log(error);
  }
});
// Route to delete category
router.delete("/admin-page/delete-category", async (req, res) => {
  if (!req.session.user) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }
  const { category_id } = req.body;

  // Call the stored procedure
  const query = "DELETE FROM category WHERE category_id = ?";

  db.query(query, [category_id], (error) => {
    if (error) {
      console.log(error.message);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json({
      success: true,
      message: "The category is successfully deleted.",
    });
  });
});

router.put("/admin-page/update-category", (req, res) => {
  if (!req.session.user) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }
  const { category_id, category_name } = req.body;

  // Call the stored procedure
  const checkExist =
    "SELECT category_name FROM category WHERE category_name = ?";

  db.query(checkExist, [category_name], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Database query error" });
    }

    if (results.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }
  });
  const query = "UPDATE category SET category_name = ? WHERE category_id  = ?";

  db.query(query, [category_name, category_id], (error) => {
    if (error) {
      console.log(error.message);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json({
      success: true,
      message: "The category is successfully updated.",
    });
  });
});

module.exports = router;
