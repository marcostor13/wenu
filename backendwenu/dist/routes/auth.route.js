"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authenticated_1 = require("../middlewares/auth/authenticated");
const authorized_1 = require("../middlewares/auth/authorized");
const router = express_1.Router();
router.post('/users', 
// isAuthenticated,
// isAuthorized({ hasRole: ['admin'] }),
auth_controller_1.create);
// lists all users
router.get('/users', [
    // isAuthenticated,
    // isAuthorized({ hasRole: ['admin', 'manager'] }),
    auth_controller_1.all
]);
// get :id user
router.get('/users/:id', [
    authenticated_1.isAuthenticated,
    authorized_1.isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
    auth_controller_1.get
]);
// updates :id user
router.patch('/users/:id', [
    authenticated_1.isAuthenticated,
    authorized_1.isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
    auth_controller_1.patch
]);
// deletes :id user
router.delete('/users/:id', [
    authenticated_1.isAuthenticated,
    authorized_1.isAuthorized({ hasRole: ['admin', 'manager'] }),
    auth_controller_1.remove
]);
exports.default = router;
//# sourceMappingURL=auth.route.js.map