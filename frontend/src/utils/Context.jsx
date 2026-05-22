import React, { createContext, useEffect, useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import Axios from './axios';

export const ProductContext = createContext();

const Context = (props) => {
  const [products, setProducts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('products')) || []; }
    catch { return []; }
  });
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; }
    catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist')) || []; }
    catch { return []; }
  });
  const [notifications, setNotifications] = useState([]);

  const getProducts = async () => {
    setLoading(true);
    try {
      const { data } = await Axios('/products');
      // Merge API products with locally created products
      const localProducts = (() => {
        try { return JSON.parse(localStorage.getItem('customProducts')) || []; }
        catch { return []; }
      })();
      const mergedProducts = [...(data || []), ...localProducts];
      setProducts(mergedProducts);
    } catch (error) {
      console.error('Failed to load products', error);
      addToast({ title: 'Failed to load products', message: 'Please refresh the page.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getProducts(); }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToast = ({ title, message, type = 'success' }) => {
    const id = nanoid();
    setNotifications((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // ── Cart actions ──────────────────────────────────────────────
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [...prev, { ...product, quantity }];
    });
    addToast({ title: 'Added to cart', message: `${product.title} added to your cart.` });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    addToast({ title: 'Removed from cart', message: 'Item removed from your cart.', type: 'error' });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity < 1) { removeFromCart(productId); return; }
    setCart((prev) =>
      prev.map((item) => item.id === productId ? { ...item, quantity } : item),
    );
  };

  const clearCart = () => {
    setCart([]);
    addToast({ title: 'Cart cleared', message: 'All items removed from cart.', type: 'error' });
  };

  // ── Product actions ───────────────────────────────────────────
  const addProduct = (product) => {
    setProducts((prev) => [...prev, product]);
    try {
      const customProducts = JSON.parse(localStorage.getItem('customProducts')) || [];
      localStorage.setItem('customProducts', JSON.stringify([...customProducts, product]));
    } catch (error) {
      console.error('Failed to save product to localStorage', error);
    }
  };

  // ── Wishlist actions ──────────────────────────────────────────
  const toggleWishlist = (product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      addToast({ title: 'Removed from wishlist', message: `${product.title} removed.`, type: 'error' });
    } else {
      setWishlist((prev) => [...prev, product]);
      addToast({ title: 'Added to wishlist', message: `${product.title} added to wishlist.` });
    }
  };

  // ── Derived values ────────────────────────────────────────────
  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category || 'Other')));
    return ['All', ...unique];
  }, [products]);

  const totalCartItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const totalWishlistItems = wishlist.length;

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    [cart],
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        loading,
        cart,
        wishlist,
        notifications,
        addToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addProduct,
        toggleWishlist,
        categories,
        totalCartItems,
        totalWishlistItems,
        cartTotal,
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};

export default Context;