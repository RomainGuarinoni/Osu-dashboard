import style from "../styles/Home.module.css";
import Head from "next/head";
import HomeProfil from "../components/HomeProfil";
import HomeDashboard from "../components/HomeDashboard";
import Connect from "../components/Connect";
import Loader from "../components/Loader";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
export default function Home({ OSU_API_SECRET }) {
  //return cookie value
  const router = useRouter();
  function getCookie(value) {
    const cookie = document.cookie;
    let result = cookie.split("; ");
    try {
      // on essaye de trouver le cookie code
      result = result.find((row) => row.startsWith(value)).split("=")[1];
      return result;
    } catch (error) {
      //sinon on retourne null
      return null;
    }
  }
  //return the dcode in the URL after redirection from osu website
  function getTheCode() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");

    /*router.push({
      pathname: "Dashboard",
      query: { code: code },
    });*/
    return code;
  }

  // return the token or an error
  async function getToken(code) {
    await axios({
      method: "post",
      url: "http://localhost:5000/getAccessToken", // a changer pour la prod
      data: {
        client_id: 6885,
        client_secret: OSU_API_SECRET,
        code: code,
        redirect_uri: "https://example.com",
      },
      
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(`error in acios : ${e}`);
      });
  }

  const [userID, setUserID] = useState(false);

  //vérifier l'état des cookies code lorsque l'appli est monté
  useEffect(() => {
    // on vérifie si le user s'est déjà connecté auparavant et qu'on a toujours son user id stocké en cookie
    if (getCookie("userID") != null) {
      setUserID(true);
      if (getCookie("code") == "true") {
        document.cookie = "code=false;";
        const code = getTheCode();

        const codeAux =
          "def5020077c3add17ac6112a359a56f6d6058057a0fd313e73eeee2bb9221e052655b6f8392a0efb9826bfee4e577879e41934e9797e5758433422fe1e513b2a5c255bf68685bf1cd1bd257fa5f038b8b5af41080074b2575ac91329723fd58c9f6a3fedf0134d1171210017bd1fb89ca5ccd3e9446acd4fbe15e9f7e74dcb0a6505e93997bfd21a7e6a13aab9b5998448598eb6d5c00ebf48eedd442b7f9066b39b7fe1cc8b575b12ddd48325d3750e6eed7e92c74e6215f7e3ac9379f340065fd3345660e468c5e6718866f0c6b0a617dd6955341e8de43cc1138dea8f6eaddbd7f2dec29cef97d3de9d21451558caa4a9e5919b257563ce4c3dd8d547b8e0cdbcec6f2f27fb6a8afa170dbff7d8ece019dc9d5d81b55cd2a8dd1d99cc01de345706d59a637e1b5c78f2e0c56493d22e08777e847b5ac26a6a616a63d5c17e12c0c7f2c133b2a84a5657db5ef2ad1ea06897e72c07ef1ded7331c754ee88e24319a1374efbac6402488acc64b1e6";
        getToken(codeAux);
      } else {
        //créer le cookie de redirection
        document.cookie = "code=true;";
        window.location.href = `http://localhost:5500`; //https://osu.ppy.sh/oauth/authorize?client_id=6885&redirect_uri=https://example.com&response_type=code&scope=public
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
        {userID ? <Loader /> : <Connect />}
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
