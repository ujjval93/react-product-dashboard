import React, { createContext, useEffect, useMemo, useState, useCallback, useContext } from 'react';
import { nanoid } from 'nanoid';
import { productApi, cartApi, wishlistApi, userApi } from './api.js';
import { AuthContext } from '../contexts/AuthContext.jsx';

export const ProductContext = createContext();

const Context = (props) => {
  const { user: authUser } = useContext(AuthContext);

  const [products, setProducts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('products')) || []; }
    catch { return []; }
  });
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; }
    catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist')) || []; }
    catch { return []; }
  });
  const [notifications, setNotifications] = useState([]);
  const [networkError, setNetworkError] = useState(false);

  // ── Helpers ───────────────────────────────────────────────────

  const addToast = useCallback(({ title, message, type = 'success' }) => {
    const id = nanoid();
    setNotifications((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const normalizeCart = (cartData) =>
    (cartData?.products || []).map((item) => ({
      ...item?.product,
      quantity: item?.quantity || 1,
      images: item?.product?.images || [],
      image: item?.product?.images?.[0] || item?.product?.image || '',
    }));

  const normalizeWishlist = (wishlistData) => {
    return (wishlistData?.products || [])
    .filter(Boolean)
    .map((item) => ({
      ...item,
      _id: item?._id || item?.id || String(Math.random()),
      images: item?.images || [],
      image: item?.images?.[0] || item?.image || '',
    }));
   };

  const syncCart = (cartData) => setCart(normalizeCart(cartData));
  const syncWishlist = (wishlistData) => setWishlist(normalizeWishlist(wishlistData));

  // ── Auth check ────────────────────────────────────────────────

  const checkCurrentUser = async () => {
    try {
      const response = await userApi.getCurrentUser();
      const user = response?.data?.data || response?.data?.user || null;
      setCurrentUser(user);
      return user;
    } catch {
      setCurrentUser(null);
      return null;
    } finally {
      setAuthChecked(true);
    }
  };

  // ── Data fetchers ─────────────────────────────────────────────

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await productApi.list();
      const backendProducts = response?.data?.data?.products ||
                              response?.data?.products || [];
      const localProducts = (() => {
        try { return JSON.parse(localStorage.getItem('customProducts')) || []; }
        catch { return []; }
      })();
      setProducts([...backendProducts, ...localProducts]);
    } catch (error) {
      console.error('Failed to load products', error);
      addToast({
        title: 'Failed to load products',
        message: error.message || 'Please refresh the page.',
        type: 'error',
      });
      if (error?.message?.toLowerCase().includes('network')) setNetworkError(true);
    } finally {
      setLoading(false);
    }
  };

  const getCart = async () => {
    try {
      const response = await cartApi.get();
      const cartPayload = response?.data?.data ||
                          response?.data?.cart ||
                          response?.data || response;
      syncCart(cartPayload);
    } catch (error) {
      console.error('Failed to load cart', error);
      if (error?.message?.toLowerCase().includes('network')) {
        setNetworkError(true);
        addToast({ title: 'Network error', message: 'Could not reach server for cart.', type: 'error' });
      }
    }
  };

  const getWishlist = async () => {
    try {
      const response = await wishlistApi.get();
      const wishlistPayload = response?.data?.data ||
                              response?.data?.wishlist ||
                              response?.data || response;
      syncWishlist(wishlistPayload);
    } catch (error) {
      console.error('Failed to load wishlist', error);
      if (error?.message?.toLowerCase().includes('network')) {
        setNetworkError(true);
        addToast({ title: 'Network error', message: 'Could not reach server for wishlist.', type: 'error' });
      }
    }
  };

  // ── Initial fetch ─────────────────────────────────────────────

  useEffect(() => {
    const fetchInitialData = async () => {
      setNetworkError(false);
      await getProducts();
      const user = await checkCurrentUser();
      if (user) {
        await Promise.all([getCart(), getWishlist()]);
      } else {
        setCart([]);
        setWishlist([]);
      }
    };
    fetchInitialData();
  }, []);

  // ── Listen for auth events ────────────────────────────────────

  useEffect(() => {
    const handleAuthLogin = async (event) => {
      const user = event?.detail?.user;
      if (user) {
        setCurrentUser(user);
        await Promise.all([getCart(), getWishlist()]);
      }
    };

    const handleForceLogout = () => {
      setCurrentUser(null);
      setCart([]);
      setWishlist([]);
      localStorage.removeItem('cart');
      localStorage.removeItem('wishlist');
      addToast({ title: 'Session expired', message: 'Please log in again.', type: 'error' });
    };

    window.addEventListener('auth:login', handleAuthLogin);
    window.addEventListener('auth:logout', handleForceLogout);
    return () => {
      window.removeEventListener('auth:login', handleAuthLogin);
      window.removeEventListener('auth:logout', handleForceLogout);
    };
  }, [addToast]);

  // ── Sync to localStorage ──────────────────────────────────────

  useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('wishlist', JSON.stringify(wishlist)); }, [wishlist]);

  // ── Retry ─────────────────────────────────────────────────────

  const retryInitialFetch = async () => {
    setNetworkError(false);
    try {
      await getProducts();
      const user = await checkCurrentUser();
      if (user) await Promise.all([getCart(), getWishlist()]);
      addToast({ title: 'Reconnected', message: 'Data synced with server.', type: 'success' });
    } catch (err) {
      addToast({ title: 'Retry failed', message: err.message || 'Server still unreachable.', type: 'error' });
    }
  };

  // ── Cart actions ──────────────────────────────────────────────

  const addToCart = async (product, quantity = 1) => {
    if (!authUser && !currentUser) {
      addToast({ title: 'Please sign in', message: 'You must be logged in to add items to cart.', type: 'error' });
      return;
    }
    try {
      const response = await cartApi.add({ productId: product._id || product.id, quantity });
      const cartPayload = response?.data?.data ||
                          response?.data?.cart ||
                          response?.data || response;
      syncCart(cartPayload);
      addToast({ title: 'Added to cart', message: `${product.title} added to your cart.` });
    } catch (error) {
      addToast({ title: 'Failed to add to cart', message: error.message || 'Please try again.', type: 'error' });
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await cartApi.remove(productId);
      const cartPayload = response?.data?.data ||
                          response?.data?.cart ||
                          response?.data || response;
      syncCart(cartPayload);
      addToast({ title: 'Removed from cart', message: 'Item removed from your cart.', type: 'error' });
    } catch (error) {
      addToast({ title: 'Failed to remove item', message: error.message || 'Please try again.', type: 'error' });
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (quantity < 1) { await removeFromCart(productId); return; }
    try {
      const response = await cartApi.update({ productId, quantity });
      const cartPayload = response?.data?.data ||
                          response?.data?.cart ||
                          response?.data || response;
      syncCart(cartPayload);
    } catch (error) {
      addToast({ title: 'Failed to update quantity', message: error.message || 'Please try again.', type: 'error' });
    }
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

  const toggleWishlist = async (product) => {
  if (!authUser && !currentUser) {
    addToast({ title: 'Please sign in', message: 'You must be logged in to use the wishlist.', type: 'error' });
    return;
  }

  // Always re-fetch fresh wishlist first to check actual state
  try {
    const freshResponse = await wishlistApi.get();
    const freshPayload = freshResponse?.data?.data || freshResponse?.data?.wishlist || freshResponse?.data || freshResponse;
    const freshWishlist = (freshPayload?.products || []).filter(Boolean);
    
    const exists = freshWishlist.some(
      (item) => item._id === (product._id || product.id) || 
                item.id === (product._id || product.id)
    );

    if (exists) {
      await wishlistApi.remove(product._id || product.id);
      await getWishlist();
      addToast({ title: 'Removed from wishlist', message: `${product.title} removed.`, type: 'error' });
    } else {
      await wishlistApi.add({ productId: product._id || product.id });
      await getWishlist();
      addToast({ title: 'Added to wishlist', message: `${product.title} added to wishlist.` });
    }
  } catch (error) {
    addToast({ title: 'Failed to update wishlist', message: error.message || 'Please try again.', type: 'error' });
  }
};

  // ── Auth helpers ──────────────────────────────────────────────

  const onLoginSuccess = async () => {
    const user = await checkCurrentUser();
    if (user) await Promise.all([getCart(), getWishlist()]);
  };

  const onLogoutSuccess = () => {
    setCurrentUser(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
  };

  // ── Derived values ────────────────────────────────────────────

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category || 'Other')));
    return ['All', ...unique];
  }, [products]);

  const totalCartItems = useMemo(
    () => cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [cart],
  );

  const totalWishlistItems = wishlist.length;

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price || 0) * (item.quantity || 1), 0),
    [cart],
  );

  return (
    <ProductContext.Provider
      value={{
        products, setProducts, loading,
        currentUser, authChecked,
        cart, wishlist, notifications,
        addToast, addToCart, removeFromCart,
        updateCartQuantity, clearCart, addProduct,
        toggleWishlist, categories,
        totalCartItems, totalWishlistItems, cartTotal,
        networkError, retryInitialFetch,
        onLoginSuccess, onLogoutSuccess,
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};

export default Context;