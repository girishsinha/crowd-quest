import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const getComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a problem
    const { problemId } = req.params
    const { page = 1, limit = 10 } = req.query

    // const comments = await Comment.find({ Problem: problemId })
    const comments = await Comment.aggregate(
        [
            {
                $match: {
                    Problem: new mongoose.Types.ObjectId(problemId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "createdBy",
                },
            }, { $unwind: "$createdBy", }, {
                $project: {
                    content: 1,
                    owner: 1,
                    createdBy: {
                        username: 1,
                        avatar: 1,
                    },
                },
            }
        ]
    )
    if (!comments) {
        throw new ApiError(500, "Error while fetching comments");

    }
    return res.status(200)
        .json(new ApiResponse(200, comments, "get comments Successfully"));
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a problem
    const { content, problemId } = req.body
    if (!content || !problemId) {
        throw new ApiError(400, "empty content");
    }

    const comment = await Comment.create({
        content,
        Problem: new mongoose.Types.ObjectId(problemId),
        owner: req.user._id,

    })

    if (!comment) {
        throw new ApiError(500, "Error while adding comment");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment is added"));
})
const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getComments,
    addComment,
    updateComment,
    deleteComment
}
