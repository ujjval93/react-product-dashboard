import { Router } from "express";

import {
  addToWishlist,
  getWishlist,
  removeWishlist,
} from "../controllers/wishlist.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, addToWishlist).get(verifyJWT, getWishlist);

router.route("/:productId").delete(verifyJWT, removeWishlist);

export default router;
