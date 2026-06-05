import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ShoppingCart, Heart, Moon, Sun, Search } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { ProductContext } from "../utils/Context";
import { AuthContext } from "../contexts/AuthContext.jsx";

/*
  Font: add to index.html <head>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
*/

const navItems = [
  { label: "Products", to: "/" },
  { label: "Create", to: "/create" },
  { label: "Contact", to: "#contact" },
];

const GOLD = "#B07D4A";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { darkMode, toggleTheme } = useDarkMode();
  const { totalCartItems, totalWishlistItems } = useContext(ProductContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg = darkMode
    ? scrolled
      ? "bg-neutral-950/95 border-neutral-800"
      : "bg-neutral-950 border-neutral-900"
    : scrolled
      ? "bg-white/95 border-neutral-200 shadow-sm"
      : "bg-white border-transparent";

  return (
    <>
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
        }}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${navBg}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8 lg:px-10">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-3 select-none"
            style={{ textDecoration: "none" }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-sm text-white text-sm font-semibold tracking-wider"
              style={{
                background: GOLD,
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              P
            </div>
            <span
              className={`text-xl tracking-tight select-none ${darkMode ? "text-white" : "text-neutral-900"}`}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              Prestige
            </span>
          </NavLink>

          {/* Desktop nav links */}
          <div className="hidden xl:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                style={({ isActive }) => ({
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  color: isActive ? GOLD : darkMode ? "#a3a3a3" : "#525252",
                  borderBottom: isActive
                    ? `1px solid ${GOLD}`
                    : "1px solid transparent",
                  paddingBottom: 2,
                  textDecoration: "none",
                  transition: "color 0.2s, border-color 0.2s",
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Search bar — desktop */}
          <div className="hidden lg:flex flex-1 max-w-xs mx-8">
            <div
              className={`flex w-full items-center gap-2 rounded-sm border px-3.5 py-2 transition-colors ${
                darkMode
                  ? "border-neutral-800 bg-neutral-900"
                  : "border-neutral-200 bg-neutral-50"
              }`}
            >
              <Search
                size={14}
                className={darkMode ? "text-neutral-500" : "text-neutral-400"}
              />
              <span
                className={`text-xs ${darkMode ? "text-neutral-500" : "text-neutral-400"}`}
              >
                Search products…
              </span>
            </div>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-1.5">
            {/* Theme toggle */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={toggleTheme}
              className={`flex h-9 w-9 items-center justify-center rounded-sm border transition-colors ${
                darkMode
                  ? "border-neutral-800 bg-transparent text-neutral-400 hover:text-amber-400 hover:border-neutral-700"
                  : "border-neutral-200 bg-transparent text-neutral-500 hover:text-neutral-800"
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </motion.button>

            {user ? (
              <div className="hidden xl:flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => navigate("/profile")}
                  className={`inline-flex h-9 items-center rounded-sm px-4 text-sm font-semibold transition-colors ${
                    darkMode
                      ? "border border-neutral-800 bg-transparent text-neutral-300 hover:bg-neutral-900"
                      : "border border-neutral-200 bg-transparent text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {user?.fullName?.split(" ")[0] || user?.username || "Profile"}
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => navigate("/login")}
                className={`hidden xl:inline-flex h-9 items-center rounded-sm px-4 text-sm font-semibold transition-colors ${
                  darkMode
                    ? "border border-neutral-800 bg-transparent text-neutral-300 hover:bg-neutral-900"
                    : "border border-neutral-200 bg-transparent text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                Login
              </motion.button>
            )}

            {/* Wishlist */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate("/wishlist")}
              className={`relative flex h-9 w-9 items-center justify-center rounded-sm border transition-colors ${
                darkMode
                  ? "border-neutral-800 bg-transparent text-neutral-400 hover:text-rose-400 hover:border-neutral-700"
                  : "border-neutral-200 bg-transparent text-neutral-500 hover:text-rose-500"
              }`}
              aria-label="Wishlist"
            >
              <Heart size={17} />
              {totalWishlistItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-semibold text-white">
                  {totalWishlistItems}
                </span>
              )}
            </motion.button>

            {/* Cart */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate("/cart")}
              className="relative flex h-9 items-center gap-2 rounded-sm px-3.5 text-white text-xs font-medium transition-all"
              style={{ background: GOLD, border: "none" }}
              aria-label="Cart"
            >
              <ShoppingCart size={15} />
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  letterSpacing: "0.03em",
                }}
              >
                Cart
              </span>
              {totalCartItems > 0 && (
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold"
                  style={{ color: GOLD }}
                >
                  {totalCartItems}
                </span>
              )}
            </motion.button>

            {/* Mobile hamburger */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsOpen(!isOpen)}
              className={`flex h-9 w-9 items-center justify-center rounded-sm border transition-colors xl:hidden ${
                darkMode
                  ? "border-neutral-800 text-neutral-300"
                  : "border-neutral-200 text-neutral-600"
              }`}
              aria-label="Menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 xl:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={`fixed left-0 top-0 z-50 h-full w-72 border-r flex flex-col xl:hidden ${
                darkMode
                  ? "bg-neutral-950 border-neutral-800"
                  : "bg-white border-neutral-200"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer header */}
              <div
                className={`flex items-center justify-between px-6 py-5 border-b ${darkMode ? "border-neutral-800" : "border-neutral-100"}`}
              >
                <span
                  className={`text-lg tracking-tight ${darkMode ? "text-white" : "text-neutral-900"}`}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 500,
                  }}
                >
                  Prestige
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`flex h-8 w-8 items-center justify-center rounded-sm ${darkMode ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-neutral-900"}`}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col gap-0.5 px-4 py-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    style={({ isActive }) => ({
                      display: "block",
                      padding: "10px 12px",
                      fontSize: 14,
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? GOLD : darkMode ? "#d4d4d4" : "#404040",
                      background: isActive
                        ? darkMode
                          ? "rgba(176,125,74,0.08)"
                          : "rgba(176,125,74,0.06)"
                        : "transparent",
                      borderRadius: 2,
                      textDecoration: "none",
                      letterSpacing: "0.02em",
                    })}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              {/* Bottom actions */}
              <div
                className={`mt-auto border-t px-4 py-4 flex flex-col gap-2 ${darkMode ? "border-neutral-800" : "border-neutral-100"}`}
              >
                <button
                  onClick={() => {
                    navigate("/wishlist");
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-sm text-sm text-left transition-colors ${
                    darkMode
                      ? "text-neutral-300 hover:bg-neutral-900"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <Heart size={16} />
                  Wishlist{" "}
                  {totalWishlistItems > 0 && (
                    <span className="ml-auto text-rose-500 text-xs font-semibold">
                      {totalWishlistItems}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    navigate("/cart");
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-sm text-sm text-left text-white transition-colors"
                  style={{ background: GOLD }}
                >
                  <ShoppingCart size={16} />
                  Cart{" "}
                  {totalCartItems > 0 && (
                    <span className="ml-auto font-semibold">
                      {totalCartItems}
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
