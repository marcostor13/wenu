"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const menus_controller_1 = require("../controllers/menus.controller");
const authenticated_1 = require("../middlewares/auth/authenticated");
const authorized_1 = require("../middlewares/auth/authorized");
const router = express_1.Router();
router.post('/menus', authenticated_1.isAuthenticated, authorized_1.isAuthorized({ hasRole: ['admin'] }), menus_controller_1.create);
router.get('/menus', [
    authenticated_1.isAuthenticated,
    authorized_1.isAuthorized({ hasRole: ['admin', 'manager'] }),
    menus_controller_1.all
]);
router.get('/menus/:id', [
    authenticated_1.isAuthenticated,
    authorized_1.isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
    menus_controller_1.get
]);
router.patch('/menus/:id', [
    authenticated_1.isAuthenticated,
    authorized_1.isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
    menus_controller_1.patch
]);
router.delete('/menus/:id', [
    authenticated_1.isAuthenticated,
    authorized_1.isAuthorized({ hasRole: ['admin', 'manager'] }),
    menus_controller_1.remove
]);
exports.default = router;
//# sourceMappingURL=menu.routes.js.map