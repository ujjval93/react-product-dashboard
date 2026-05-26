import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const calculateCartTotal = (cart) =>
  cart.products.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      products: [
        {
          product: productId,
          quantity,
        },
      ],
    });
  } else {
    const existingProduct = cart.products.find(
      (item) => item.product.toString() === productId,
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({
        product: productId,
        quantity,
      });
    }
  }

  cart = await cart.populate("products.product");
  cart.totalPrice = calculateCartTotal(cart);
  await cart.save();

  return res.status(200).json(new ApiResponse(200, cart, "Added to cart"));
});

const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({
    user: req.user._id,
  }).populate("products.product");

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, products: [] });
  }

  cart.totalPrice = calculateCartTotal(cart);
  await cart.save();

  return res.status(200).json(new ApiResponse(200, cart));
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate("products.product");

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const item = cart.products.find((item) => item.product._id.toString() === productId);

  if (!item) {
    throw new ApiError(404, "Product not found in cart");
  }

  if (quantity < 1) {
    cart.products = cart.products.filter((item) => item.product._id.toString() !== productId);
  } else {
    item.quantity = quantity;
  }

  cart.totalPrice = calculateCartTotal(cart);
  await cart.save();

  return res.status(200).json(new ApiResponse(200, cart, "Cart updated"));
});

const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id }).populate("products.product");

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.products = cart.products.filter((item) => item.product._id.toString() !== productId);
  cart.totalPrice = calculateCartTotal(cart);
  await cart.save();

  return res.status(200).json(new ApiResponse(200, cart, "Cart item removed"));
});

export { addToCart, getCart, updateCartItem, removeCartItem };
