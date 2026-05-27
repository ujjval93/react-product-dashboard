import { Router } from "express";

import {
  createProduct,
  getProducts,
  getSellerProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyRoles } from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, verifyRoles("seller", "admin"), createProduct).get(getProducts);
router.route("/seller").get(verifyJWT, getSellerProducts);

router
  .route("/:id")
  .get(getProductById)
  .patch(verifyJWT, verifyRoles("seller", "admin"), updateProduct)
  .delete(verifyJWT, verifyRoles("seller", "admin"), deleteProduct);

export default router;
