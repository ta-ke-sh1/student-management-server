const nodeMailer = require("nodemailer");

class MailService {
    transporter;

    constructor () {
        this.transporter = nodeMailer.createTransport({
            port: 465,
            host: "smtp.gmail.com",
            auth: {
                user: process.env.EMAIL_HOST,
                pass: process.env.EMAIL_PASSWORD,
            },
            secure: true,
        });
    }

    async sendMail(reciever, header, content) {
        var date = new Date().toLocaleString();
        const mailData = {
            from: constants.emailHost,
            to: reciever,
            text: header,
            html:
                "<b>Hello</b><br>A new post just been added to the database!<br>" +
                content +
                "<br>at " +
                date,
        };

        transporter.sendMail(mailData, function (err, info) {
            if (err) console.log(err);
            else console.log(info);
        });
    }

    async sendMailToUser(user, content) {
        var date = new Date().toLocaleString();
        await sendMail(
            user,
            "New Comment has been added",
            "New Comment has been added<br>" + content + "<br>at " + date
        );
    }
}

module.exports = { MailService };

