function enableCors(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // * means we allow all domains to have access to our api
  // if we want this api to be used only from us then we can specify that instead of * all

  res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,DELETE,OPTIONS");
  // OPTIONS is not a request that we will send by ourselves, but it is automaticly send request by the browser
  // when we use ajax request

  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
}

module.exports = enableCors;
