const nodemailer = require('nodemailer');
const configMailer = require('../configs/configMailer');


let transporter = nodemailer.createTransport({
    service: configMailer.service,
    auth: {
        user: configMailer.user,
        pass: configMailer.pass,
    },
});

module.exports = async (to, subject, html) => {
    return transporter.sendMail({
        from: configMailer.user,
        to: to,
        subject: subject,
        text: '',
        html: html
    });
}

