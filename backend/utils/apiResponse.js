export const successResponse = (res, statusCode = 200, message = "Success", data = {}) =>
  res.status(statusCode).json({ success: true, message, data });

export const errorResponse = (res, statusCode = 500, message = "Server Error") =>
  res.status(statusCode).json({ success: false, message });

export const paginatedResponse = (res, data, total, page, limit) =>
  res.status(200).json({
    success: true,
    data,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
  });
