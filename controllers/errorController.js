exports.generateError = (req, res, next) => {
    // Simulate an intentional error
    try {
      throw new Error("This is a test error triggered by /generate-error");
    } catch (error) {
      next(error); // Pass the error to the middleware
    }
  };
   