import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
import adminRouter from "./routes/admin.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import couponRouter from "./routes/coupon.routes.js";

const app = express();

// Support multiple origins (comma-separated in CORS_ORIGIN) and echo allowed origin
const rawOrigins = process.env.CORS_ORIGIN || 'http://localhost:5173';
const allowedOrigins = rawOrigins.split(',').map((s) => s.trim()).filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      console.log('CORS check origin:', origin);
      // allow requests with no origin (like curl, mobile apps)
      if (!origin) return callback(null, true);
      // allow configured origins
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // allow any localhost origin during development (different Vite ports)
      if (origin.startsWith('http://localhost')) return callback(null, true);
      // disallow other origins (no CORS header will be set)
      console.log('CORS blocked origin:', origin);
      return callback(null, false);
    },
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "16kb",
    verify: (req, res, buf) => {
      try {
        req.rawBody = buf && buf.toString ? buf.toString() : '';
      } catch (e) {
        req.rawBody = '';
      }
    },
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  }),
);

app.use(cookieParser());

// simple request logger for debugging
app.use((req, res, next) => {
  console.log('REQ', req.method, req.originalUrl, 'rawBody:', req.rawBody ? req.rawBody.slice(0,200) : '');
  next();
});

// Routes

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/coupons", couponRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  // log full error for debugging
  console.error(err && err.stack ? err.stack : err);
  res.status(statusCode).json({
    success: false,
    message: err.message || "Server error",
    errors: err.errors || [],
  });
});

export default app;
