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
export default function Home({ OSU_API_SECRET, userIDStatus }) {
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
            /*router.push({
              pathname: "Dashboard",
            });*/
            console.log("yeah");
          })
          .catch(() => setError(true));
      })
      .catch((e) => {
        setError(true);
      });
  }

  const [userID, setUserID] = useState(false);
  const [error, setError] = useState(false);

  //vérifier l'état des cookies code lorsque l'appli est monté
  useEffect(() => {
    // on vérifie si le user s'est déjà connecté auparavant et qu'on a toujours son user id stocké en cookie
    if (userIDStatus) {
      setUserID(true);
      if (getCookie("code") == "true") {
        document.cookie = "code=false; ";
        const code = getUrlParam("code");
        const codeAux =
          "def5020052947bf8ab6b42c61b3d96549639e9eefc5ab8fc808d792b84f32f42fa2ef3e52b199df79bf11b232fb9d3d8646053ec7fd532e9c158cddf78a069afef925d71d4c3a9ce5ced0a4c1cca32277880222ec47e22378990a17ee41c1428b5714fbe58cd299cb0729215621f65a1a0ea249fa574f9b3e2c5a0c1d7f497b703760b02e06a862841274431bda0fb59c5fc98305a37c0b014bff88029654049c4a4ea99efb2f4e9900e978be600763453bcec9e2ac6a4716466b028d9e1846680554ed28d8ef585a5dcdbb913adcc419463191689718a23da65a8b5c2060eb84efc7e0c589b0352b2e6681cef5f708584207b870eabb97dd3f5581a32fbcbd34a3c8a1f6b9e588651dd6b5802e5e8fdfa473dbc8c95a5b9f6bae1d55144f3ed66a3bf923805c751c447697111cf766191737ed6f3614abcee60619838458ede754dd77d195a4d6a2a2e257c6b3c43b6dcb6fcf5aaaa00c318a6ef0e8d72bf395bb6250326632c9526c90a23406e0c";
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
    }
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
      userIDStatus: userIDStatus,
    },
  };
}
