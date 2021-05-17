import style from "../styles/Profil.module.css";
import ProfilPicture from "../components/ProfilPicture";
import { fetcher } from "../function/fetcher";
import { useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { getCookie } from "../function/getCookie";
import useSWR from "swr";
import MapRank from "../components/MapRank";
import GlobalStatistics from "../components/GlobalStatistics";
import Navigation from "../components/Navigation";
export default function Profil({ setErrorProfil }) {
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
  const { data, error } = useSWR("/api/getUser", (url) =>
    axios({
      method: "post",
      url: url,
      data: {
        userID: getCookie("userID"),
        token: getCookie("token"),
      },
    }).then((res) => res.data)
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

  //setErrorProfil(false);
  return (
    <div className={style.container}>
      <ProfilPicture
        avatar_url={data.avatar_url}
        username={data.username}
        className={style.ProfilPicture}
      />
      <div className={style.mapRank}>
        {Object.keys(sortMapRank(data.statistics.grade_counts)).map(
          (element, index) => (
            <MapRank
              key={`${element}-${index}`}
              name={element.toUpperCase()}
              color={"white"}
              data={data.statistics.grade_counts[element]}
            />
          )
        )}
      </div>
      <GlobalStatistics
        className={style.GlobalStatistics}
        globalRank={data.statistics.global_rank}
        countryRank={data.statistics.country_rank}
        level={data.statistics.level.current}
        accuracy={data.statistics.hit_accuracy}
        totalPP={data.statistics.pp}
        maxPP={data.bestMapScore}
        maxCombo={data.statistics.maximum_combo}
      />
      <div className={style.navigation}>
        <Navigation />
      </div>
    </div>
  );
}
