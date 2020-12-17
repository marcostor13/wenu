import { Router } from "express"
import { create, all, get, patch, remove } from "../controllers/menus.controller";
import { isAuthenticated } from "../middlewares/auth/authenticated";
import { isAuthorized } from "../middlewares/auth/authorized";

const router: Router = Router()

router.post('/menus',
    isAuthenticated,
    isAuthorized({ hasRole: ['admin'] }),
    create
);

router.get('/menus', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager'] }),
    all
]);

router.get('/menus/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
    get
]);

router.patch('/menus/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
    patch
]);

router.delete('/menus/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager'] }),
    remove
]);

export default router





