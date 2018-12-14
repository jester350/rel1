var schedule = require('node-schedule');

exports.life = function(){
    console.log('The answer to life, the universe, and everything!')
};

exports.godmail = function(){
    console.log("running ghost mail");
const nodemailer = require('nodemailer');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
// git test
nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: '127.0.0.1',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "jester@127.0.0.1", // generated ethereal user
            pass: "kissit2001" // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Poltergeist 👻" <Poltergeist@Amityville.com>', // sender address
        to: 'jester350@gmail.com', // list of receivers
        subject: 'BOO ✔', // Subject line
        text: 'All your based belong to us', // plain text body
        html: '<b>All your based belong to us!</b>', // html body
        attachments: [{filename: 'certsprebluebird.z01',path: appRoot+'/uploads/certsprebluebird.z01'}]
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
})};