const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");

const MOCK_USER = process.env.MOCK_USER_ID || "mock-user-1";

// get cart + total
router.get("/", async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: MOCK_USER }).populate(
      "items.product"
    );
    if (!cart) {
      cart = await Cart.create({ userId: MOCK_USER, items: [] });
    }
    const total = cart.items.reduce(
      (s, it) => s + it.product.price * it.qty,
      0
    );
    res.json({ cart, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// add { productId, qty }
router.post("/", async (req, res) => {
  try {
    const { productId, qty } = req.body;
    if (!productId || !qty)
      return res.status(400).json({ error: "productId and qty required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    let cart = await Cart.findOne({ userId: MOCK_USER });
    if (!cart) cart = await Cart.create({ userId: MOCK_USER, items: [] });

    const existing = cart.items.find(
      (it) => it.product.toString() === productId
    );
    if (existing) {
      existing.qty = existing.qty + Number(qty);
    } else {
      cart.items.push({
        product: new mongoose.Types.ObjectId(productId),
        qty: Number(qty),
      });
    }

    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate("items.product");
    const total = cart.items.reduce(
      (s, it) => s + it.product.price * it.qty,
      0
    );
    res.json({ cart, total });
  } catch (err) {
    console.error("Add to cart failed:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// delete item by product _id
router.delete("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ userId: MOCK_USER });
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    cart.items = cart.items.filter((it) => it.product.toString() !== productId);
    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate("items.product");
    const total = cart.items.reduce(
      (s, it) => s + it.product.price * it.qty,
      0
    );
    res.json({ cart, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove item" });
  }
});

// update quantity
router.patch("/update", async (req, res) => {
  try {
    const { productId, qty } = req.body;
    if (!productId || qty == null)
      return res.status(400).json({ error: "productId and qty required" });

    const cart = await Cart.findOne({ userId: MOCK_USER });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find((it) => it.product.toString() === productId);
    if (!item) return res.status(404).json({ error: "Item not found in cart" });

    item.qty = Math.max(1, Number(qty));
    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate("items.product");
    const total = cart.items.reduce(
      (s, it) => s + it.product.price * it.qty,
      0
    );
    res.json({ cart, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update item" });
  }
});

module.exports = router;
