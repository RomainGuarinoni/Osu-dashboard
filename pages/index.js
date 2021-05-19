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
        document.cookie = "code=false;";
        const code = getUrlParam("code");
        console.log(code);
        const codeAux =
          "def50200dc3a09f56247303e5d0a96b048e069897c3c81f395693491db2dfc4d97b0f7b38ed6a5e6e0ca3bfb00121fa7a2035e24bd836099d9984687916db2c16eee0e5222465de4fa93d4859b98dab4283b0c04b0df197cb64b804a953bff6059eb3c798026d2dfbf35342d665b6f65ef1bfeafe4bc0351c1c90c993a3af0927431c8e29d152927e43e5c0994c7aade216f316e29adca6f4b7053603a84cc7aa75aab996c5e722f81bd7912082554568ba44aaa76e9a14363e78ae4dc00e688d59ec9f7da4cc64315f1d0f203e1d3241e2d3416e98531f7532c0e33444d86a5fef3ff2d5779307242c9df77410fd6fc164b03e35530dc195411f10c163dd0ff88bc4d3f46022a4326df6c4c8c8c8fa5f6668d7ee9726d26f81b5a5ec374f1b2b5e2a01e3dcf8d5dfcae6dcbe97adb7b7b086d0b3a27b8773868c0ecb143d2dc704f0baef02433eaa2b386666809cec863d051b654ee1c34b0b19685a0fb52e6ea1714f54d6f9d946420a6c371c9b0";
        getToken(codeAux);
      } else {
        //créer le cookie de redirection
        document.cookie = "code=true;";
        try {
          window.location.href = `http://localhost:5500`; //https://osu.ppy.sh/oauth/authorize?client_id=7322&redirect_uri=https://example.com&response_type=code&scope=public
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

export async function getStaticProps() {
  let userIDStatus;
  await axios({
    url: "/api/isUserConnected",
  })
    .then((res) => {
      userIDStatus = true;
      console.log(res.data);
    })
    .catch((res) => {
      userIDStatus = false;
      console.log(res.data);
    });
  console.log(`user is connected : ${userIDStatus}`);
  return {
    props: {
      OSU_API_SECRET: process.env.OSU_API_SECRET,
      userIDStatus: userIDStatus,
    },
  };
}
