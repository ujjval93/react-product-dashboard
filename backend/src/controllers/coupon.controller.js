import { Coupon } from "../models/coupon.model.js";
import { Cart } from "../models/cart.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createCoupon = asyncHandler(async (req, res) => {
  const { code, discount, expiryDate } = req.body;

  if (!code || discount === undefined || !expiryDate) {
    throw new ApiError(400, "Coupon code, discount and expiry date are required");
  }

  const exists = await Coupon.findOne({ code: code.toUpperCase() });

  if (exists) {
    throw new ApiError(400, "Coupon already exists");
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discount,
    expiryDate,
  });

  return res.status(201).json(new ApiResponse(201, coupon, "Coupon created"));
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    throw new ApiError(400, "Coupon code is required");
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  if (new Date() > coupon.expiryDate) {
    throw new ApiError(400, "Coupon expired");
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate("products.product");

  if (!cart || !cart.products.length) {
    throw new ApiError(404, "Cart not found");
  }

  const originalPrice = cart.products.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const discountValue = (originalPrice * coupon.discount) / 100;
  const finalPrice = originalPrice - discountValue;

  return res.status(200).json(
    new ApiResponse(200, {
      originalPrice,
      discount: discountValue,
      finalPrice,
      coupon: coupon.code,
    }, "Coupon applied"),
  );
});

export { createCoupon, applyCoupon };
