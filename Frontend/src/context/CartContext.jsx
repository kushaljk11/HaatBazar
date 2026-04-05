import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../utils/axios";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(true);

  const syncFromResponse = (payload) => {
    setItems(payload?.items || []);
    return payload;
  };

  const fetchCart = async () => {
    try {
      setIsCartLoading(true);
      const { data } = await api.get("/buyer/cart");
      setItems(data.items || []);
      return data;
    } finally {
      setIsCartLoading(false);
    }
  };

  useEffect(() => {
    fetchCart().catch(() => {
      setItems([]);
      setIsCartLoading(false);
    });
  }, []);

  const addItem = async (itemOrId, quantity = 1) => {
    const productId = typeof itemOrId === "string" ? itemOrId : itemOrId?.id;
    if (!productId) throw new Error("Product id is required to add to cart");

    const { data } = await api.post("/buyer/cart", { productId, quantity });
    syncFromResponse(data);
    return data;
  };

  const updateQuantity = async (id, delta) => {
    const existing = items.find((item) => item.id === id);
    if (!existing) return null;

    const nextQty = Math.max(1, existing.quantity + delta);
    const { data } = await api.patch(`/buyer/cart/${id}`, { quantity: nextQty });
    syncFromResponse(data);
    return data;
  };

  const removeItem = async (id) => {
    const { data } = await api.delete(`/buyer/cart/${id}`);
    syncFromResponse(data);
    return data;
  };

  const clearCart = async () => {
    const { data } = await api.delete("/buyer/cart");
    syncFromResponse(data);
    return data;
  };

  const value = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      subtotal,
      itemCount,
      isCartLoading,
      fetchCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [items, isCartLoading]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
