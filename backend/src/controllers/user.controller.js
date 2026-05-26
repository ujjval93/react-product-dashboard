import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId).select("+refreshToken");
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = async (req, res) => {
  console.log('DEBUG registerUser body:', req.body);
  try {
    const { fullName, email, username, password, role = "user" } = req.body;

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
      return res.status(400).json({ success: false, message: "All fields are required", errors: [] });
    }

    const normalizedEmail = email.toLowerCase();
    const normalizedUsername = username.toLowerCase();

    if (!["user", "seller"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role", errors: [] });
    }

    const existedUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existedUser) {
      return res.status(409).json({ success: false, message: "User already exists", errors: [] });
    }

    const user = await User.create({
      fullName,
      email: normalizedEmail,
      username: normalizedUsername,
      password,
      role,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
      return res.status(500).json({ success: false, message: "User registration failed", errors: [] });
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
  } catch (err) {
    console.error('registerUser error:', err && err.stack ? err.stack : err);
    return res.status(err?.statusCode || 500).json({ success: false, message: err?.message || 'Server error', errors: err?.errors || [] });
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  const loginKey = (username || email || "").trim().toLowerCase();

  if (!loginKey) {
    throw new ApiError(400, "Email or username required");
  }

  const user = await User.findOne({
    $or: [{ email: loginKey }, { username: loginKey }],
  }).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions())
    .cookie("refreshToken", refreshToken, cookieOptions())
    .json(
      new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions())
    .clearCookie("refreshToken", cookieOptions())
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (error) {
    // JWT errors (expired, malformed) → 401, not 500
    throw new ApiError(401, "Refresh token expired or invalid");
  }

  const user = await User.findById(decodedToken?._id).select("+refreshToken");

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or already used");
  }

  const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions())
    .cookie("refreshToken", newRefreshToken, cookieOptions())
    .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required");
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!(await user.isPasswordCorrect(currentPassword))) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json(new ApiResponse(200, {}, "Password updated successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email, username, avatar, phone } = req.body;
  const updates = {};

  if (fullName) updates.fullName = fullName;
  if (email) updates.email = email.toLowerCase();
  if (username) updates.username = username.toLowerCase();
  if (avatar) updates.avatar = avatar;
  if (phone) updates.phone = phone;

  if (updates.email || updates.username) {
    const existing = await User.findOne({
      $or: [
        updates.email ? { email: updates.email } : null,
        updates.username ? { username: updates.username } : null,
      ].filter(Boolean),
      _id: { $ne: req.user._id },
    });
    if (existing) {
      throw new ApiError(409, "Email or username already in use");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, updatedUser, "Account updated successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  changeCurrentPassword,
  updateAccountDetails,
};