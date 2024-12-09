import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleProblemLike = asyncHandler(async (req, res) => {
    const { problemId } = req.params
    if (!isValidObjectId(problemId)) {
        throw new ApiError(400, "Invalid Video ID");
    }
    const user = req.user._id;
    const likedProblem = await Like.findOne({
        $and: [{ problem: problemId }, { likedBy: user }],
    });
    if (!likedProblem) {
        const like = await Like.create({
            problem: problemId,
            likedBy: user,
        });
        if (!like) {
            throw new ApiError(500, "Error while liking the Problem");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, like, "User Liked the Problem"));
    }

    const unlikeProblem = await Like.findByIdAndDelete(likedProblem._id);
    if (!unlikeProblem) {
        throw new ApiError(500, "Error while unliking the Problem");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, unlikeProblem, "User Unliked the Problem"));

});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    //TODO: toggle like on comment
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid Comment ID");
    }
    const user = req.user._id;
    const likeComment = await Like.findOne({
        $and: [{ comment: commentId }, { likedBy: user }],
    });
    if (!likeComment) {
        const comment = await Like.create({
            comment: commentId,
            likedBy: user,
        });
        if (!comment) {
            throw new ApiError(500, "Error while liking comment");
        }
    }
})
const getLikedProblem = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedProb = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id),
                problem: { $exists: true, $ne: null }
            }
        },
        {
            $lookup: {
                from: "problems",
                foreignField: "_id",
                localField: "problem",
                as: "problem",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "postedBy",
                            foreignField: "_id",
                            as: "postedBy",
                            pipeline: [
                                {
                                    $project: {
                                        avatar: 1,
                                        username: 1,
                                        fullName: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            postedBy: {
                                $first: "$postedBy"
                            }
                        }
                    },
                    {
                        $project: {
                            image: 1,
                            title: 1,
                            description: 1,
                            postedBy: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$problem"
        },
        {
            $project: {
                problem: 1,
                likedBy: 1
            }
        }
    ])
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedProb,
                "fetched all liked problems"
            )
        )
})

export {
    toggleProblemLike,
    toggleCommentLike,
    getLikedProblem,

}