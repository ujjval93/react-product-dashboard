import { Wishlist } from "../models/wishlist.model.js";

import { Product } from "../models/product.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;
};

const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  if (!isValidObjectId(productId)) {
    throw new ApiError(400, "Invalid product ID format");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let wishlist = await Wishlist.findOne({
    user: req.user._id,
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,

      products: [productId],
    });
  } else {
    const exists = wishlist.products.some(
      (item) => item.toString() === productId,
    );

    if (exists) {
      throw new ApiError(
        400,

        "Already in wishlist",
      );
    }

    wishlist.products.push(productId);

    await wishlist.save();
  }

  return res.status(200).json(
    new ApiResponse(
      200,

      wishlist,

      "Added to wishlist",
    ),
  );
});

const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({
    user: req.user._id,
  }).populate("products");

  // If no wishlist exists, create an empty one for the user
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      wishlist,
      "Wishlist fetched"
    ),
  );
});

const removeWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!isValidObjectId(productId)) {
    throw new ApiError(400, "Invalid product ID format");
  }

  let wishlist = await Wishlist.findOne({
    user: req.user._id,
  });

  if (!wishlist) {
    throw new ApiError(404, "Wishlist not found");
  }

  wishlist.products = wishlist.products.filter(
    (item) => item.toString() !== productId,
  );

  await wishlist.save();

  return res.status(200).json(
    new ApiResponse(
      200,

      wishlist,

      "Removed from wishlist",
    ),
  );
});

export { addToWishlist, getWishlist, removeWishlist };
