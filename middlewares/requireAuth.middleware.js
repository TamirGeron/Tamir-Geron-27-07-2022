const authService = require("../api/auth/auth.service");

async function requireAuth(req, res, next) {
  if (!req?.headers?.cookie) return res.status(401).send("Not Authenticated");
  let cookieHeader = req.headers.cookie;
  cookieHeader = cookieHeader.substring(cookieHeader.indexOf("=") + 1);
  const loggedinUser = authService.validateToken(cookieHeader);
  if (!loggedinUser) return res.status(401).send("Not Authenticated");
  next();
}

async function requireAdmin(req, res, next) {
  if (!req?.headers?.cookie) return res.status(401).send("Not Authenticated");
  let cookieHeader = req.headers.cookie;
  cookieHeader = cookieHeader.substring(cookieHeader.indexOf("=") + 1);
  const loggedinUser = authService.validateToken(cookieHeader);
  if (!loggedinUser.isAdmin) {
    res.status(403).end("Not Authorized");
    return;
  }
  next();
}

// module.exports = requireAuth

module.exports = {
  requireAuth,
  requireAdmin,
};
