/**
 * Consistent API response helpers.
 * Every response uses the shape: { success, message, data }
 */

export function sendSuccess(res, data = null, message = 'OK', status = 200) {
  return res.status(status).json({ success: true, message, data });
}

export function sendError(res, message = 'Something went wrong', status = 500, data = null) {
  return res.status(status).json({ success: false, message, data });
}

export default sendSuccess;
