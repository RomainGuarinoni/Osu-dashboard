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
import { getUrlParam } from "../function/getUrlParam";
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

  // return the token or an error
  async function getToken(code) {
    await axios({
      method: "post",
      url: "http://localhost:5000/getAccessToken", // a changer pour la prod
      data: {
        client_id: 6885,
        client_secret: OSU_API_SECRET,
        code: code,
        redirect_uri: "https://example.com", // a changer pour la prod
      },
    })
      .then((res) => {
        router.push({
          pathname: "Dashboard",
          query: { userID: getCookie("userID"), token: res.data.access_token },
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
          "def50200bff00111a6e4df77928cc95954720493fae0d08ed9610c30470572dcbfea637d0aa9fc4c83e12abd41a36595afff74d724547a10c3e7cc949f837af090ea1bd6f47745159c25718875deccb2e1a365fbd38f263ed2a94135faf40df2f56ef3b32b07324643c2081617bcc171a0a6421a6d3b0cd308dcee9a4de294e33f650cbf2eff45d5ef182f49a7e4e2989e3628a9c5c5d0c6683f40e2ed907b1cb5562e168bdb6b852c3eac6c03c3d26ad231a551e6528fb80fff95db58a7ade49f28cce880d5632a7da67e9e148c7a6646daebf4107844a3616492927928960f555d60a7f69bc4537deb43d83c95d1440a4bd8032738fa799e38921c2292445d1bfd02d458e8d44316168ebdcd8931bb0359e318c7437ac215ca3794c93882c7fafc6e8dabeeffca1e4ea72290426b0ebb6216acab70e29000dc789cda90a62d05316161fb5d9308a7232fc93c604cb916b69c6dfcddd2800797133c4299cbf0b916287acb6dda18ede7bbf4f05335";
        getToken(codeAux);
      } else {
        //créer le cookie de redirection
        document.cookie = "code=true;";
        try {
          window.location.href = `http://localhost:5501`; //https://osu.ppy.sh/oauth/authorize?client_id=6885&redirect_uri=https://example.com&response_type=code&scope=public
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
        {error ? (
          <Error
            error={error}
            setError={setError}
            userID={userID}
            setUserID={setUserID}
          />
        ) : null}
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
