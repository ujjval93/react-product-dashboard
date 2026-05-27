import { Router } from "express";

import { addToCart, getCart, updateCartItem, removeCartItem } from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, addToCart).get(verifyJWT, getCart).patch(verifyJWT, updateCartItem);
router.route("/:productId").delete(verifyJWT, removeCartItem);

export default router;
