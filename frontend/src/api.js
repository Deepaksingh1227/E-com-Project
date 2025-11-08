import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function fetchProducts() {
  return axios.get(`${BASE}/api/products`).then((r) => r.data);
}

export async function addToCart(productId, qty = 1) {
  return axios.post(`${BASE}/api/cart`, { productId, qty }).then((r) => r.data);
}

export async function getCart() {
  return axios.get(`${BASE}/api/cart`).then((r) => r.data);
}

export async function removeFromCart(productId) {
  return axios.delete(`${BASE}/api/cart/${productId}`).then((r) => r.data);
}

export async function updateCartItem(productId, qty) {
  return axios
    .patch(`${BASE}/api/cart/update`, { productId, qty })
    .then((r) => r.data);
}

export async function checkout(payload) {
  return axios.post(`${BASE}/api/checkout`, payload).then((r) => r.data);
}
