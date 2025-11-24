import "./Header.css";
import { getToken } from "../utils/token";
import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  return (
    <header>
      <a href="/" className="logo">
        {/* <img src="/assets/img/logo.png" alt="Logo" className="logo" /> */}
        React-test
      </a>
      <nav>
        <ul>
          <li>
            <a href="/" className={location.pathname == "/" ? "active" : ""}>
              Accueil
            </a>
          </li>
        </ul>
        <ul>
          <li>
            {getToken() ? (
              <a href="/logout">Déconnexion</a>
            ) : (
              <a href="/login">Connexion</a>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
