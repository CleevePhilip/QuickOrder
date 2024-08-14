const { Router } = require("express");
const router = Router();
const db = require("../database/db");

// Route to create a new order
router.post("/create-order", async (req, res) => {
  try {
    if (!req.session.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }
    const user_id = req.session.user.user_id;

    const { customer_name, status } = req.body;
    const query =
      "INSERT INTO orders(customer_name, status, user_id) VALUES(?, ?, ?)";

    db.query(query, [customer_name, status, user_id], (error, results) => {
      if (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Database error" });
      }
      const order_id = results.insertId;

      res
        .status(200)
        .json({ success: true, message: "Order created", order_id });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Route to add order details
router.post("/order-details", async (req, res) => {
  try {
    const orderDetails = req.body;
    const query =
      "INSERT INTO order_details(order_id, menu_id, quantity, total_price) VALUES ?";
    const values = orderDetails.map(
      ({ order_id, menu_id, quantity, total_price }) => [
        order_id,
        menu_id,
        quantity,
        total_price,
      ]
    );

    db.query(query, [values], (error, results) => {
      if (error) {
        return res
          .status(401)
          .json({ success: false, message: "Database error" });
      }
      res.status(200).json({
        success: true,
        message: "Order successfully added",
        data: results,
      });
    });
  } catch (error) {
    console.log("Internal server error", error);
  }
});

// Route to get menu items by category
router.post("/getMenu-category", async (req, res) => {
  try {
    const { category_id } = req.body;
    const query = "SELECT * FROM menu WHERE category_id = ?";

    db.query(query, [category_id], (error, results) => {
      if (error) {
        return res
          .status(401)
          .json({ success: false, message: "Database error" });
      }
      res.status(200).json({ success: true, data: results });
    });
  } catch (error) {
    console.log("Error", error);
  }
});

// Route to get all categories
router.get("/category", async (req, res) => {
  try {
    const query = "SELECT * FROM category";
    db.query(query, (error, results) => {
      if (error) {
        return res
          .status(401)
          .json({ success: false, message: "Database error" });
      }
      res.status(200).json({ success: true, data: results });
    });
  } catch (error) {
    console.log("Internal server error", error);
  }
});

module.exports = router;
