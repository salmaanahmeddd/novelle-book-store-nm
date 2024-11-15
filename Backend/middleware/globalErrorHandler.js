
module.exports.globalErrorHandler = (
  err,
  _req,
  _res,
  _next
) => {

  console.log("GLOBAL_ERROR:", err);

  res.status(500).json({
    data:null,
    error: Error,
    message: "OOPS! Somthing went wrong!"
  });
};