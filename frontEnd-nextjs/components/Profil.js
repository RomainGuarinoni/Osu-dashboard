import style from "../styles/Profil.module.css";
import ProfilPicture from "../components/ProfilPicture";
export default function Profil() {
  return (
    <div className={style.container}>
      <ProfilPicture />
    </div>
  );
}
