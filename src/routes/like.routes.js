import { Router } from 'express';
import {
    getLikedProblem,
    toggleCommentLike,
    toggleProblemLike,

} from "../controllers/like.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/p/:problemId").post(toggleProblemLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/problem").get(getLikedProblem);

export default router