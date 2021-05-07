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
          "def5020052f7673d60ca71bb1442c8982ebbd99eaf6e60dff51560a5bbc40f5c9996b527005dd8355685109838eca2704e4806e09ef9ea5c4aa6102d84571a6bdf40d6a499c01b5e6497752a9d75d90a3805e7bf7db48a513556deb732765b95f0d41f3ac883acb426817d1ba38c8aa538546e71ad352ea5b9b028c4b9c8b355b93338483720b90af1e61eb37cbf7ab2a4b4bcf0d295cae11c3afb37b842439b20fd48458dddee364ad10cd18506765d7056435f6a345309da701f5615172a797c0b304ce77ceee9e01304d89707244a22f609ffdec35a4dd96cbc3347055cdda8451719779bec31f55e71dd5d56b5bafd0fa7b38203df727f6e97c092d8d426041bed9763dd9bf1c0cae9e536b898d16f1247537dc1dcc236c0c06f53261a56c283feaa2340160e1c1e2eb02f61ce8b0a523a4ce25b793a2c8f91c2e3d8b26c53a8b3e6674ea664e82278fb2dfd33b74d96ed32117490b606ce27fe58f6773e230a82f273a568fe32b53d15e0eb02";
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
