import style from "../styles/ProfilPicture.module.css";
import Image from "next/image";

export default function ProfilPicture({ avatar_url, username }) {
  return (
    <div className={style.container}>
      <div className={style.img}>
        <Image
          src={avatar_url}
          alt="profil avatar"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <h2>{username.toUpperCase()} </h2>
    </div>
  );
}
