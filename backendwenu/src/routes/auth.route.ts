import { Router } from "express"
import { create, all, get, patch, remove } from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/auth/authenticated";
import { isAuthorized } from "../middlewares/auth/authorized";

const router: Router = Router()

router.post('/users',
    // isAuthenticated,
    // isAuthorized({ hasRole: ['admin'] }),
    create
);

// lists all users
router.get('/users', [
    // isAuthenticated,
    // isAuthorized({ hasRole: ['admin', 'manager'] }),
    all
]);
// get :id user
router.get('/users/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
    get
]);
// updates :id user
router.patch('/users/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
    patch
]);
// deletes :id user
router.delete('/users/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager'] }),
    remove
]);

export default router





