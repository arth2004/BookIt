class AuthError extends Error {
    constructor(message) {
      super(message); // Call the parent class constructor with the message
      this.name = "AuthError"; // Set the error name to 'AuthError'
      this.statusCode = 401; // Set a default status code for authentication errors
    }
  }
  
  module.exports = { AuthError };
  