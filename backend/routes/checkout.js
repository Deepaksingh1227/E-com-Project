const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

const MOCK_USER = process.env.MOCK_USER_ID || "mock-user-1";

router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email)
      return res.status(400).json({ error: "Name and email required" });

    const cart = await Cart.findOne({ userId: MOCK_USER }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ error: "Cart empty" });

    const total = cart.items.reduce(
      (s, it) => s + it.product.price * it.qty,
      0
    );
    // mock receipt
    const receipt = {
      id: `rcpt_${Date.now()}`,
      name,
      email,
      total,
      items: cart.items.map((it) => ({
        productId: it.product._id,
        name: it.product.name,
        price: it.product.price,
        qty: it.qty,
      })),
      timestamp: new Date().toISOString(),
    };

    // clear cart after checkout (persisted)
    cart.items = [];
    await cart.save();

    res.json({ receipt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Checkout failed" });
  }
});

module.exports = router;
