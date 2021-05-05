import style from "../styles/MapRank.module.css";

export default function MapRank({ name, color, data }) {
  switch (name) {
    case "SS":
      color = "yellow";
      break;
    case "SSH":
      color = "white";
      name = "SS";
      break;
    case "S":
      color = "yellow";
      break;
    case "SH":
      color = "white";
      name = "S";
      break;
    case "A":
      color = "green";
      break;
  }

  return (
    <div className={style.container}>
      <div className={style.containerRank}>
        <p style={{ color: `var(--${color})` }}> {name} </p>
      </div>
      <p className={style.data}>{data ? data : null}</p>
    </div>
  );
}
