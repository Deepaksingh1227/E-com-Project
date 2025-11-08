require("dotenv").config();
const connectDB = require("../config/db");
const Product = require("../models/Product");
const fetch = require("node-fetch");

const MONGO = process.env.MONGO_URI;
const USE_FAKE =
  (process.env.USE_FAKESTORE || "false").toLowerCase() === "true";
const FAKE_URL =
  process.env.FAKESTORE_URL || "https://fakestoreapi.com/products";

async function seed() {
  await connectDB(MONGO);
  await Product.deleteMany({});
  if (USE_FAKE) {
    console.log("Importing from FakeStore API...");
    const res = await fetch(FAKE_URL);
    const data = await res.json();
    const docs = data.slice(0, 10).map((p) => ({
      externalId: p.id?.toString(),
      name: p.title || p.name,
      price: Number(p.price) || 0,
      image: p.image,
      description: p.description || "",
    }));
    await Product.insertMany(docs);
    console.log("Imported", docs.length);
  } else {
    console.log("Seeding local mock products...");
    const items = [
      {
        name: "Vibe T-shirt",
        price: 19.99,
        image: "",
        description: "Soft cotton tee",
      },
      {
        name: "Vibe Hoodie",
        price: 39.99,
        image: "",
        description: "Cozy hoodie",
      },
      { name: "Vibe Mug", price: 9.99, image: "", description: "Ceramic mug" },
      {
        name: "Vibe Sticker Pack",
        price: 4.99,
        image: "",
        description: "Cool stickers",
      },
      {
        name: "Vibe Cap",
        price: 14.99,
        image: "",
        description: "Adjustable cap",
      },
    ];
    await Product.insertMany(items);
    console.log("Seeded", items.length);
  }
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
