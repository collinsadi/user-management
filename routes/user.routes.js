const express = require("express");
const router = express.Router();
const { createUser, verifyUser, loginUser } = require("../controllers/signup")
const { forgottenPassword, resetPassword } = require("../controllers/password")
const { changeEmail, verifyNewEmail, changeProfilePicture, followAnotherUser, unfollowUser, checkIfFollowing, getUserProfile} = require("../controllers/profile")

// Middleware to Authenticate Protected Routes Before Proceeding

const authenticateUser = require("../middlewares/authMiddleware")

/**
 * Routes to Sign Up, Verify and Login User
 */

router.post("/signup", createUser)
router.post("/signup/verify", verifyUser)
router.post("/login", loginUser)

/**
 * Routes to handle user's Password Interactions
 */
router.post("/password/forgotten",forgottenPassword)
router.post("/password/reset",resetPassword)

/**
 * Routes to handle user's Profile Interactions
 */

router.post("/profile/edit/email",authenticateUser,changeEmail)
router.post("/profile/edit/email/verify",authenticateUser,verifyNewEmail)
router.post("/profile/edit/picture",authenticateUser,changeProfilePicture)

/**
 * Route for Users to Follow and Unfollow
 */
router.post("/follow",authenticateUser,followAnotherUser)
router.post("/unfollow", authenticateUser, unfollowUser)

/**
 * Route to check if the logged in user is following the current user whose page he is in
 * this is to help style the FOLLOW button on the frontend to have FOLLOWING instead of FOLLOW, if it is true
 */
router.get("/check/following",authenticateUser,checkIfFollowing)

/**
 * Route to get a particular user using the unique username
 */
router.get("/profile",getUserProfile)

module.exports = router