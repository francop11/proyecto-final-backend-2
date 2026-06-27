import { Router } from "express"
import { register,login,profile,admin ,logout,session} from "../controllers/authController.js"
import { verifyToken } from "../middlewares/authMiddleware.js"
import { authorizeAdmin } from "../middlewares/roleMiddleware.js"
import passport from "passport"

const router=Router()

router.post("/register", register)
router.post("/login",login)
router.get("/profile", verifyToken, profile)
router.get("/admin",verifyToken,authorizeAdmin,admin)
router.post("/logout", logout)
router.get("/session",verifyToken, session)
router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] })
)
router.get(
    "/github/callback",
    passport.authenticate("github", {
        failureRedirect: "/login"
    }),
    (req, res) => {
        res.status(200).json({
            msg: "Login con GitHub exitoso",
            user: req.user
        })
    }
)


export default router