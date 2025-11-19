import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import path from "path"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import taskRoutes from "./routes/task.route.js"
import reportRoutes from "./routes/report.route.js"
import { fileURLToPath } from "url"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database is connected")
  })
  .catch((err) => {
    console.log(err)
  })

const app = express()

// Middleware to handle cors
const allowedOrigins = [
  process.env.FRONT_END_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://taskmanager-frontend-k5lw.onrender.com",
].filter(Boolean)

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests, or same-origin requests)
      if (!origin) return callback(null, true)
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        // In development, be more permissive for mobile testing
        if (process.env.NODE_ENV !== "production") {
          console.log(`[CORS] Allowing origin: ${origin}`)
          callback(null, true)
        } else {
          callback(new Error("Not allowed by CORS"))
        }
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Important for cookies
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
    maxAge: 86400, // 24 hours
  })
)

// Middleware to handle JSON object in req body
app.use(express.json())

app.use(cookieParser())

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`)
})

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/reports", reportRoutes)

// serve static files from "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Handle 404 for API routes
app.use("/api/*", (req, res, next) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  })
})

// General error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500

  const message = err.message || "Internal Server Error"

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})
