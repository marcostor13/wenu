"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const general_controller_1 = require("../controllers/general.controller");
const authenticated_1 = require("../middlewares/auth/authenticated");
const authorized_1 = require("../middlewares/auth/authorized");
const router = express_1.Router();
router.post('/general', 
// isAuthenticated,
// isAuthorized({ hasRole: ['admin'] }),
general_controller_1.create);
router.get('/general/:collection', [
    authenticated_1.isAuthenticated,
    authorized_1.isAuthorized({ hasRole: ['admin', 'manager'] }),
    general_controller_1.all
]);
router.get('/general/:collection/:id', [
    authenticated_1.isAuthenticated,
    authorized_1.isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
    general_controller_1.get
]);
router.patch('/general/:collection/:id', [
    authenticated_1.isAuthenticated,
    authorized_1.isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
    general_controller_1.patch
]);
router.delete('/general/:collection/:id', [
    authenticated_1.isAuthenticated,
    authorized_1.isAuthorized({ hasRole: ['admin', 'manager'] }),
    general_controller_1.remove
]);
exports.default = router;
//# sourceMappingURL=general.routes.js.map