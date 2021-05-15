const nodeMailer = require("nodemailer");
const { google } = require("googleapis");
const CLIENT_ID =
  "727099782936-gond90d1mk0kpf0glvit1kndnh9g24m1.apps.googleusercontent.com";
const CLIENT_SECRET = "myHsAX76LOpBYJo8KWU1COt5";
const REDIRECT_URL = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04GXX3UftY5-9CgYIARAAGAQSNwF-L9Irw7dN2Ro3Y13mEbKB2E5rZ6zUgZDopWR04SaEUJtHqiJ-e_XrMrSdCQRKIqQGthBU7Dk";
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
        user: "romain.guar91@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
      rejectUnauthorized: false,
    });

    const options = {
      from: "OSU DASHBOARD 💻",
      to: "romain.guar91@gmail.com",
      subject: "Dashboard contact",
      text: `${req.body.user} \n ${req.body.email} \n \n ${req.body.msg}`,
    };
    const result = await transport.sendMail(options);

    res.status(200).json(result);
  } catch (err) {
    console.log("trherei s na error", err);
    res.status(400).json(err);
  }
}

module.exports.sendMail = sendMail;
