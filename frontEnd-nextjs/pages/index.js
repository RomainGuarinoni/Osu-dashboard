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
          "def5020038d0e6b376e26aa3729f9fd9dc070befa734533178becd906bc19722b9908d5ca50743a5ecd5cf68f4743d3958f2ad9bd765fbe400fcac06d5307ea6149dcb8a349d45165b1a6a3301a93a970a19a59a7b6901e3805eaee2fec94362432d1eb027cccd442393524d8ff4e3cf1449e2026f76f5db6f4392e6d2a89e57e3ea7f68c683056225dce57a42d176b75a7779ec4abd38d437bb84945b4164880f3ba0412cdc4dc7b400000ed4826c009dc5a8a21069c028af6966c6ed6ef05a96355e0d66d545233cf072b8291a44433294f3cea56606324a18549b94a7bbc50091b79fe263b37846b5a03b7038e9bb0f790caa065c72ba8e085ee86730db995271abdb378e151db0efdd6b52d654451ab24d1a4cb88eb1df08ff914e5c488a62be99abebc7f4a54ab6b193de5d6679123d60f95924a06b9e3d8c63723d749825f7872e510074eddab4a0be6dce1960b1819722f500501e879308efc52c2ed7afd7fbf5371b53e8c9751fe4063168";
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
