import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { Problem } from "../models/problem.model.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

import mongoose, { isValidObjectId } from "mongoose";


const getAllProblem = asyncHandler(async (req, res) => {
    const { page, limit } = req.query
    const Problems = await Problem.aggregate([

        {
            $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "createdBy",
            },
        },
        {
            $unwind: "$createdBy",
        },
        {
            $project: {
                image: 1,
                title: 1,
                description: 1,
                tags: 1,
                createdBy: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                },
            },
        },

        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: parseInt(limit),
        },
    ]);
    return res
        .status(200)
        .json(new ApiResponse(200, Problems, "Fetched All Problems"));
});

const publishProblem = asyncHandler(async (req, res) => {
    const { title, description, tags, status } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "All Fields are required");
    }


    const imageLocalPath = req.files?.image[0]?.path;
    if (!imageLocalPath) {
        throw new ApiError(400, "image file is required")
    }


    const imagecloud = await uploadOnCloudinary(imageLocalPath)
    if (!imagecloud) {
        throw new ApiError(400, "not getting uploded file link ")
    }

    const problem = await Problem.create({
        image: imagecloud.url,
        title,
        description,
        postedBy: req.user._id,
        tags,
    })



    if (!problem) {
        throw new ApiError(500, "Something went wrong while posting problem")
    }

    return res.status(201).json(
        new ApiResponse(200, problem, "Problem posted Successfully")
    )
});

const getProblemById = asyncHandler(async (req, res) => {
    const { problemId } = req.params;

    if (!isValidObjectId(problemId)) {
        throw new ApiError(400, "Invalid problem ID");
    }
    const problem = await Problem.findById(problemId);
    if (!problem) {
        throw new ApiError(404, "No problem found");
    }
    return res.status(200).json(new ApiResponse(200, problem, "problem Fetched"));

});

const deleteProblem = asyncHandler(async (req, res) => {
    const { problemId } = req.params;

    if (!isValidObjectId(problemId)) {
        throw new ApiError(400, "Invalid Problem ID");
    }
    const problem = await Problem.findById(problemId);
    if (!problem) {
        throw new ApiError(404, "No Problem found");
    }

    if (isValidObjectId(problem.postedBy) !== isValidObjectId(req.user._id)) {
        throw new ApiError(403, "You are not allowed to delete this problem");
    }
    const cloudinaryDeleteProblemResponse = await deleteFromCloudinary(
        problem.image
    );
    if (cloudinaryDeleteProblemResponse.result !== "ok") {
        throw new ApiError(500, "Error while deleting problem from cloudinary");
    }
    const deleteProblem = await Problem.findByIdAndDelete(problemId);
    if (!deleteProblem) {
        throw new ApiError(500, "Error while deleting Problem");
    }
    return res.status(200).json(new ApiResponse(200, {}, "Problem Deleted"));
});

const getMyProblem = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const Problems = await Problem.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "createdBy",
            },
        },
        {
            $unwind: "$createdBy",
        },
        {
            $match: { "createdBy.username": username }, // Filter where the username matches
        },
        {
            $project: {
                image: 1,
                title: 1,
                description: 1,
                tags: 1,
                createdBy: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                },
            },
        },
    ])
    return res
        .status(200)
        .json(new ApiResponse(200, Problems, "Fetched yuor problems"));
})


export {
    getAllProblem,
    publishProblem,
    getProblemById,
    deleteProblem,
    getMyProblem
}