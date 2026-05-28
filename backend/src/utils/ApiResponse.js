class ApiResponse {
  constructor(statusCode = 200, data = null, message = "", success = true, errors = []) {
    this.statusCode = statusCode;
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }
}

export { ApiResponse };
