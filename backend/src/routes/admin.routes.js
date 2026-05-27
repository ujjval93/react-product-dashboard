import { Router } from "express";

import { getDashboard, getAllOrders } from "../controllers/admin.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/dashboard").get(
  verifyJWT,

  verifyAdmin,

  getDashboard,
);

router.route("/orders").get(
  verifyJWT,

  verifyAdmin,

  getAllOrders,
);

export default router;
