import React, { useEffect, useState } from "react";
import Products from "./components/Products";
import Cart from "./components/Cart";
import CheckoutModal from "./components/CheckoutModal";
import { fetchProducts, getCart } from "./api";

export default function App() {
  const [products, setProducts] = useState([]);
  const [cartState, setCartState] = useState({ cart: { items: [] }, total: 0 });
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
      alert("Failed to load products. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  }

  async function loadCart() {
    try {
      const data = await getCart();
      setCartState(data);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vibe Commerce — Mock Cart</h1>
        <div>
          <button
            className="px-3 py-1 border rounded"
            onClick={() => setShowCheckout(true)}
          >
            Checkout ({cartState.cart.items.reduce((s, i) => s + i.qty, 0)})
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 grid md:grid-cols-3 gap-6">
        <section className="md:col-span-2">
          <Products products={products} loading={loading} onAdded={loadCart} />
        </section>
        <aside>
          <Cart
            cartState={cartState}
            setCartState={setCartState}
            refreshCart={loadCart}
            onCheckout={() => setShowCheckout(true)}
          />
        </aside>
      </main>

      <CheckoutModal
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={() => {
          setShowCheckout(false);
          loadCart();
        }}
      />
    </div>
  );
}
