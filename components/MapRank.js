import style from "../styles/MapRank.module.css";

export default function MapRank({ name, color }) {
  return (
    <div className={style.container}>
      <p style={{ color: `var(--${color})` }}> {name} </p>
    </div>
  );
}
