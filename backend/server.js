const express = require('express')
const dotenv = require('dotenv')
const pino = require("pino")
const pinoHTTP = require("pino-http")
const connectDB = require("./src/config/db")
const authRoutes = require('./src/routes/authRoutes')
const categoryRoutes = require('./src/routes/categoryRoutes')
const noteRoutes = require('./src/routes/noteRoutes')
const { errorHandler, notFound } = require('./src/middleware/errorMiddleware')

dotenv.config()

const app = express()
const logger = pino({level: "info"})

app.use(express.json())
app.use(pinoHTTP({logger}))
connectDB()

app.get("/" , (req, res) => {
    res.json({message: "Notes App API is running"})
})

app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/notes', noteRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`)
})