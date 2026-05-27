import { Router } from "express";

import { createCoupon, applyCoupon } from "../controllers/coupon.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/").post(
  verifyJWT,

  verifyAdmin,

  createCoupon,
);

router.route("/apply").post(
  verifyJWT,

  applyCoupon,
);

export default router;
