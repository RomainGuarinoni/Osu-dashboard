import style from "../styles/Home.module.css";
import Head from "next/head";
import HomeProfil from "../components/HomeProfil";
import HomeDashboard from "../components/HomeDashboard";
export default function Home() {
  return (
    <div className={style.container}>
      <Head>
        <title>Osu dashboard</title>
      </Head>
      <HomeProfil />
      <HomeDashboard />
    </div>
  );
}
