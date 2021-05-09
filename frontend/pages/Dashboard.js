import style from "../styles/Dashboard.module.css";
import Head from "next/head";
import Profil from "../components/Profil";
import GraphContainer from "../components/GraphContainer";
export default function Dashboard() {
  return (
    <div className={style.container}>
      <Head>
        <title>Osu Dashboard</title>
      </Head>
      <Profil />
      <GraphContainer />
    </div>
  );
}
