import style from "../styles/ContactForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGlobeAmericas } from "@fortawesome/free-solid-svg-icons";
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  function submit(e) {
    e.preventDefault();
    console.log(name);
    console.log(email);
    console.log(msg);
  }

  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1>OSU DASHBOARD</h1>
      </div>
      <form className={style.form} onSubmit={(e) => submit(e)}>
        <h2>Contact us !</h2>
        <div className={style.inputBox}>
          <label htmlFor="nameInput"> Name</label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={style.inputSmall}
            id="nameInput"
          />
        </div>
        <div className={style.inputBox}>
          <label htmlFor="emailInput"> Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={style.inputSmall}
            id="emailInput"
          />
        </div>
        <div className={style.inputBox}>
          <label htmlFor="msgInput"> Message</label>
          <textarea
            required
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className={style.inputLarge}
            id="msgInput"
          />
        </div>
        <button class={style.button} type="submit">
          {" "}
          Submit{" "}
        </button>
      </form>
      <footer className={style.footer}>
        <a
          href="https://github.com/RomainGuarinoni/Osu-dashboard"
          target="__blank"
        >
          <FontAwesomeIcon className={style.brandIcon} icon={faGithub} />
        </a>
        <a href="https://osu.ppy.sh/home" target="__blank">
          <FontAwesomeIcon className={style.brandIcon} icon={faGlobeAmericas} />
        </a>
      </footer>
    </div>
  );
}
