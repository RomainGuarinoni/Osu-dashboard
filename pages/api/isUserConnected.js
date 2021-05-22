import cookie from "coookie";

export default function handler(req, res) {
  let cookies = cookie.parse(req.headers.cookie || "");
  let userID = cookies.userID;
  if (userID != undefined) {
    res.status(200).json("userID has been find " + userID);
  } else {
    res.status(404).json("user ID not find " + userID);
  }
}
