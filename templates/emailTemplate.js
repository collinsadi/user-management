
const { brandName,brandEmail } = require("../brand/brandName")
const url = "http://localhost:5000/auth/password/reset"



const emailVerificationTemplate = (firstName,verificationCode) => {
    return `<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center;">

<div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: left;">
    <h1 style="color: #333;">Email Verification Code</h1>
    <p style="color: #555;">Dear ${firstName},</p>
    <p style="color: #555;">Thank you for signing up with  ${brandName}! To complete your registration, please verify your email address by entering the 6-digit verification code</p>
    <p style="color: #555; font-size: 24px;">Verification Code: ${verificationCode}</p>
    <p style="color: #555;">Please use this code to confirm your email and activate your account. If you didn't request this verification, please disregard this email.</p>
    <p style="color: #555;">Welcome to our community, and we look forward to having you on board!</p>
    <p style="color: #555;">Best regards,<br>The ${brandName} Team</p>
</div>

</body>
</html>
`
}
const loginVerificationTemplate = (firstName,verificationCode) => {
    return `<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center;">

<div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: left;">
    <h1 style="color: #333;">Login Verification Code</h1>
    <p style="color: #555;">Dear ${firstName},</p>
    <p style="color: #555;">A New Login was Detected on on Your ${brandName} Account, To complete the login Process, please verify it is you by entering the 6-digit verification code</p>
    <p style="color: #555; font-size: 24px;">Verification Code: ${verificationCode}</p>
    <p style="color: #555;">We are Workig Everyday to make ${brandName} Safe. If you didn't request this verification, please disregard this email and Change your password.</p>
    <p style="color: #555;">Best regards,<br>The ${brandName} Team</p>
</div>

</body>
</html>
`
}

const forgottenPasswordTemplate = (firstName,hash) => {
    return `<!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center;">

        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: left;">
            <h1 style="color: #333;">Password Reset Instructions</h1>
            <p style="color: #555;">Dear ${firstName},</p>
            <p style="color: #555;">We've received a request to reset your password for your ${brandName} account. Please follow the steps below to reset your password:</p>
            <ol>
                <li><a href="${url}/${hash}" style="text-decoration: none; color: #007BFF;">Click here to reset your password</a></li>
                <li style="color: #555;">You will be directed to a secure page where you can create a new password. Please choose a strong password that you can remember.</li>
                <li style="color: #555;">After creating your new password, you can log in to your ${brandName} account with your updated credentials.</li>
            </ol>
            <p style="color: #555;">This Link is Only Valid for 20 Minutes</p>

            <p style="color: #555;">If you did not request this password reset, please ignore this email. Your account is secure, and no changes have been made.</p>
            <p style="color: #555;">If you encounter any issues or need further assistance, feel free to reach out to our support team at <a href="mailto:${brandEmail}" style="text-decoration: none; color: #007BFF;">${brandEmail}</a>.</p>
            <p style="color: #555;">Best regards,<br>${brandName} Support Team</p>
        </div>

        </body>
        </html>
        `

}

const emailChangeTemplate = (firstName,verificationCode) => {
    return   `<!DOCTYPE html>
<html>
<head>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center;">

<div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: left;">
    <h1 style="color: #333;">Email Change Confirmation</h1>
    <p style="color: #555;">Dear ${firstName},</p>
    <p style="color: #555;">We've received a request to change the email address associated with your ${brandName} account. To complete the email change, please confirm the new email address by entering the 6-digit verification code below:</p>
    <p style="color: #555; font-size: 24px;">Verification Code: ${verificationCode}</p>
    <p style="color: #555;">If you didn't request this change, please contact us immediately at <a href="mailto:${brandEmail}" style="text-decoration: none; color: #007BFF;">${brandEmail}</a>.</p>
    <p style="color: #555;">Thank you for choosing ${brandName}. We're here to help with any questions or concerns you may have.</p>
    <p style="color: #555;">Best regards,<br>The ${brandName} Team</p>
</div>

</body>
</html>
`
}

module.exports = {
    emailVerificationTemplate,
    forgottenPasswordTemplate,
    emailChangeTemplate,
    loginVerificationTemplate
}