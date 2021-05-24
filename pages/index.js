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
export default function Home({ OSU_API_SECRET, userIDStatus, devStatus }) {
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

  //vérifier l'état des cookies code lorsque l'appli est monté
  useEffect(() => {
    // on vérifie si le user s'est déjà connecté auparavant et qu'on a toujours son user id stocké en cookie
    if (userIDStatus) {
      setUserID(true);
      if (getCookie("code") == "true") {
        document.cookie = "code=false; ";
        const code = getUrlParam("code");
        const codeAux =
          "def502003b45288c833fb5ba53e7ac7d5c06ba539e15bf5782de73832aa81456d0f5d1d56724bddb0514e5d565bb0a7c10736fbe03b35fc897946a31eaf807d45d6a14720c6d063b66c438c9ebe8be27169512d8452d33dafc94a735e245ce072eaa3a07a6e23c2f944c176ecdbaaa4b7a44e7e915889987e9947978c9ef374e5c33c9bc2f5b727122615fe3dc59430c61c146c521384bfe7bd893025d8e6788d808bb44be857a1dadd6461087021fb803bc1e0931d31ea5109197309ee2f433d59945e6da83f516f44cd68e7fa198db063a27cc8c1df07b5067f27eb469c62865555007d2d6e5e2959b52108d8a14d86f2f9a56307189e61800656a21890edc2dc1f9feccc33988a4df35fca8ecb488d08be35038b07e04e42cb7e3d3d9960728fe9906bc24701d19e18b7d95e4406a4b0b90f7ee07dc824f84e59880fb8af287d2c7d11db7b146290b607337bd58e9dfba9b40af8496683b43369394b8ed75d17233be9a9dd16d087dc3015368d7";
        if (devStatus) {
          getToken(code);
        } else {
          getToken(codeAux);
        }
      } else {
        //créer le cookie de redirection
        document.cookie = "code=true; ";
        try {
          if (devStatus) {
            window.location.href = `http://localhost:5500`;
          } else {
            window.location.href = `https://osu.ppy.sh/oauth/authorize?client_id=7322&redirect_uri=https://example.com&response_type=code&scope=public`;
          }
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
          <Connect devStatus={devStatus} error={error} setError={setError} />
        ) : null}
        {error ? <Error setError={setError} setUserID={setUserID} /> : null}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  // get the userID cookie
  let userIDStatus = false;
  let cookies = cookie.parse(context.req.headers.cookie);
  let userID = cookies.userID;
  if (userID != undefined) {
    userIDStatus = true;
  }

  //get the NODE_ENV status
  let devStatus = true;
  if (process.env.NODE_ENV == "production") {
    devStatus = false;
  }
  return {
    props: {
      OSU_API_SECRET: process.env.OSU_API_SECRET,
      userIDStatus: userIDStatus,
      devStatus: devStatus,
    },
  };
}
