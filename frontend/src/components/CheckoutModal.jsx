import React, { useState } from "react";
import { checkout } from "../api";

export default function CheckoutModal({ open, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await checkout({ name, email });
      setReceipt(res.receipt);
      setName("");
      setEmail("");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded max-w-lg w-full p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Checkout</h3>
          <button onClick={onClose} className="text-gray-500">
            Close
          </button>
        </div>

        {!receipt ? (
          <form onSubmit={handleSubmit} className="mt-4">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full p-2 border rounded mb-3"
            />
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="w-full p-2 border rounded mb-3"
            />
            <button
              disabled={loading}
              type="submit"
              className="w-full p-2 bg-indigo-600 text-white rounded"
            >
              {loading ? "Processing..." : "Place order"}
            </button>
          </form>
        ) : (
          <div className="mt-4">
            <h4 className="font-medium">Receipt</h4>
            <div className="text-sm text-gray-600">ID: {receipt.id}</div>
            <div className="mt-2">Name: {receipt.name}</div>
            <div>Email: {receipt.email}</div>
            <div className="mt-2">Total: ${receipt.total.toFixed(2)}</div>
            <div className="mt-2 text-sm text-gray-500">
              Timestamp: {receipt.timestamp}
            </div>
            <div className="mt-3">
              <button
                onClick={() => {
                  setReceipt(null);
                  onClose();
                }}
                className="px-3 py-2 bg-green-600 text-white rounded"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
