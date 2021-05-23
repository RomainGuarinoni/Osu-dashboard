import cookie from "cookie";
/*req => {
    key : String,
}*/
export default function handler(req, res) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(req.body.key, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: new Date(0),
      sameSite: "strict",
      path: "/",
    })
  );

  res.status(200).json("cookie has been deleted");

}
