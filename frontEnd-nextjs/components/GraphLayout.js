import style from "../styles/GraphLayout.module.css";

export default function GraphLayout(props) {
  return <div className={style.container}>{props.children}</div>;
}
