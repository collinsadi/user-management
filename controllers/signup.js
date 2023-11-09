require("dotenv").config()
const User = require("../models/user.model");
const sendEmail = require("../utils/emailSystem");
const { brandName } = require("../brand/brandName")
const bcrypt = require("bcrypt");
const handleError = require("../utils/errorHandler");
// const shortId = require("shortid")
const jwt = require("jsonwebtoken")
const jwtsecret = process.env.JWT_SECRET
const { emailVerificationTemplate,loginVerificationTemplate } = require("../templates/emailTemplate")



const createUser = async (request, response) => {

    let { username, email, password, firstName, lastName, country } = request.body

try{
    
    if (!username) {
        return response.status(422).json(handleError(422, "Username Required", "The Client did not send the username in the request body"))
    }
    if (username.split(" ").length > 1) {
        return response.status(422).json(handleError(422, "Do not use spaces in usernames", "The Username sent by the client contains white spaces"))
    }
	 let regExp = /\p{P}/gu;
    if (regExp.test(username)) {
        return response.status(422).json(handleError(422, "Invalid username Format", "The Username sent by the client contains an invalid character " ))
    }
    if (!email) {
        return response.status(422).json(handleError(422, "Email is Required", "The Client Did not send the email in the request body"))
    }
    if (email.indexOf("@") === -1) {
        return response.status(422).json(handleError(422, "Email is Invalid", "The Email Sent from the Client Appears to be Invalid"))
    }
    if (!password) {
        return response.status(422).json(handleError(422, "Password is Required", "The Client Did not send the password in the request body"))
    }
    
    if (!firstName) {
        return response.status(422).json(handleError(422, "First Name is Required", "The Client Did not send the firstName in the request body"))
    }

    if (!lastName) {
        return response.status(422).json(handleError(422, "Last Name is Required", "The Client Did not send the lastName in the request body"))
    }
    if (!country) {
        return response.status(422).json(handleError(422, "an Error Occured", "The Client Did not send the country in the request body"))
    }

    email = email.toLowerCase()
    username = username.toLowerCase()

    const emailExists = await User.findOne({ email })
    
    if (emailExists) {
        return response.status(400).json(handleError(400, "Email Already in Use", "the Email Provided by the Client is associated with another user"))
    }
    
    const usernameExists = await User.findOne({ username })
    
    if (usernameExists) {
        return response.status(400).json(handleError(400, "Username Already in Use", "the Username provided by the client is already associated with another user"))
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const validationCode = (Math.random() + "").substring(2, 8)
    const validationCodeExpires = new Date()
    const verificationHtml = emailVerificationTemplate(firstName, validationCode)

    await User.create({ username, email, passwordHash, firstName, lastName, country, validation: { token: validationCode, expiresIn: validationCodeExpires } })

    const mail = sendEmail(email, "Account Validation", verificationHtml)
    
    if (!mail) {
        return response.status(400).json(handleError(400, "an Error Occured, trying Logging in with this Credentials", "Account Created but there was an Error Sending Mail"))
    }

    response.status(201).json({ status: true, message: `${brandName} Account Created`, email })
    

} catch (error) {
    console.log(error)
    response.status(500).json(handleError(500, "Internal Server Error", "an Error Occured on the Server Side"))
}
    

}

const verifyUser = async (request, response) => {

    let { email, code } = request.body
    
    try {
        
    
        if (!email) {
            return response.status(400).json(handleError(400, "Try Logging in Again", "the User Email was not sent from the request body"))
        }

        if (!code) {
            return response.status(422).json(handleError(422,"Verification Code Missing", "the Email Verification Code was not received from the client" ))
        }

        email = email.toLowerCase()

        const user = await User.findOne({ email })
        
        if (!user) {
            return response.status(404).json(handleError(404, "Bad Request, Try Logging in Again", "Critical Error: the Email Provided by the Client seems not to be associated with any User"))
        }

        if (code !== user.validation.token) {
            return response.status(400).json(handleError(400, "Invalid Code", "the Email Verification code Provided by the client for this user appears to be invalid"))
        }

        const timeCodeWasSent = new Date(user.validation.expiresIn)
        const currentTime = new Date()
        const minutesDifference = Math.floor((currentTime - timeCodeWasSent) / (1000 * 60))

        console.log(minutesDifference)

        if (minutesDifference > 20) {
            user.validation = undefined
            await user.save()

            return response.status(400).json(handleError(400,"Expired Token, Try Loging in Again", "The Token Received from the Client Has Passed the 20 minutes time Validity"))
        }

        user.validation = undefined
        user.validated = true
        await user.save()

        const token = jwt.sign({ user: user._id }, jwtsecret)
        
        response.status(200).json({status:true, message:`validation successful`, token})


    } catch (error) {
        console.log(error)
        response.status(500).json(handleError(500, "Internal Server Error", "an Error Occured on the Server Side"))
    }
    
    
}

const loginUser = async (request, response) => {

    let { email, password } = request.body
    
    
    try {
    
        if (!email) {
        return response.status(422).json(handleError(422, "Email Required", "the client did not send the user's Email in the request body"))
        }
        if (!password) {
        return response.status(422).json(handleError(422, "Email Required", "the client did not send the user's Email in the request body"))
        }

        email = email.toLowerCase()

        const user = await User.findOne({ email })
        
        if(!user){
            return response.status(400).json(handleError(400, "Invalid Credentials", "the Email provided by the client is not Associated with any user"))
        }

        const passwordIsValid = await bcrypt.compare(password, user.passwordHash)

        if (!passwordIsValid) {
            return response.status(400).json(handleError(400, "Invalid Credentials", "the password Provided by the Client for this user is Invalid"))
        }

        if (user.blocked) {
            return response.status(401).json(handleError(401,"Account Disabled", "this account Have been Permanently or Temporarily Disabled"))
        }

        if (!user.validated) {
            
            const validationCode = (Math.random() + "").substring(2, 8)
            const validationCodeExpires = new Date()
            const verificationHtml = emailVerificationTemplate(user.firstName, validationCode)

            user.validation.token = validationCode
            user.validation.expiresIn = validationCodeExpires
            await user.save()

            const mail = sendEmail(email, "Account Validation", verificationHtml)
    
            if (!mail) {
                return response.status(400).json(handleError(400, "an Error Occured, trying Logging in with this Credentials", "Account Created but there was an Error Sending Mail"))
            }
            
            return response.status(400).json(handleError(400, "Please Verify Your Email", "Email Verification Sent for the User to Verify Account"))

        }

        const validationCode = (Math.random() + "").substring(2, 8)
        const validationCodeExpires = new Date()
        const loginHtml = loginVerificationTemplate(user.firstName, validationCode)
        
        user.validation.token = validationCode
        user.validation.expiresIn = validationCodeExpires
        await user.save()

        const mail = sendEmail(email, "Login Confirmation", loginHtml)
    
        if (!mail) {
                return response.status(400).json(handleError(400, "an Error Occured, trying Logging in with this Credentials", "Account Created but there was an Error Sending Mail"))
        }

        response.status(200).json({status:true, message:"Authorization Required", email})


    } catch (error) {
        console.log(error)
        response.status(500).json(handleError(500, "Internal Server Error", "an Error Occured on the Server Side"))
    }

}



module.exports = {
    createUser,
    verifyUser,
    loginUser
}