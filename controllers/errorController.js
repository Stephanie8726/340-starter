exports.generateError = (req, res, next) => {
    try {
      throw new Error("This is a test error triggered by /generate-error");
    } catch (error) {
      next(error);
    }
  };
   