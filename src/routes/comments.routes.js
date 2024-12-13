import { Router } from 'express';
import {
    getComments,
    addComment,

} from "../controllers/commet.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:problemId").get(getComments);
router.route("/").post(addComment);


export default router