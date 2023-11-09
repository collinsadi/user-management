const User = require("../models/user.model");
const sendEmail = require("../utils/emailSystem");
const handleError = require("../utils/errorHandler");
const { emailChangeTemplate } = require("../templates/emailTemplate")
const { notficationModel } = require("../config/foreignDb")

const changeEmail = async (request, response) => {
    
    const email = request.body.email
    const id = request.user

    try{

    if (!email) return response.status(422).json(handleError(422, "email required", "The New email was not received from the client"))
        
    if(email.indexOf("@") === -1) return response.status(400).json(handleError(400, "email format invalid", "The Email Received from the client is not formated properly"))
    
    const emailExists = await User.findOne({ email })
    
    if(emailExists) return response.status(400).json(handleError(400, "email already in use", "The New email provided buy the client is already associated with another user"))

        const user = await User.findById(id)
        const verificationCode = ("" + Math.random()).substring(2, 8)
        const verificationCodeExpires = new Date()
        
    if (user) {
        user.newEmail = email
        user.validation.token = verificationCode
        user.validation.expiresIn = verificationCodeExpires
        await user.save()
    } else {
        return response.status(404).json(handleError(400, "User Not Found", "This is a Critical Error, The Authorization Token Seem not To be Valid"))
    }

    
    const emailChangeHtml = emailChangeTemplate(user.firstName,verificationCode)

    const mail = sendEmail(email, "Verify New Email",emailChangeHtml)

    // Check if the Email Was Sent Sucessfully

    // if (!mail) {
    //     return response.status(204).json(handleError(204, "an Error Occured, Try Again", "an Error Occured Sending Validation Mail"))
        
        // }
        
    
    response.status(200).json({status:true, message:"Verify New Email"})

        
        
    } catch (error) {
        response.status(500).json(handleError(500, "Internal Server Error", "an Error Occured on the Server Side"))
    }

}

const verifyNewEmail = async (request, response) => {
    
    const id = request.user
    const code = request.body.code

    try {
        
        if(!code){
            return response.status(422).json(handleError(422,"Code Missing", "The Client Did nit Send the Email Verification Code"))
        }

        const user = await User.findById(id)

        if (!user) {
            return response.status(404).json(handleError(400, "User Not Found", "This is a Critical Error, The Authorization Token Seem not To be Valid"))
        }

        if (user.validation.token !== code) {
            return response.status(400).json(handleError(400, "Invalid Code", "The New Email Verification Code sent By the Client Appears to be Invalid"))
        }

        const timeCodeWasSent = new Date(user.validation.expiresIn)
        const currentTime = new Date()
        const minutesDifference = Math.floor((currentTime - timeCodeWasSent) / (1000 * 60))

        console.log(minutesDifference)
        
        if (minutesDifference > 20) {
            user.validation = undefined
            user.newEmail = undefined
            await user.save()
            return response.status(400).json(handleError(400, "verification Code Expired, Try Again", "The Email Verification Code Received From the Client has Passed 20 minutes Validity Time")) 

        }

        user.email = user.newEmail
        user.validation = undefined
        user.newEmail = undefined
        await user.save()

        response.status(200).json({ status: true, message: "Email Changed Sucessfully" })
        


    } catch (error) {
        response.status(500).json(handleError(500, "Internal Server Error", "an Error Occured on the Server Side"))
    }
}

const changeProfilePicture = async () => {
    
    const id = request.user
    const newImage = request.body.profilePicture

    try{

        if (!newImage) {
            return response.status(422).json(handleError(422, "Image String Missing", "The Client Side did not Send The URL for the new Image"))
        }

        const user = await User.findById(id)

        if (!user) {
            return response.status(400).json(handleError(400, "User not Found", "a Critical Error Has Occured the Authentication Token Sent By The Client Seems to be Invalid "))
        }

        user.profilePicture = newImage
        await user.save()

        response.status(200).json({status:true, message:"Profile Picture Updated Sucessfully"})


    } catch (error) {
        response.status(500).json(handleError(500, "Internal Server Error", "an Error Ocured on the Server Side"))
    }
}

