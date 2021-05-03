import style from "../styles/HomeProfil.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faTrophy,
  faChartLine,
  faUserAlt,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import sigma from "../assets/sigma.svg";
import scope from "../assets/scope.svg";
import MapRank from "./MapRank";
export default function HomeProfil() {
  const mapRank = [
    {
      name: "SS",
      color: "white",
    },
    {
      name: "SS",
      color: "yellow",
    },
    {
      name: "S",
      color: "white",
    },
    {
      name: "S",
      color: "yellow",
    },
    {
      name: "A",
      color: "green",
    },
  ];

  const statItem = [
    {
      name: "Global rank",
      icon: faTrophy,
      svg: false,
    },
    {
      name: "Country rank",
      icon: faTrophy,
      svg: false,
    },
    {
      name: "level",
      icon: faArrowUp,
      svg: false,
    },
    {
      name: "Accuracy",
      icon: scope,
      svg: true,
    },
    {
      name: "Total PP",
      icon: sigma, // a changer
      svg: true,
    },
    {
      name: "Max PP",
      icon: faTrophy, // a changer
      svg: true,
    },
    {
      name: "Max combo",
      icon: faTrophy, // a changer
      svg: true,
    },
  ];
  return (
    <div className={style.container}>
      <div className={style.profilImgContainer}>
        <FontAwesomeIcon className={style.profilImg} icon={faUserAlt} />
      </div>
      <div className={style.mapRank}>
        {mapRank.map((element, index) => (
          <MapRank
            key={`${element.name} - ${index}`}
            name={element.name}
            color={element.color}
          />
        ))}
      </div>
      <div className={style.statisticsTitle}>
        <span>
          <FontAwesomeIcon icon={faChartLine} />
        </span>
        <h2>Global statistics</h2>
      </div>
    </div>
  );
}
