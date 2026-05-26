import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { ApiError } from "../utils/ApiError.js";

const placeOrder = asyncHandler(async (req, res) => {
  const {
    shippingAddress,

    paymentMethod,
  } = req.body;

  const cart = await Cart.findOne({
    user: req.user._id,
  }).populate("products.product");

  if (!cart || cart.products.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  let totalPrice = 0;

  cart.products.forEach((item) => {
    totalPrice += item.product.price * item.quantity;
  });

  const orderItems = cart.products.map((item) => ({
    product: item.product._id,

    quantity: item.quantity,

    price: item.product.price,
  }));

  const order = await Order.create({
    user: req.user._id,

    orderItems,

    shippingAddress,

    paymentMethod,

    totalPrice,
  });

  await Cart.findOneAndUpdate(
    {
      user: req.user._id,
    },

    {
      products: [],
    },
  );

  return res.status(201).json(
    new ApiResponse(
      201,

      order,

      "Order placed successfully",
    ),
  );
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
  }).populate("orderItems.product");

  return res.status(200).json(
    new ApiResponse(
      200,

      orders,

      "My orders",
    ),
  );
});

export { placeOrder, getMyOrders };
