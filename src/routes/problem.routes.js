import { Router } from "express";
import {
    getAllProblem,
    publishProblem,
    getProblemById,
    getMyProblem,
    deleteProblem,
} from "../controllers/problem.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .get(getAllProblem)
    .post(
        upload.fields([
            {
                name: "image",
                maxCount: 1,
            },


        ]),
        publishProblem
    );

router
    .route("/:problemId")
    .get(getProblemById)
    .delete(deleteProblem)

router.route("/userProblems/:username").get(getMyProblem)
export default router