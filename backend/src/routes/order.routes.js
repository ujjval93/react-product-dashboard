import { Router } from "express";

import { placeOrder, getMyOrders } from "../controllers/order.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, placeOrder).get(verifyJWT, getMyOrders);

export default router;
