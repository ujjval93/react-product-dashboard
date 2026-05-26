import { Wishlist } from "../models/wishlist.model.js";

import { Product } from "../models/product.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { ApiError } from "../utils/ApiError.js";

const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

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
  const wishlist = await Wishlist.findOne({
    user: req.user._id,
  }).populate("products");

  return res.status(200).json(
    new ApiResponse(
      200,

      wishlist,
    ),
  );
});

const removeWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({
    user: req.user._id,
  });

  wishlist.products = wishlist.products.filter(
    (item) => item.toString() !== productId,
  );

  await wishlist.save();

  return res.status(200).json(
    new ApiResponse(
      200,

      wishlist,

      "Removed",
    ),
  );
});

export { addToWishlist, getWishlist, removeWishlist };
