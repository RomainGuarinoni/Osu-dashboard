import style from "../styles/Home.module.css";
import Head from "next/head";
import HomeProfil from "../components/HomeProfil";
import HomeDashboard from "../components/HomeDashboard";
import Connect from "../components/Connect";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getCookie } from "../function/getCookie";
import { getUrlParam } from "../function/getUrlParam";
export default function Home({ OSU_API_SECRET }) {
  //return cookie value
  const router = useRouter();
  //return the dcode in the URL after redirection from osu website

  // return the token or an error
  async function getToken(code) {
    await axios({
      method: "post",
      url: "/api/getAccessToken", // a changer pour la prod
      data: {
        client_id: 6885,
        client_secret: OSU_API_SECRET,
        code: code,
        redirect_uri: "https://example.com", // a changer pour la prod
      },
    })
      .then((res) => {
        document.cookie = `token = ${res.data.access_token}`;
        router.push({
          pathname: "Dashboard",
        });
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
    if (getCookie("userID") != null) {
      setUserID(true);
      if (getCookie("code") == "true") {
        document.cookie = "code=false;";
        const code = getUrlParam("code");
        console.log(code);
        const codeAux =
          "def50200975523a9302808cb9652a4b9ec5e647da329fc3e241562dc926205ac4dc3a0ce9c423bf13c9b66ec7fc9ff0519ad09ecc8b94354780bdca688d36f0fbcae2c862e2d31f6414d2ff5c12550012c7044a4933e1da1b3c363fa64cdfcf4daede6c89ee902224d7ae7c6494f17f5f05330cc92c2cc043401ae2a4905bbc9fab5f5bca251d166c16dc77d10eb4ef32d66f797ae3b77aec5e200bec845a22ec0e55093e69092dc799945d3a02cd7a28b8c81b3b0ddd2df143ef96248e69455a1bff82ef488848eefdef3e9a154052912f02be7bcfa6a593079c2d3eeb989cdffcd7ccb9c66d4729b27435f83022d2db463ad1cb5e0ee9207030f9982f804b2e04ba0972437a4c961c15beef7f9aebbd0bf4a35b11248262f1d4ba102622aeddc5ae0f45f88772c2136c8d75908da635722426504ee6a5c9f5078f2d57609e8c087f721c64b66da195b5e4d58a92e8dff15a0e20b99b4268417cf30670630656dc85a47ed2f97a4163c0864ed3b5d";
        getToken(codeAux);
      } else {
        //créer le cookie de redirection
        document.cookie = "code=true;";
        try {
          window.location.href = `http://localhost:5500`; //https://osu.ppy.sh/oauth/authorize?client_id=6885&redirect_uri=https://example.com&response_type=code&scope=public
        } catch (err) {
          setError(true);
          document.cookie = "code=false;";
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

export async function getStaticProps(context) {
  return {
    props: {
      OSU_API_SECRET: process.env.OSU_API_SECRET,
    },
  };
}
