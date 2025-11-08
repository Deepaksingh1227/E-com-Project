import React from "react";
import { addToCart } from "../api";

export default function Products({ products, loading, onAdded }) {
  async function handleAdd(id) {
    try {
      await addToCart(id, 1);
      onAdded();
    } catch (e) {
      console.error(e);
      alert("Failed to add to cart");
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      {loading ? <div>Loading...</div> : null}
      <div className="grid sm:grid-cols-2 gap-4">
        {products.map((p) => (
          <div
            key={p._id}
            className="p-4 bg-white rounded shadow-sm flex flex-col"
          >
            <div className="h-40 bg-gray-100 flex items-center justify-center rounded">
              {p.image ? (
                <img src={p.image} alt={p.name} className="max-h-36" />
              ) : (
                <span className="text-sm">{p.name}</span>
              )}
            </div>
            <div className="mt-3 flex-1">
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-sm text-gray-500">{p.description}</p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-lg font-bold">${p.price.toFixed(2)}</div>
              <button
                onClick={() => handleAdd(p._id)}
                className="px-3 py-1 bg-indigo-600 text-white rounded"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
