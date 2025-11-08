import React from "react";
import { removeFromCart, updateCartItem } from "../api";

export default function Cart({
  cartState,
  setCartState,
  refreshCart,
  onCheckout,
}) {
  const { cart, total } = cartState;

  async function handleRemove(productId) {
    if (!confirm("Remove item?")) return;
    try {
      const res = await removeFromCart(productId);
      setCartState(res);
    } catch (e) {
      console.error(e);
      alert("Failed to remove item");
    }
  }

  async function changeQty(productId, qty) {
    if (qty < 1) return;
    try {
      const res = await updateCartItem(productId, qty);
      setCartState(res);
    } catch (e) {
      console.error(e);
      alert("Failed to update");
    }
  }

  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <h2 className="text-lg font-semibold">Cart</h2>
      <div className="mt-3">
        {cart.items.length === 0 && (
          <div className="text-sm text-gray-500">Cart is empty</div>
        )}
        {cart.items.map((it) => (
          <div
            key={it.product._id}
            className="flex items-center justify-between py-2 border-b"
          >
            <div>
              <div className="font-medium">{it.product.name}</div>
              <div className="text-sm text-gray-500">
                ${it.product.price.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeQty(it.product._id, it.qty - 1)}
                className="px-2 py-1 border rounded"
              >
                -
              </button>
              <div className="w-8 text-center">{it.qty}</div>
              <button
                onClick={() => changeQty(it.product._id, it.qty + 1)}
                className="px-2 py-1 border rounded"
              >
                +
              </button>
              <button
                onClick={() => handleRemove(it.product._id)}
                className="ml-2 text-sm text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Total</div>
          <div className="text-lg font-bold">
            ${total?.toFixed(2) || "0.00"}
          </div>
        </div>
        <div className="mt-3">
          <button
            onClick={onCheckout}
            className="w-full px-4 py-2 bg-green-600 text-white rounded"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
