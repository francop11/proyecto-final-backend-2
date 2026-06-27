import express from "express"
import passport from "passport"
import "./config/passport.js"
import authRoutes from "./routes/authRoutes.js"
import cookieParser from "cookie-parser"
import session from "express-session"
import MongoStore from "connect-mongo"

const app = express()

app.use(express.json())

app.use(cookieParser())


app.use(session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
}),
resave: false,
saveUninitialized: false,
cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: true
}
}))

app.use(passport.initialize())
app.use(passport.session())


app.use("/api/v1/auth", authRoutes)

export default app