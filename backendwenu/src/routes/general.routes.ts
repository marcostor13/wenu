import { Router } from "express"
import { create, all, get, patch, remove } from "../controllers/general.controller";
import { isAuthenticated } from "../middlewares/auth/authenticated";
import { isAuthorized } from "../middlewares/auth/authorized";

const router: Router = Router()

router.post('/general',
    // isAuthenticated,
    // isAuthorized({ hasRole: ['admin'] }),
    create
);

router.get('/general/:collection', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager'] }),
    all
]);

router.get('/general/:collection/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
    get
]);

router.patch('/general/:collection/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
    patch
]);

router.delete('/general/:collection/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager'] }),
    remove
]);

export default router





