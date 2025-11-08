const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // mock user
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      qty: { type: Number, default: 1 },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

CartSchema.methods.getTotal = async function () {
  await this.populate("items.product").execPopulate?.(); // for older mongoose; safe call
  await this.populate("items.product");
  return this.items.reduce((sum, it) => sum + it.product.price * it.qty, 0);
};

module.exports = mongoose.model("Cart", CartSchema);
