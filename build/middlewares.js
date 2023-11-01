"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.videoUpload = exports.publicOnlyMiddleware = exports.protectorMiddleware = exports.localsMiddleware = exports.avatarUpload = void 0;
var _multer = _interopRequireDefault(require("multer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var localsMiddleware = exports.localsMiddleware = function localsMiddleware(req, res, next) {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  next();
};
var protectorMiddleware = exports.protectorMiddleware = function protectorMiddleware(req, res, next) {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Log in first.");
    return res.redirect("/login");
  }
};
var publicOnlyMiddleware = exports.publicOnlyMiddleware = function publicOnlyMiddleware(req, res, next) {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};
var avatarUpload = exports.avatarUpload = (0, _multer["default"])({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000
  }
});
var videoUpload = exports.videoUpload = (0, _multer["default"])({
  dest: "uploads/videos/",
  limits: {
    fileSize: 500000000
  }
});