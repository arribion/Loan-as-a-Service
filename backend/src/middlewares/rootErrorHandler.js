// error handling middleware
const rootErrorHandler = (app) => {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  });
};

export default rootErrorHandler;
