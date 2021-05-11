import style from "../styles/GraphContainer.module.css";
import useSWR from "swr";
import { fetcher } from "../function/fetcher";
import { getUrlParam } from "../function/getUrlParam";
import Loader from "./Loader";
import RecentAccuracy from "./RecentAccuracy";
import RecentDifficulty from "./RecentDifficulty";
import RankEvolution from "./RankEvolution";
import RecentMod from "./RecentMod";
import TopPlaces from "./TopPlaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGlobeAmericas } from "@fortawesome/free-solid-svg-icons";
export default function GraphContainer({ setErrorSWR }) {
  const { data, error } = useSWR(
    `http://localhost:5000/getGraph/${getUrlParam("userID")}/${getUrlParam(
      "token"
    )}`,
    fetcher
  );

  if (error) {
    console.log("there was an error there");
    setErrorSWR(true);
    return <div className={style.container}></div>;
  }
  if (!data)
    return (
      <div className={style.container}>
        <header className={style.header}>
          <h1 className={style.title}>OSU DASHBOARD</h1>
        </header>
        <div className={style.containerGraph}>
          <div className={style.loader}>
            <Loader />
          </div>
        </div>
        <footer className={style.footer}>
          <a
            href="https://github.com/RomainGuarinoni/Osu-dashboard"
            target="__blank"
          >
            <FontAwesomeIcon className={style.brandIcon} icon={faGithub} />
          </a>
          <a href="https://osu.ppy.sh/home" target="__blank">
            <FontAwesomeIcon
              className={style.brandIcon}
              icon={faGlobeAmericas}
            />
          </a>
        </footer>
      </div>
    );
  return (
    <div className={style.container}>
      <header className={style.header}>
        <h1 className={style.title}>OSU DASHBOARD</h1>
      </header>
      <div className={style.containerGraph}>
        <div className={style.graphLeft}>
          <RecentAccuracy
            dataValue={data.recentAccuracy}
            labelsValue={data.labels}
          />
          <RankEvolution dataValue={data.rankEvolution} />
          <TopPlaces dataValue={data.topPlaces} />
        </div>
        <div className={style.graphRight}>
          <RecentDifficulty
            dataValue={data.recentDifficulty}
            labelsValue={data.labels}
          />

          <RecentMod dataValue={data.recentMod} />
        </div>
      </div>
      <footer className={style.footer}>
        <a
          href="https://github.com/RomainGuarinoni/Osu-dashboard"
          target="__blank"
        >
          <FontAwesomeIcon className={style.brandIcon} icon={faGithub} />
        </a>
        <a href="https://osu.ppy.sh/home" target="__blank">
          <FontAwesomeIcon className={style.brandIcon} icon={faGlobeAmericas} />
        </a>
      </footer>
    </div>
  );
}
