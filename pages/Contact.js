import Profil from "../components/Profil";
import style from "../styles/Contact.module.css";
import ContactForm from "../components/ContactForm";

export default function Contact() {
  return (
    <div className={style.container}>
      <Profil />
      <ContactForm />
    </div>
  );
}
