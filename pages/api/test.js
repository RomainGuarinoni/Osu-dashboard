import cookie from "cookie";

export default function handler(req, res) {
  let cookies = cookie.parse(req.headers.cookie || "");
  if (cookies.userID != undefined) {
    res.status(200).json("user ID : " + cookies.userID);
  } else {
    res.status(404).json("there is nothing ...");
  }
}
