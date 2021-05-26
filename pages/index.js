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
        redirect_uri: "https://osu-dashboard.vercel.app", // a changer pour la prod
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

  def50200659c0c9b80cecb60a50f1fe838672753a7bf9f36964793e6780e97549a7fc29f39645c28f30b06512abc66736c3f04c577d8184cba9501e109a2e7bfe37f63695aa35d11b2ab7a97c8925bfc81c7eee472b84f81099ca6529bf280c93053913adb3f25e3cb95d643a7baa953863ef134febbfab1fa31ac4780c8af684ca1ede766b2ff1b9cf6be784b5c2488f71046670e4ed54b5a2dc19da37056b0863372de3b67b9cdaac299342fb5561d9419224d84f5b7a4674c7940f985d8a736789ddc124efebbafd8ad027c63b350754845e931b19945f27fa5e58f7b1e578cdf0ac950624a2a7da50d4b9473fa195682f14f573a93971119e2f42aa4558a5d03713142b9f0ebc243d2f4262a6f00fc67f39f527ed031f6647dbcfad389b610f40fff96e289721057abac577f3d5bec9fe8aa8118efe05638b67a9ff88dca7b889080e50f6c60bb130ed8695b41a335d459989c93a51feaef20a76712572e63a4cae3e458316eb9149f9cd0c9557f3a0f7b68bf00a689e6b319cc;
  def50200dad3893ad4ae20294e3980939f341dd1d9dc3fef78c0aaa20fbd9741d5afdd60c81d3dbbec00374586d0e48a014ad7414eb46f2f8fbbc9988dd26e585b21ec9802f90a5518bd22293dde1dc9a10a70ae919da54563468443826f47faa0737bdb550fbd75ec017cdcc37e5545f0f851327117946f6b3473e64a42b1be425badb2deb2f216dd821b4eae16ebf97c50d20cf6470d9fd0f65f9407da79d7a5b11e01c3b21766f8290d4862d65f767206e4b03f8f51d1f4e0af537f1f1dd7b1c034b4add6222dd722c480590dff1d8651e5f520f9266f86ec129cd919bc224fb9a170da6a30a02b0185eb37d7a2aeb7a07dfdf71d24a681202fd0c51b0239dcc6abedb7fa50078f832c61118e120d3cae6cef91400c6930c71f82e1ff25bff3a6ca7c260ecb2ab6271491c3de631696ea310641000176da0ccb6678430bde00b64259c1083303f25c48a9244ef0a669b80f4c1053478ce13e50920a84f690fd1838f1465a03849f84e9404775702d84e41ff656e9a4db60cfc3a6;
  const [userID, setUserID] = useState(false);
  const [error, setError] = useState(false);
  //vérifier l'état des cookies code lorsque l'appli est monté
  useEffect(() => {
    if (userIDStatus) {
      setUserID(true);
      if (getCookie("code") == "true") {
        document.cookie = "code=false; ";
        const code = getUrlParam("code");
        const codeAux =
          "def5020032f2819f7eed644a85205ed2c78257259839a64abdeda73f98f36aace3e6f709c21579e60a209d65ff35adc55e315228a1a3f319680554fb6140ad13a7a9511a76ee1abc6357a620ce1aebef3b1a1f82fc50c66fc37b96ba986810c55ec587061032c1c6efac7303a85c2b0f7b4090a082f732a67bf66d060317e9ea6eeee42fc3278a2f9743fba66d1e3c1e0b35f8041765efecc0a63be08d9ab172ba3972361bdba3dc98fbb9f87deb4ccf662cc18cc70724f9d6403f35ed0cd6faf4d7332b103b64757dd4695db59acdd1abc0ff26c482513940465a53cf8301e668af055f8f25f9a53147463c47d6ad3e491f14ac2b4af640383fe43c58113153d55c2fa68aef586d551cc62512857418a04f2bcdc39b5ec72547a0924e72fb310bab7046a7d6076e2ba387daba3afd3bbae151f5dee2ccad582313e5ec1636a8cab96a18218df4cdbfb111c0e55639fb54927326f29da06db91898582a9e6697951d7f8f7320100e541ef8445bde37a6feff6ab9a4912e4648e223c6";
        if (devStatus) {
          getToken(codeaux);
        } else {
          getToken(code);
        }
      } else {
        //créer le cookie de redirection
        document.cookie = "code=true; ";

        try {
          if (devStatus) {
            window.location.href = `http://localhost:5500`;
          } else {
            window.location.href = `https://osu.ppy.sh/oauth/authorize?client_id=7322&redirect_uri=https://osu-dashboard.vercel.app&response_type=code&scope=public`;
          }
        } catch (err) {
          setError(true);
          document.cookie = "code=false; ";
        }
      }
    } else {
      document.cookie = "code=false; ";
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
  if (context.req.headers.cookie != undefined) {
    let cookies = cookie.parse(context.req.headers.cookie);
    let userID = cookies.userID;
    if (userID != undefined) {
      userIDStatus = true;
    }
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
