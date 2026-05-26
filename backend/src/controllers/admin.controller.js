import { User } from "../models/user.model.js";

import { Product } from "../models/product.model.js";

import { Order } from "../models/order.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";

const getDashboard = asyncHandler(async (req, res) => {
  const users = await User.countDocuments();

  const products = await Product.countDocuments();

  const orders = await Order.countDocuments();

  return res.status(200).json(
    new ApiResponse(
      200,

      {
        users,
        products,
        orders,
      },

      "Dashboard fetched",
    ),
  );
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user");

  return res.status(200).json(new ApiResponse(200, orders));
});

export { getDashboard, getAllOrders };
