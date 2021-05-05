import style from "../styles/ProfilPicture.module.css";
import useSWR from "swr";
import axios from "axios";
import Image from "next/image";
import { fetcher } from "../function/fetcher";
import { getUrlParam } from "../function/getUrlParam";
import Loader from "../components/Loader";
export default function ProfilPicture() {
  const { data, error } = useSWR(
    `http://localhost:5000/getUser/${getUrlParam("userID")}/${getUrlParam(
      "token"
    )}`,
    fetcher
  );
  if (error)
    return (
      <div>
        <p>error</p>
      </div>
    );
  if (!data) return <Loader />;
  /*<Image
          src={data.avatar_url}
          alt="profil avatar"
          layout="fill"
          objectFit="contain"
        />*/
  return (
    <div className={style.container}>
      <div className={style.img}>
        <Image
          src={data.avatar_url}
          alt="profil avatar"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <h2>{data.username.toUpperCase()} </h2>
    </div>
  );
}
