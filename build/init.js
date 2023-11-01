"use strict";

require("regenerator-runtime");
require("dotenv/config");
require("./db");
require("./models/Video");
require("./models/User");
require("./models/Comment");
var _server = _interopRequireDefault(require("./server"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var PORT = 4523;
var handleListening = function handleListening() {
  return console.log("✅ Server listening on port 4523! ✅");
};
_server["default"].listen(PORT, handleListening);