const followAnotherUser = async (request, response) => {
    
    const id = request.user
    const followingId = request.query.user // id of the user that the logged in user wants to follow

    try{

        if (!followingId) {
            return response.status(400).json(handleError(400, "User to Follow not Specified", "No user to follow was Specified"))
        }

        const user = await User.findById(id) // the logges in user

        if (!user) {
            return response.status(404).json(handleError(400, "User Not Found", "This is a Critical Error, The Authorization Token Seem not To be Valid"))
        }

        const following = await User.findById(followingId) // the user that the logged in user wants to follow

        if (!following) {
            return response.status(400).json(handleError(400, "User Not Found", "The User to follow was not found"))
        }

        if (followingId == id) {
            return response.status(400).json(handleError(400, "Can't Follow Self", "The Id Provided by the client matches that of the Logged in User"))
        }

        if (user.following.includes(followingId)) {
            return response.status(400).json(handleError(400, "Already Following", "This user is already following the request user"))
        }

        user.following.push(followingId) // add the user that has just been followed to the number of following

        following.followers.push(id) // add the logged in user to the list of the followers of the logged in user

        user.followingCount += 1 // increase the following count of the logged in user

        following.followersCount += 1 // increase the followers count of the user that has been followed

        await user.save()

        await following.save()

        const Notification = await notficationModel()

        await Notification.insertOne({user:followingId,details:`${user.firstName} Started Following You`, group:"follow", time: new Date()}) // create a notofication for the user that has just been followed

        response.status(200).json({status:true, message:"Follow Successful"})



    } catch (error) {
        console.log(error)
        if (error.kind === "ObjectId") {
            return response.status(400).json(handleError(400, "Invalid User Id", "Ther User Id Provided by the client is Invalid"))
        }
        response.status(500).json(handleError(500, "Internal Server Error", "am Error Ocured on the Server Side"))
    }

}

const unfollowUser = async (request, response) => {
    const id = request.user
    const followingId = request.query.user // id of the user that the logged in user wants to unfollow

    try{

        if (!followingId) {
            return response.status(400).json(handleError(400, "User to UnFollow not Specified", "No user to follow was Specified"))
        }

        const user = await User.findById(id) // the logged in user

        if (!user) {
            return response.status(404).json(handleError(400, "User Not Found", "This is a Critical Error, The Authorization Token Seem not To be Valid"))
        }

        const following = await User.findById(followingId) // the user that the logged in user wants to unfollow

        if (!following) {
            return response.status(400).json(handleError(400, "User Not Found", "The User to unfollow was not found"))
        }

        if (followingId == id) {
            return response.status(400).json(handleError(400, "Can't UnFollow Self", "The Id Provided by the client matches that of the Logged in User"))
        }

        if (!user.following.includes(followingId)) {
            return response.status(400).json(handleError(400, "Not Following", "This user is notfollowing the request user"))
        }

        user.following.pull(followingId) // remove the user that has just been unfollowed from the number of following

        following.followers.pull(id) // remove the logged in user from the list of the followers of the unfollowed user

        user.followingCount -= 1 // decrease the following count of the logged in user

        following.followersCount -= 1 // decrease the followers count of the user that has been followed

        await user.save()

        await following.save()

        response.status(200).json({status:true, message:"unFollow Successful"})



    } catch (error) {
        console.log(error)
        if (error.kind === "ObjectId") {
            return response.status(400).json(handleError(400, "Invalid User Id", "Ther User Id Provided by the client is Invalid"))
        }
        response.status(500).json(handleError(500, "Internal Server Error", "am Error Ocured on the Server Side"))
    }

}

const checkIfFollowing = async (request, response) => {
    
    const id = request.user
    const checkId = request.query.user

    try{

        if (!checkId) {
            return response.status(400).json(handleError(400, "User to Check not Sent", "the client did not send the id of the user to check"))
        }

        const user = await User.findById(id)

         if (!user) {
            return response.status(404).json(handleError(400, "User Not Found", "This is a Critical Error, The Authorization Token Seem not To be Valid"))
        }

        const userToCheck = await User.findById(checkId)

        if (!userToCheck) {
            return response.status(400).json(handleError(400, "User not Found", "The User to Check Following Status was not found"))
        }

        
        if (userToCheck.followers.includes(id)) {
            
            response.status(200).json({ status: true, following: true })
        } else {
            response.status(200).json({ status: true, following: false })
        }



    } catch (error) {
         console.log(error)
        if (error.kind === "ObjectId") {
            return response.status(400).json(handleError(400, "Invalid User Id", "Ther User Id Provided by the client is Invalid"))
        }
        response.status(500).json(handleError(500, "Internal Server Error", "am Error Ocured on the Server Side"))
  
    }
}

const getUserProfile = async (request, response) => {
    
    const username = request.query.user

    try {
    
        if (!username) {
        return response.status(400).json(handleError(400, "Username Missing", "Users Username is missing"))
        }

        const user = await User.findOne({ username }).populate("followers following", "username profilePicture").sort({ createdAt: -1 })
        
        if (!user) {
        return response.status(400).json(handleError(400, "User Not Found", "the username Provided by the Client is not Associated with any user"))
        }

        response.status(200).json({status:true, user})

    } catch (error) {

        console.log(error)
        response.status(500).json(handleError(500, "Internal Server Error", "am Error Ocured on the Server Side"))

    }
}

const searchUsers = async (request, response) => {
    
    const keyword = request.query.keyword
    const query = keyword ? { $or: [{ username: { $regex: keyword, $options: "i" } }] } : {}

}

module.exports = { changeEmail, verifyNewEmail, changeProfilePicture, followAnotherUser,unfollowUser,checkIfFollowing,getUserProfile }