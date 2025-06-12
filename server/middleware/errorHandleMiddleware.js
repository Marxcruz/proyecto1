const errorHandleMiddleware = (errorFunction) => (req, res, next) => {
  Promise.resolve(errorFunction(req, res, next)).catch(next);
};

export const errorHandle = errorHandleMiddleware; // named export opcional
export { errorHandleMiddleware };
export default errorHandleMiddleware;
