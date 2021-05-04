import style from "../styles/Home.module.css";
import Head from "next/head";
import HomeProfil from "../components/HomeProfil";
import HomeDashboard from "../components/HomeDashboard";
import Connect from "../components/Connect";
import Loader from "../components/Loader";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
export default function Home() {
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
  const [userID, setUserID] = useState(false);

  //vérifier l'état des cookies code lorsque l'appli est monté
  useEffect(() => {
    // on vérifie si le user s'est déjà connecté auparavant et qu'on a toujours son user id stocké en cookie
    if (getCookie("userID") != null) {
      setUserID(true);
      console.log("getCookie(code) : " + getCookie("code"));
      if (getCookie("code") == "true") {
        console.log("the code is there");
        document.cookie = "code=false;";
        console.log(`code : ${getTheCode()}`);
      } else {
        console.log("need to redirect");
        console.log(document.cookie);
        //créer le cookie de redirection
        document.cookie = "code=true;";
        console.log("code is true now");
        console.log(document.cookie);
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
