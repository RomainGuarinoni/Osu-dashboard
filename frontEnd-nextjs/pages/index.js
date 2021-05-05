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
          "def5020040665940840d72e35d418f91bcfe86c12f7a8f06a092e4b42aad5f59a1e82894bfb8f8c6e9c9b2feea978b0c29723111013d3edf428f46bc516cd88c46e98729c6b74e414bd1397f93b0ab50a5f1048a95d3c0387fd048648d14643cad30e7982f830dfe333d475c31a77a777b40c894100caec932415534e366be146442c4179356e7f1412eebcf77fc74552298e72ca6bd804afc6012483266924ef2a7b0cdd75dc58d324c92d9d8a712f35fb7f0704b8f7cb91c8dace765137024ca7e1ecde698b64c7417d4b48db7a8072296a628c0583494bb3935bdc304b1ff0b6926a4ab2a0edbbed8c16852f4476159d323c74bb1f8534efb370b582b9f9f1ce8a5b570de6cb6ce1b61789478d0d94f4e03364d126f23da6e78febf0d4ffb9bc3e462491c206d2a8b42582b39032ce4425707b1080bcf1f8bab0c8e6f01eb6b2d76a2b9aa9a8f655053728338cf24122108c837ddd62a62235102472beed25931d7ebc51e8e76ed673e373875d3";
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
