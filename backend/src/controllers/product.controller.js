import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, stock = 0, brand, category, image, images } = req.body;

  if (!title || !description || !price || !category) {
    throw new ApiError(400, "Required fields missing");
  }

  const product = await Product.create({
    title,
    description,
    price,
    stock,
    brand,
    category,
    seller: req.user._id,
    images: Array.isArray(images) ? images : image ? [image] : [],
  });

  return res.status(201).json(new ApiResponse(201, product, "Product created"));
});

const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const category = req.query.category
    ? {
        category: req.query.category,
      }
    : {};

  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : 999999;

  const filters = {
    ...keyword,
    ...category,
    price: {
      $gte: minPrice,
      $lte: maxPrice,
    },
  };

  const products = await Product.find(filters)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalProducts = await Product.countDocuments(filters);

  return res.status(200).json(
    new ApiResponse(200, {
      products,
      page,
      pages: Math.ceil(totalProducts / limit),
      totalProducts,
    }, "Products fetched"),
  );
});

const getSellerProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, products, "Seller products fetched"));
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res.status(200).json(new ApiResponse(200, product));
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.seller?.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You do not have permission to update this product");
  }

  const { title, description, price, stock, brand, category, image, images } = req.body;

  if (title) product.title = title;
  if (description) product.description = description;
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;
  if (brand !== undefined) product.brand = brand;
  if (category !== undefined) product.category = category;
  if (image) product.images = [image];
  if (Array.isArray(images)) product.images = images;

  await product.save();

  return res.status(200).json(new ApiResponse(200, product, "Product updated"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.seller?.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You do not have permission to delete this product");
  }

  await product.deleteOne();

  return res.status(200).json(new ApiResponse(200, {}, "Product deleted"));
});

export {
  createProduct,
  getProducts,
  getSellerProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
