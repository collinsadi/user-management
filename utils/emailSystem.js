const nodemailer = require("nodemailer")



const sendEmail = (email, subject, html) => {
    
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "chowlinfood@gmail.com",
            pass:"ijiqlgwxrmkvvdey"
        }
    })

    const mailOptions = {

        from: "chowlinfood@gmail.com",
        to: email,
        subject: subject,
        html: html
    }


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
            return false
        } else {
            console.log(info)
            return true
        }
    })

}

module.exports = sendEmail;