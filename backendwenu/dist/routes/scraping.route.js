"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scraping_controller_1 = require("../controllers/scraping.controller");
// import { isAuthenticated } from "../middlewares/auth/authenticated";
// import { isAuthorized } from "../middlewares/auth/authorized";
const router = express_1.Router();
router.get('/scraping/:instagramid', 
// isAuthenticated,
// isAuthorized({ hasRole: ['admin'] }),
scraping_controller_1.get);
exports.default = router;
//# sourceMappingURL=scraping.route.js.map