export const validate = (schema) => {
  return (req, res, next) => {
    const dataToValidate = {
      body: req.body,
      params: req.params,
      query: req.query,
    };

    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      return res.status(422).json({
        success: false,
        errors: result.error.errors,
      });
    }
    if (result.data.body) req.body = result.data.body;
    if (result.data.params) req.params = result.data.params;
    if (result.data.query) req.query = result.data.query;
    next();
  };
};
