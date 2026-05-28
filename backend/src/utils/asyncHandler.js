export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      // guard against cases where `next` is missing or not a function
      if (typeof next === 'function') {
        return next(error);
      }
      // fallback: log the error and send a 500 response
      console.error('asyncHandler caught error but `next` is not a function:', error && error.stack ? error.stack : error);
      try {
        res.status(error?.statusCode || 500).json({ success: false, message: error?.message || 'Server error', errors: error?.errors || [] });
      } catch (sendErr) {
        console.error('Failed to send error response from asyncHandler fallback:', sendErr);
      }
    }
  };
};
