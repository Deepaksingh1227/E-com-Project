const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const fetch = require("node-fetch");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().limit(20);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// optional route to refresh from FakeStore
router.post("/import-fakestore", async (req, res) => {
  const { url } = req.body;
  const fakeUrl = url || process.env.FAKESTORE_URL;
  try {
    const response = await fetch(fakeUrl);
    const data = await response.json();
    // basic mapping
    const docs = data.slice(0, 10).map((p) => ({
      externalId: p.id?.toString(),
      name: p.title || p.name,
      price: Number(p.price) || 0,
      image: p.image,
      description: p.description || "",
    }));
    await Product.deleteMany({});
    await Product.insertMany(docs);
    res.json({ imported: docs.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to import" });
  }
});

module.exports = router;
