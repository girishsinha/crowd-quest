import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'
import problemRouter from "./routes/problem.routes.js"
import likeRouter from "./routes/like.routes.js"
import commentRouter from "./routes/comments.routes.js"
// import commentRouter from "./routes/comment.routes.js"

//routes declaration
app.use("/api/users", userRouter);
app.use("/api/problem", problemRouter);
app.use("/api/like", likeRouter);
app.use("/api/comment", commentRouter)
// app.use("/api/v1/comments", commentRouter)

// http://localhost:8000/api/v1/users/register

export { app }