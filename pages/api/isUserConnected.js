import cookie from "coookie";

export default function handler(req, res) {
  let cookies = cookie.parse(req.headers.cookie || "");
  let name = cookies.userID;
  if (name) {
    res.status(200).json("userID has been find");
  } else {
    res.status(404).json("user ID not find");
  }
}
