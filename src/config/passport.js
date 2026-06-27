import passport from "passport"
import { Strategy as GitHubStrategy } from "passport-github2"
import User from "../models/user.js"


passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/api/v1/auth/github/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value

                let user = await User.findOne({ email })

                if (!user) {
                    user = new User({
                        name: profile.username,
                        email: email,
                        password: "github-oauth",
                        role: "user"
                    })

                    await user.save()
                }

                return done(null, user)

            } catch (error) {
                return done(error, null)
            }
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (error) {
        done(error, null)
    }
})