const User = require("../models/user.model");
const sendEmail = require("../utils/emailSystem");
const bcrypt = require("bcrypt");
const handleError = require("../utils/errorHandler");
require("dotenv").config()
const crypto = require('crypto');
const { forgottenPasswordTemplate } = require("../templates/emailTemplate")



const forgottenPassword = async (request, response) => {
    
    const email = request.body.email

    try {
    
        if (!email) {
            return response.status(422).json(handleError(422, "Enter the Email you Used to Create Your Account", "The Client Did not send the users email in the request body"))
        }

        const user = await User.findOne({ email })
        
        if (!user) {
            return response.status(404).json(handleError(404, "No User With This Email Was Found", "No User Was Found With Thr Email Address Provided By the Client"))
        }
       

        crypto.randomBytes(25, async (err, buffer) => {
        if (err) {
            console.error('Error generating random bytes:', err);
        } else {
            
            // Send Password Reset Mail to the User After Crypto Sucessfully Generates

            const passwordResetHtml = forgottenPasswordTemplate(user.firstName,buffer.toString('hex'))
            // buffer.toString('hex')

            const verificationCodeExpires = new Date()

            user.validation.token = buffer.toString('hex');
            user.validation.expiresIn = verificationCodeExpires;
        
            await user.save()
            

            const mail = sendEmail(email, "Password Reset", passwordResetHtml)

            // Check if the Email Was Sent Sucessfully

            // if (!mail) {
            //     return response.status(204).json(handleError(204, "an Error Occured, Try Requesting Again", "An Error Occured Sending Validation Link"))
                    
            // }
        }
        });
        

    response.status(200).json({status:true, message:"Password Reset Code Sent"})


    } catch (error) {
        
        response.status(500).json(handleError(500, "Internal Server Error", "an Error Occured on the Server Side"))
        console.log(error)
    }

}

const resetPassword = async (request, response) => {
    
    const {code,password} = request.body

    try {
        
        if (!code) {
            return response.status(400).json(handleError(400, "Token Not Found", "The Password Reset Token was not Sent from The Client"))
        }
        if (!password) {
            return response.status(422).json(handleError(422, "New Password Required", "New Password is Required to Reset user's Credentials"))
        }

        const user = await User.findOne({ validation: { token: code } })
        
        if (!user) {
            return response.status(404).json(handleError(404, "Invalid Token", "The Token Received from the Client Appears to Be Invalid"))
        }

        const timeCodeWasSent = new Date(user.validation.expiresIn)
        const currentTime = new Date()
        const minutesDifference = Math.floor((currentTime - timeCodeWasSent) / (1000 * 60))

        console.log(minutesDifference)

        if (minutesDifference > 20) {
            user.validation = undefined
            await user.save()

            return response.status(400).json(handleError(400,"Invalid or Expired Token", "The Token Received from the Client Has Passed the 20 minutes time Validity"))
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        user.passwordHash = hashedPassword
        user.validation = undefined

        await user.save()

        response.status(200).json({status:true, message:"Password Reset Sucessful"})


    } catch (error) {
        
        response.status(500).json(handleError(500, "Internal Server Error", "an Error Occured on the Server Side"))
        console.log(error)
    }

}


module.exports = { forgottenPassword, resetPassword }
