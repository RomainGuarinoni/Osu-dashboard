const nodeMailer = require("nodemailer");
const { google } = require("googleapis");
const dotenv = require("dotenv");
dotenv.config();
const CLIENT_ID =
  "81107138508-e6ura151ftv46fla5fgck1ntf6sstc9b.apps.googleusercontent.com";

//const CLIENT_SECRET = ;
const REDIRECT_URL = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04KHMIQOZ3-_XCgYIARAAGAQSNwF-L9IrjgVJ_3VqLPHKyY_zxAetrqzIA-qaJaom2qbgah0jqw2_mDOWgTpinDtHvwGXc7IRLjk";
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
async function sendMail(req, res, next) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "osudashboard@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
      rejectUnauthorized: false,
    });

    const options = {
      from: "OSU DASHBOARD 💻 <osudashboard@gmail.com>",
      to: "romain.guar91@gmail.com",
      subject: "OSU DASHBOARD 💻",
      text: `${req.body.user} \n ${req.body.email} \n \n ${req.body.msg}`,
    };
    const result = await transport.sendMail(options);

    res.status(200).json(result);
  } catch (err) {
    console.log("there is an error : ", err);
    res.status(400).json(err);
  }
}

module.exports.sendMail = sendMail;
