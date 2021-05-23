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
        document.cookie = "code=false;";
        const code = getUrlParam("code");
        console.log(code);
        const codeAux =
          "def502002ef4fb78e266e844e1689d95e10f4a6d42107d146337d2098b4ca46e29334cb04db1f38e20ec86b7280d4a9d7be11e49d5257387c1918c99d48e6f787c01002b9a5d7e5678c574896a9b4e157e645654959d2e6410a714fb329629eb40383ac6c5f1c8aa946289b48373aefd7beee0ba0f058942b9123fa4c3945e48ce0db8e9d20c8f18d36e67ec9bdd10103d24911f660ebddeaf2dbc704fa90e6eba8e3f7ccd6d31ac523db97785284951f982d8627ba31fd76f2aacc36cd70fc0a29e6eb0077c152c70c60d20d04a48092b1522e87a3a1b59ac6a0043b32ddf36f960391c2c5c8a0ed54b3f507184b6910412d68aaef8aee727be80bf08ee8b3fe191af535f6f1d9c8a8507a5933d749d0f60af84ef3084b3c59204df57ab2f4821efaead1f200d04ac2a4619b5a205ab8a6acf32055118f293ad37160fe2897c9ecc28e42098e6ad98180397f06397402d98be9b3e18bed7da2ebf2ebe4afed1f633da0309b7b4004b9c75e9eb75ee";
        getToken(codeAux);
      } else {
        //créer le cookie de redirection
        document.cookie = "code=true;";
        console.log("need to redirect");
        try {
          window.location.href = `http://localhost:5500`; //https://osu.ppy.sh/oauth/authorize?client_id=7322&redirect_uri=https://example.com&response_type=code&scope=public
        } catch (err) {
          setError(true);
          document.cookie = "code=false;";
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

export async function getStaticProps() {
  return {
    props: {
      OSU_API_SECRET: process.env.OSU_API_SECRET,
    },
  };
}
