require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const productsRoute = require("./routes/products");
const cartRoute = require("./routes/cart");
const checkoutRoute = require("./routes/checkout");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI;

// ✅ Connect first, then start server
connectDB(MONGO)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    app.use("/api/products", productsRoute);
    app.use("/api/cart", cartRoute);
    app.use("/api/checkout", checkoutRoute);

    app.get("/", (req, res) =>
      res.json({ ok: true, env: process.env.NODE_ENV || "dev" })
    );

    // global error handler
    app.use((err, req, res, next) => {
      console.error("Unhandled error", err);
      res.status(500).json({ error: "Server error" });
    });

    app.listen(PORT,"0.0.0.0" () => console.log(` Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
