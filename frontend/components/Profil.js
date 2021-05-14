import style from "../styles/Profil.module.css";
import ProfilPicture from "../components/ProfilPicture";
import { fetcher } from "../function/fetcher";
import Loader from "../components/Loader";
import { getUrlParam } from "../function/getUrlParam";
import useSWR from "swr";
import MapRank from "../components/MapRank";
import GlobalStatistics from "../components/GlobalStatistics";
import Navigation from "../components/Navigation";
export default function Profil({ setErrorProfil }) {
  const userID = getUrlParam("userID");
  const token = getUrlParam("token");
  function sortMapRank(object) {
    let objectAux = {
      ssh: object.ss,
      ss: object.ss,
      sh: object.sh,
      s: object.s,
      a: object.a,
    };
    return objectAux;
  }
  const { data, error } = useSWR(
    `http://localhost:5000/getUser/${userID}/${token}`,
    fetcher
  );
  if (error) {
    setErrorProfil(true);
    console.log("%cerror", "color : red");
    return <div className={style.container}></div>;
  }

  if (!data)
    return (
      <div className={style.container}>
        <Loader />
      </div>
    );
  const finalData = JSON.parse(data);
  //setErrorProfil(false);
  return (
    <div className={style.container}>
      <ProfilPicture
        avatar_url={finalData.avatar_url}
        username={finalData.username}
      />
      <div className={style.mapRank}>
        {Object.keys(sortMapRank(finalData.statistics.grade_counts)).map(
          (element, index) => (
            <MapRank
              key={`${element}-${index}`}
              name={element.toUpperCase()}
              color={"white"}
              data={finalData.statistics.grade_counts[element]}
            />
          )
        )}
      </div>
      <GlobalStatistics
        globalRank={finalData.statistics.global_rank}
        countryRank={finalData.statistics.country_rank}
        level={finalData.statistics.level.current}
        accuracy={finalData.statistics.hit_accuracy}
        totalPP={finalData.statistics.pp}
        maxPP={finalData.bestMapScore}
        maxCombo={finalData.statistics.maximum_combo}
      />
      <Navigation />
    </div>
  );
}
