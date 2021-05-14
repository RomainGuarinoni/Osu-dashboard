import style from "../styles/Dashboard.module.css";
import Head from "next/head";
import Profil from "../components/Profil";
import GraphContainer from "../components/GraphContainer";
import Error from "../components/Error";
import { useState } from "react";
export default function Dashboard() {
  const [errorProfil, setErrorProfil] = useState(false);
  const [errorDashboard, setErrorDashboard] = useState(false);
  return (
    <div className={style.container}>
      <Head>
        <title>Osu Dashboard</title>
      </Head>
      <div
        className={style.dashboardContainer}
        style={
          errorProfil || errorDashboard ? { filter: "brightness(40%)" } : {}
        }
      >
        <Profil setErrorProfil={setErrorProfil} />
        <GraphContainer setErrorDashboard={setErrorDashboard} />
      </div>

      {errorProfil || errorDashboard ? (
        <div className={style.error}>
          <Error returnHome={true} />
        </div>
      ) : null}
    </div>
  );
}
