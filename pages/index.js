import style from "../styles/Home.module.css";
import Head from "next/head";
import HomeProfil from "../components/HomeProfil";
import HomeDashboard from "../components/HomeDashboard";
import Connect from "../components/Connect";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import cookie from "cookie";
import axios from "axios";
import { getCookie } from "../function/getCookie";
import { getUrlParam } from "../function/getUrlParam";
export default function Home({ OSU_API_SECRET }) {
  const router = useRouter();
  //return the dcode in the URL after redirection from osu website

  // return the token or an error
  async function getToken(code) {
    await axios({
      method: "post",
      url: "/api/getAccessToken", // a changer pour la prod
      data: {
        client_id: 7322,
        client_secret: OSU_API_SECRET,
        code: code,
        redirect_uri: "https://example.com", // a changer pour la prod
      },
    })
      .then((res) => {
        axios({
          method: "post",
          url: "/api/setCookie",
          data: {
            key: "token",
            value: res.data.access_token,
          },
        })
          .then(() => {
            router.push({
              pathname: "Dashboard",
            });
          })
          .catch(() => setError(true));
      })
      .catch((e) => {
        setError(true);
      });
  }

  const [userID, setUserID] = useState(false);
  const [error, setError] = useState(false);
  let userIDStatus = false;
  //vérifier l'état des cookies code lorsque l'appli est monté
  useEffect(() => {
    axios({
      url: "/api/isUserConnected",
    }).then((res) => {
      console.log("connected");
      setUserID(true);
      if (getCookie("code") == "true") {
        document.cookie = "code=false; ";
        const code = getUrlParam("code");
        const codeAux =

          "def50200cf916bf793ca62e4dbb2bc399fc90306f920ab24a7eb7d39cc4464d4f9ad460f0387b7124b99329f86e2ffa1dc238670f7c246c455c772bfd6d49c4bef0229eb94952140a5a69ab3eefefbeb74d4fac2178bf274dda2288c3aad5a499821a5bb6c31467287f1ef7b644221ff38cb09bd376e58aad633c6158c9cbaceb6651ab52aa67a8b05c80508a961efce5bb23d6bb2a59bf39ea75f8a32e3589b0b79ab4422a9925acb31525f113eecd818ccc211247ea6651f6e6422392a142ae5a1f6ff375dd716b333092523e5ad34507f2176de6d99ccee6c17293cddfe6a2ba449d51b4d5c70b8ff26e82c9f13d26b9779d41836cdb185847fbdf34dc414f6d456ac48b8d5a9d56f698b5d9ac5fb310d35a9cfe4d1f8a4826f2556384f1863a6571f22588fea95b6b758cb373504f1f02d01d056d99ff66e755517595796484d98c6dfa3e497c9324b800f0769d70165400597b6bdee3384591d190938c060f6c957e7a05d8c12b518dc9f4112";
        getToken(codeAux);
      } else {
        //créer le cookie de redirection
        document.cookie = "code=true; ";

        try {
          window.location.href = `http://localhost:5500`; //https://osu.ppy.sh/oauth/authorize?client_id=7322&redirect_uri=https://example.com&response_type=code&scope=public
        } catch (err) {
          setError(true);
          document.cookie = "code=false; ";
        }
      }
    });
  }, []);
  return (
    <div className={style.container}>
      <div className={style.dashboardContainer}>
        <Head>
          <title>Osu dashboard</title>
        </Head>
        <HomeProfil />
        <HomeDashboard />
      </div>
      <div className={style.connectForm}>
        {userID && !error ? <Loader /> : null}
        {!userID && !error ? (
          <Connect error={error} setError={setError} />
        ) : null}
        {error ? <Error setError={setError} setUserID={setUserID} /> : null}
      </div>
    </div>
  );
}


export async function getServerSideProps(context) {
  let userIDStatus = false;
  let cookies = cookie.parse(context.req.headers.cookie);
  let userID = cookies.userID;
  if (userID != undefined) {
    userIDStatus = true;
  }

  return {
    props: {
      OSU_API_SECRET: process.env.OSU_API_SECRET,
    },
  };
}
