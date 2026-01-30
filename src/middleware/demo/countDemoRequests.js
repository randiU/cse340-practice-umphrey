let demoPageRequestCount = 0;

const countDemoRequests = (req, res, next) => {
  demoPageRequestCount++;
  res.locals.demoRequestCount = demoPageRequestCount;
  next();
};

export { countDemoRequests };