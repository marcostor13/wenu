import { Router } from "express"
import { get } from "../controllers/scraping.controller";
// import { isAuthenticated } from "../middlewares/auth/authenticated";
// import { isAuthorized } from "../middlewares/auth/authorized";

const router: Router = Router()

router.get('/scraping/:instagramid',
    // isAuthenticated,
    // isAuthorized({ hasRole: ['admin'] }),
    get
);




export default router





