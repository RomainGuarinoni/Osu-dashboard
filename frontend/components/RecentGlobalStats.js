import style from "../styles/RecentGlobalStats.module.css";
import GraphLayout from "./GraphLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faStopwatch,
  faTimesCircle,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";

export default function RecentGlobalStats({
  timePlayed,
  averageFault,
  averageBPM,
  averageAR,
}) {
  const stats = [
    {
      data: Math.round(averageFault * 10) / 10,
      label: "average fault",
      icon: faTimesCircle,
    },
    {
      data: Math.round(averageBPM * 10) / 10,
      label: "average BPM",
      icon: faStopwatch,
    },
    {
      data: `${Math.round(timePlayed / 60)} min ${timePlayed % 60} sec`,
      label: "total time played",
      icon: faClock,
    },
    {
      data: Math.round(averageAR * 10) / 10,
      label: "average AR",
      icon: faBolt,
    },
  ];
  return (
    <GraphLayout>
      <p className={style.title}> Recent General Stats</p>
      <div className={style.container}>
        {stats.map((item, index) => (
          <div key={`${index}-${item.label}`} className={style.item}>
            <FontAwesomeIcon className={style.icon} icon={item.icon} />
            <p className={style.data}>{item.data}</p>
            <p className={style.label}>{item.label} </p>
          </div>
        ))}
      </div>
    </GraphLayout>
  );
}
